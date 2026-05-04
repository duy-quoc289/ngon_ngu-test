"use server";

import { createClient } from "@/lib/supabase/server";

export type TopicKey = "hangul" | "numbers" | "pronunciation";

/** Đánh dấu bài học đã xong — sync lên server. */
export async function markLessonDone(topic: TopicKey, lessonId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("lesson_progress").upsert(
    { user_id: user.id, topic, lesson_id: lessonId, done: true, updated_at: new Date().toISOString() },
    { onConflict: "user_id,topic,lesson_id" },
  );
}

/** Lấy danh sách ID các bài đã xong của user theo topic. */
export async function getLessonProgress(topic: TopicKey): Promise<Set<string>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("topic", topic)
    .eq("done", true);

  return new Set((data ?? []).map((r) => r.lesson_id as string));
}
