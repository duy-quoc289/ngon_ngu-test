"use server";

import { createClient } from "@/lib/supabase/server";

export type TopicKey = "hangul" | "numbers" | "pronunciation";

/** Đánh dấu bài học đã xong — sync lên server. */
export async function markLessonDone(topic: TopicKey, lessonIdx: number): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("lesson_progress").upsert(
    { user_id: user.id, topic, lesson_idx: lessonIdx, done: true, updated_at: new Date().toISOString() },
    { onConflict: "user_id,topic,lesson_idx" },
  );
}

/** Lấy danh sách bài đã xong của user theo topic. */
export async function getLessonProgress(topic: TopicKey): Promise<Set<number>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_idx")
    .eq("user_id", user.id)
    .eq("topic", topic)
    .eq("done", true);

  return new Set((data ?? []).map((r) => r.lesson_idx as number));
}
