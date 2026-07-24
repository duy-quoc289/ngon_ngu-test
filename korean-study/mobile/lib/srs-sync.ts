import { createClient } from "@/lib/supabase/client";
import type { CardState, SrsState } from "./srs";

interface SrsCardRow {
  word_id: string;
  box: 1 | 2 | 3 | 4 | 5;
  last_reviewed_at: number;
  total_reviews: number;
  correct_reviews: number;
}

/**
 * Port của actions/srs.ts (Server Actions) bản gốc — cùng query Supabase,
 * chỉ đổi từ createClient() server sang client, gọi thẳng từ trình duyệt/
 * WebView thay vì qua RPC tới Next server (không tồn tại trong static export).
 */

/** Sync một card sau khi rating — fire-and-forget từ client. */
export async function syncCard(wordId: string, card: CardState): Promise<void> {
  const supabase = createClient();
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

  const today = new Date().toISOString().slice(0, 10);
  await supabase.rpc("upsert_streak_log", { p_user_id: user.id, p_date: today });
}

/** Lấy tất cả cards của user từ server. Trả null nếu chưa login. */
export async function fetchServerCards(): Promise<Record<string, CardState> | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("srs_cards")
    .select("word_id,box,last_reviewed_at,total_reviews,correct_reviews")
    .eq("user_id", user.id)
    .returns<SrsCardRow[]>();

  if (error || !data || data.length === 0) return null;

  const cards: Record<string, CardState> = {};
  for (const row of data) {
    cards[row.word_id] = {
      box: row.box,
      lastReviewedAt: row.last_reviewed_at,
      totalReviews: row.total_reviews,
      correctReviews: row.correct_reviews,
    };
  }
  return cards;
}

/** Sync toàn bộ SrsState từ localStorage khi user login lần đầu. */
export async function syncLocalToServer(localState: SrsState): Promise<void> {
  const supabase = createClient();
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

  await supabase.from("srs_cards").upsert(rows, {
    onConflict: "user_id,word_id",
    ignoreDuplicates: false,
  });
}
