"use server";

import { createClient } from "@/lib/supabase/server";

export interface DictationSegment {
  videoId: string;
  start: number; // seconds
  end: number;   // seconds
  text: string;
}

export type FetchResult = DictationSegment | { error: string };

/**
 * Lấy 1 segment ngẫu nhiên từ DB (Supabase).
 * Transcript đã được pre-fetch bởi scripts/fetch-dictation.ts — không gọi YouTube lúc runtime.
 *
 * @param level 1=beginner, 2=intermediate (lọc theo video level)
 * @param excludeId UUID của segment vừa làm (tránh lấy lại ngay)
 */
export async function getRandomSegment(
  level = 1,
  excludeId?: string,
): Promise<FetchResult> {
  const supabase = await createClient();

  // Lấy danh sách video IDs theo level
  const { data: videos } = await supabase
    .from("dictation_videos")
    .select("video_id")
    .eq("level", level);

  if (!videos || videos.length === 0) {
    return { error: "Chưa có bài tập nào. Admin cần chạy script fetch-dictation trước." };
  }

  const videoIds = videos.map((v: { video_id: string }) => v.video_id);

  // Query random 1 segment
  let query = supabase
    .from("dictation_segments")
    .select("id, video_id, start_sec, end_sec, text")
    .in("video_id", videoIds)
    .gte("char_count", 8);

  if (excludeId) query = query.neq("id", excludeId);

  // Postgres không có ORDER BY RANDOM() qua JS client trực tiếp,
  // dùng range ngẫu nhiên: đếm tổng → pick offset ngẫu nhiên
  const { count } = await supabase
    .from("dictation_segments")
    .select("*", { count: "exact", head: true })
    .in("video_id", videoIds)
    .gte("char_count", 8);

  if (!count || count === 0) {
    return { error: "Chưa có segment nào. Hãy chạy fetch-dictation script." };
  }

  const randomOffset = Math.floor(Math.random() * count);
  const { data, error } = await query.range(randomOffset, randomOffset).single();

  if (error || !data) {
    return { error: "Không lấy được bài tập. Thử lại." };
  }

  return {
    videoId: data.video_id,
    start:   data.start_sec,
    end:     data.end_sec,
    text:    data.text,
  };
}


