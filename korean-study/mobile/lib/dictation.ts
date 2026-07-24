import { createClient } from "@/lib/supabase/client";

/**
 * Port của actions/dictation.ts (Server Action) — bảng dictation_videos/
 * dictation_segments cho phép public read (không cần login, xem
 * dictation-schema.sql), nên port này chạy được ngay không cần auth.
 */

export interface DictationSegment {
  videoId: string;
  start: number;
  end: number;
  text: string;
}

export type FetchResult = DictationSegment | { error: string };

interface VideoRow {
  video_id: string;
}
interface SegmentRow {
  id: string;
  video_id: string;
  start_sec: number;
  end_sec: number;
  text: string;
}

export async function getRandomSegment(level = 1, excludeId?: string): Promise<FetchResult> {
  const supabase = createClient();

  const { data: videos } = await supabase
    .from("dictation_videos")
    .select("video_id")
    .eq("level", level)
    .returns<VideoRow[]>();

  if (!videos || videos.length === 0) {
    return { error: "Chưa có bài tập nào cho cấp độ này." };
  }

  const videoIds = videos.map((v) => v.video_id);

  const { count } = await supabase
    .from("dictation_segments")
    .select("*", { count: "exact", head: true })
    .in("video_id", videoIds)
    .gte("char_count", 8);

  if (!count || count === 0) {
    return { error: "Chưa có segment nào." };
  }

  let query = supabase
    .from("dictation_segments")
    .select("id, video_id, start_sec, end_sec, text")
    .in("video_id", videoIds)
    .gte("char_count", 8);
  if (excludeId) query = query.neq("id", excludeId);

  const randomOffset = Math.floor(Math.random() * count);
  const { data, error } = await query.range(randomOffset, randomOffset).returns<SegmentRow[]>().single();

  if (error || !data) {
    return { error: "Không lấy được bài tập. Thử lại." };
  }

  return {
    videoId: data.video_id,
    start: data.start_sec,
    end: data.end_sec,
    text: data.text,
  };
}
