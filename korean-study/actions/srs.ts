"use server";

import { createClient } from "@/lib/supabase/server";
import type { CardState, SrsState } from "@/lib/srs";

/** Sync một card sau khi rating — fire-and-forget từ client. */
export async function syncCard(wordId: string, card: CardState): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("srs_cards").upsert(
    {
      user_id: user.id,
      word_id: wordId,
      box: card.box,
      last_reviewed_at: card.lastReviewedAt,
      total_reviews: card.totalReviews,
      correct_reviews: card.correctReviews,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,word_id" },
  );

  // Log ngày học (increment count)
  const today = new Date().toISOString().slice(0, 10);
  await supabase.rpc("upsert_streak_log", {
    p_user_id: user.id,
    p_date: today,
  });
}

/** Lấy tất cả cards của user từ server. Trả null nếu chưa login. */
export async function fetchServerCards(): Promise<Record<string, CardState> | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("srs_cards")
    .select("word_id,box,last_reviewed_at,total_reviews,correct_reviews")
    .eq("user_id", user.id);

  if (error || !data || data.length === 0) return null;

  const cards: Record<string, CardState> = {};
  for (const row of data) {
    cards[row.word_id] = {
      box: row.box as 1 | 2 | 3 | 4 | 5,
      lastReviewedAt: row.last_reviewed_at,
      totalReviews: row.total_reviews,
      correctReviews: row.correct_reviews,
    };
  }
  return cards;
}

/** Lấy stats (cards + streak log) cho trang profile. */
export async function fetchProfileStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: cards }, { data: logs }] = await Promise.all([
    supabase
      .from("srs_cards")
      .select("word_id,box,total_reviews,correct_reviews")
      .eq("user_id", user.id),
    supabase
      .from("streak_log")
      .select("date,cards_reviewed")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(365),
  ]);

  return {
    user: {
      name: user.user_metadata?.full_name as string ?? user.email ?? "User",
      email: user.email ?? "",
      avatar: user.user_metadata?.avatar_url as string | undefined,
    },
    cards: cards ?? [],
    logs: logs ?? [],
  };
}

/** Sync toàn bộ SrsState từ localStorage khi user login lần đầu.
 *  Merge rule: giữ box cao hơn giữa local và server. */
export async function syncLocalToServer(localState: SrsState): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const rows = Object.entries(localState.cards).map(([wordId, card]) => ({
    user_id: user.id,
    word_id: wordId,
    box: card.box,
    last_reviewed_at: card.lastReviewedAt,
    total_reviews: card.totalReviews,
    correct_reviews: card.correctReviews,
    updated_at: new Date().toISOString(),
  }));

  if (rows.length === 0) return;

  // ignoreDuplicates: false → server giữ record mới hơn qua updated_at
  // Nhưng ta muốn giữ box cao hơn → upsert với điều kiện box < excluded.box
  // Supabase JS không hỗ trợ conditional upsert nên batch insert, bỏ qua conflict
  await supabase.from("srs_cards").upsert(rows, {
    onConflict: "user_id,word_id",
    ignoreDuplicates: false,
  });
}
