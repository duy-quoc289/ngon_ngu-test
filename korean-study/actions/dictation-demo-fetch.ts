"use server";

import { YoutubeTranscript } from "youtube-transcript";
import type { DictationSegment, FetchResult } from "./dictation";

function parseVideoId(input: string): string | null {
  const s = input.trim();
  const short = s.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (short) return short[1];
  const full  = s.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (full)  return full[1];
  const embed = s.match(/embed\/([A-Za-z0-9_-]{11})/);
  if (embed) return embed[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return null;
}

/** Demo-only: fetch transcript trực tiếp từ YouTube. Dùng ở /dictation-demo. */
export async function fetchDictationSegment(urlOrId: string): Promise<FetchResult> {
  const videoId = parseVideoId(urlOrId);
  if (!videoId) return { error: "URL/ID không hợp lệ." };

  let raw: Awaited<ReturnType<typeof YoutubeTranscript.fetchTranscript>>;
  try {
    raw = await YoutubeTranscript.fetchTranscript(videoId, { lang: "ko" });
  } catch {
    try {
      raw = await YoutubeTranscript.fetchTranscript(videoId);
      raw = raw.filter((s) => /[가-힯]/.test(s.text));
    } catch {
      return { error: "Không lấy được transcript. Video cần có Korean caption." };
    }
  }

  if (!raw?.length) return { error: "Video không có caption tiếng Hàn." };

  raw = raw.filter((s) => /[가-힯]/.test(s.text));

  const segments: DictationSegment[] = [];
  let i = 0;
  while (i < raw.length) {
    let text = raw[i].text.trim();
    const startMs = raw[i].offset;
    let endMs = raw[i].offset + raw[i].duration;
    let j = i + 1;

    while (j < raw.length && endMs - startMs < 5000 && text.length < 12) {
      if (raw[j].offset - endMs > 800) break;
      text += " " + raw[j].text.trim();
      endMs = raw[j].offset + raw[j].duration;
      j++;
    }

    const dur = (endMs - startMs) / 1000;
    if (dur >= 2 && dur <= 15 && /[가-힯]{3,}/.test(text)) {
      segments.push({
        videoId,
        start: Math.floor(startMs / 1000),
        end:   Math.ceil(endMs / 1000) + 1,
        text:  text.replace(/\n/g, " ").trim(),
      });
    }
    i = j;
  }

  if (!segments.length) return { error: "Không tìm được đoạn phù hợp trong video này." };
  return segments[Math.floor(Math.random() * segments.length)];
}
