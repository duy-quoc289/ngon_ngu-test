// Leitner Box SRS engine — không dùng lib ngoài.

export type SrsRating = "again" | "hard" | "good" | "easy";

export interface CardState {
  box: 1 | 2 | 3 | 4 | 5;
  lastReviewedAt: number; // ms timestamp
  totalReviews: number;
  correctReviews: number;
}

export interface SrsState {
  cards: Record<string, CardState>; // key = word audio id
  streak: number;
  lastStudyDate: string; // "YYYY-MM-DD"
  /** Supabase user id của chủ sở hữu data này. undefined = anonymous. */
  userId?: string;
}

/** Số ngày interval mỗi box. index = box number (1–5). */
const INTERVALS: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Card này có đến hạn ôn chưa? */
export function isDue(card: CardState, now = Date.now()): boolean {
  const dueAt = card.lastReviewedAt + INTERVALS[card.box] * DAY_MS;
  return now >= dueAt;
}

/** Tạo CardState mới (lần đầu học). */
export function newCard(): CardState {
  return {
    box: 1,
    lastReviewedAt: 0, // chưa review lần nào → luôn due
    totalReviews: 0,
    correctReviews: 0,
  };
}

/** Cập nhật CardState sau khi user rating. */
export function rateCard(card: CardState, rating: SrsRating): CardState {
  const isCorrect = rating !== "again";
  let newBox = card.box;
  switch (rating) {
    case "again": newBox = 1;                              break;
    case "hard":  newBox = card.box;                       break; // giữ nguyên
    case "good":  newBox = Math.min(card.box + 1, 5) as 1 | 2 | 3 | 4 | 5; break;
    case "easy":  newBox = Math.min(card.box + 2, 5) as 1 | 2 | 3 | 4 | 5; break;
  }
  return {
    box: newBox as 1 | 2 | 3 | 4 | 5,
    lastReviewedAt: Date.now(),
    totalReviews: card.totalReviews + 1,
    correctReviews: card.correctReviews + (isCorrect ? 1 : 0),
  };
}

/** Tính streak sau mỗi session có ít nhất 1 thẻ. */
export function updateStreak(prev: SrsState): SrsState {
  const today = toDateStr(new Date());
  if (prev.lastStudyDate === today) return prev; // đã học hôm nay
  const yesterday = toDateStr(new Date(Date.now() - DAY_MS));
  const newStreak =
    prev.lastStudyDate === yesterday ? prev.streak + 1 : 1;
  return { ...prev, streak: newStreak, lastStudyDate: today };
}

export function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}
