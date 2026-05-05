/**
 * Script admin: fetch transcript từ YouTube → xử lý thành segments → upsert vào Supabase.
 *
 * Chạy: npx tsx scripts/fetch-dictation.ts
 * Hoặc chỉ 1 video: npx tsx scripts/fetch-dictation.ts LHd2U9DWay0
 *
 * Chỉ cần chạy khi thêm video mới. Không ảnh hưởng đến runtime của app.
 */

import { readFileSync } from "fs";
import { YoutubeTranscript, type TranscriptResponse } from "youtube-transcript";
import { createClient } from "@supabase/supabase-js";

// Load .env.local tự động (tsx không load như Next.js dev server)
try {
  const env = readFileSync(".env.local", "utf-8");
  for (const line of env.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes ("value" hoặc 'value')
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
} catch { /* .env.local không bắt buộc */ }

// ── Danh sách video curated ──────────────────────────────────────────────────
// Thêm video ID vào đây khi muốn mở rộng nguồn bài tập.
const CURATED_VIDEOS = [
  { id: "LHd2U9DWay0", title: "세종학당 초급1 — 과 1 문법 (은/는)",    channel: "세종학당", level: 1 },
  { id: "oVaZ5T-1c1Y", title: "세종학당 초급1 — 과 1 어휘",            channel: "세종학당", level: 1 },
  { id: "FodWMWpO2Ng", title: "세종학당 초급1 — 과 1 문법연습",         channel: "세종학당", level: 1 },
  { id: "45ZmkAVUdF0", title: "세종학당 초급1 — 과 2 아니에요",         channel: "세종학당", level: 1 },
  { id: "32bYbj8bWyQ", title: "세종학당 초급1 — 과 3 좋아합니다",       channel: "세종학당", level: 1 },
];

// ── Cấu hình segment ─────────────────────────────────────────────────────────
const MIN_DURATION_MS = 3_000;   // segment tối thiểu 3 giây
const MAX_DURATION_MS = 12_000;  // segment tối đa 12 giây
const MIN_KOREAN_CHARS = 6;      // ít nhất 6 ký tự Korean
const MAX_GAP_MS = 600;          // khoảng trống giữa 2 caption để coi là liền nhau

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasKorean(text: string) {
  return /[가-힯]{3,}/.test(text);
}

/**
 * Gộp các caption liền nhau thành segments có độ dài phù hợp.
 *
 * YouTube trả về từng dòng phụ đề rất ngắn (0.5-2s mỗi dòng).
 * Ta gộp các dòng liền nhau cho đến khi đủ dài hoặc có khoảng trống lớn.
 *
 * Ví dụ input:
 *   [{ text:"안녕하세요", offset:5000, duration:1100 },
 *    { text:"저는 학생이에요", offset:6300, duration:2000 }]
 *
 * → output segment: { startMs:5000, endMs:8300, text:"안녕하세요 저는 학생이에요" }
 * → start_sec=5, end_sec=9 (ceiling +1s buffer)
 */
function buildSegments(captions: TranscriptResponse[], videoId: string) {
  const segments: {
    video_id: string;
    start_sec: number;
    end_sec: number;
    text: string;
  }[] = [];

  let i = 0;
  while (i < captions.length) {
    const startMs = captions[i].offset;
    let endMs = captions[i].offset + captions[i].duration;
    let text = captions[i].text.replace(/\n/g, " ").trim();
    let j = i + 1;

    // Merge caption tiếp theo nếu:
    // 1. Khoảng cách không quá MAX_GAP_MS (vẫn trong cùng 1 câu)
    // 2. Segment chưa đủ dài MIN_DURATION_MS hoặc text chưa đủ MIN_KOREAN_CHARS
    // 3. Tổng chưa vượt MAX_DURATION_MS
    while (j < captions.length) {
      const gap = captions[j].offset - endMs;
      const projectedEnd = captions[j].offset + captions[j].duration;
      if (gap > MAX_GAP_MS) break;
      if (projectedEnd - startMs > MAX_DURATION_MS) break;

      text += " " + captions[j].text.replace(/\n/g, " ").trim();
      endMs = projectedEnd;
      j++;

      // Dừng merge nếu đã đủ dài
      if (endMs - startMs >= MIN_DURATION_MS && text.replace(/\s/g, "").length >= MIN_KOREAN_CHARS) break;
    }

    // Lọc: phải có Korean, đủ dài
    if (hasKorean(text) && endMs - startMs >= MIN_DURATION_MS) {
      segments.push({
        video_id: videoId,
        start_sec: Math.floor(startMs / 1000),
        end_sec:   Math.ceil(endMs / 1000) + 1,  // +1s buffer để không bị cắt cụt âm
        text:      text.trim(),
      });
    }

    i = j;
  }

  return segments;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("❌ Thiếu env vars. Cần NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trong .env.local");
    process.exit(1);
  }
  // Kiểm tra key đúng loại (service role JWT bắt đầu bằng "eyJ" và dài hơn anon key)
  if (key.length < 100) {
    console.warn("⚠️  SUPABASE_SERVICE_ROLE_KEY có vẻ quá ngắn — kiểm tra lại .env.local");
  }
  console.log(`🔑 URL: ${url}`);
  console.log(`🔑 Key: ${key.slice(0, 20)}... (${key.length} chars)`);

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Nếu truyền video ID qua CLI → chỉ xử lý video đó
  const targetId = process.argv[2];
  const videos = targetId
    ? CURATED_VIDEOS.filter((v) => v.id === targetId)
    : CURATED_VIDEOS;

  if (videos.length === 0) {
    console.error(`Video ID "${targetId}" không có trong danh sách CURATED_VIDEOS.`);
    process.exit(1);
  }

  for (const video of videos) {
    console.log(`\n⏳ Đang fetch: ${video.id} — ${video.title}`);

    // 1. Fetch transcript từ YouTube
    let captions: TranscriptResponse[];
    try {
      captions = await YoutubeTranscript.fetchTranscript(video.id, { lang: "ko" });
      console.log(`   📄 ${captions.length} captions nhận được`);
    } catch (err) {
      console.error(`   ❌ Không fetch được transcript:`, err);
      continue;
    }

    // Lọc chỉ giữ Korean captions
    captions = captions.filter((c) => /[가-힯]/.test(c.text));
    if (captions.length === 0) {
      console.warn(`   ⚠️  Không có Korean caption — bỏ qua`);
      continue;
    }

    // 2. Xử lý thành segments
    const segments = buildSegments(captions, video.id);
    console.log(`   🔧 ${segments.length} segments sau khi xử lý`);

    // 3. Upsert video metadata
    await supabase.from("dictation_videos").upsert(
      { video_id: video.id, title: video.title, channel: video.channel, level: video.level, fetched_at: new Date().toISOString() },
      { onConflict: "video_id" },
    );

    // 4. Xoá segments cũ của video này rồi insert lại (đảm bảo fresh data)
    await supabase.from("dictation_segments").delete().eq("video_id", video.id);
    const { error } = await supabase.from("dictation_segments").insert(segments);

    if (error) {
      console.error(`   ❌ Lỗi insert:`, error.message);
    } else {
      console.log(`   ✅ Done — ${segments.length} segments lưu vào DB`);

      // Preview vài segment đầu để kiểm tra
      console.log("   Preview:");
      segments.slice(0, 3).forEach((s) => {
        console.log(`     [${s.start_sec}s-${s.end_sec}s] ${s.text}`);
      });
    }
  }

  console.log("\n🎉 Hoàn thành!");
}

main().catch(console.error);
