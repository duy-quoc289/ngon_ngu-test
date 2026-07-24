import { createClient } from "@/lib/supabase/client";

/** Port của actions/progress.ts (Server Actions) — cùng query, gọi thẳng client. */

export async function markLessonDone(topic: string, lessonId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("lesson_progress").upsert(
    { user_id: user.id, topic, lesson_id: lessonId, done: true, updated_at: new Date().toISOString() },
    { onConflict: "user_id,topic,lesson_id" },
  );
}

export async function getLessonProgress(topic: string): Promise<Set<string>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("topic", topic)
    .eq("done", true)
    .returns<{ lesson_id: string }[]>();

  return new Set((data ?? []).map((r) => r.lesson_id));
}
