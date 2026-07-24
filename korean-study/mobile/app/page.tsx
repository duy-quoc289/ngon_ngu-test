"use client";

import vocabData from "@/data/vocab.json";
import type { VocabCategory, VocabWord } from "@/lib/types";
import { useSrsStore } from "@/lib/srs-store";
import { ReviewCard } from "@/components/ReviewCard";

const CATEGORIES = vocabData.categories as VocabCategory[];

const ALL_WORDS: Record<string, VocabWord> = {};
for (const cat of CATEGORIES) {
  for (const w of cat.words) ALL_WORDS[w.audio] = w;
}
const ALL_IDS = Object.keys(ALL_WORDS);

export default function ReviewPage() {
  const { queue, stats, hydrated, submitRating } = useSrsStore(ALL_IDS);
  const current = queue[0];
  const word = current ? ALL_WORDS[current.id] : null;

  return (
    <div className="ks-app-shell">
      <header className="ks-review-header">
        <span className="ks-count-pill">{queue.length} thẻ</span>
        <span className="ks-count-pill">🔥 {stats.streak}</span>
      </header>

      <main className="ks-review-main">
        {!hydrated ? (
          <p className="text-center text-ink/50">Đang tải...</p>
        ) : !word || !current ? (
          <div className="ks-empty-state">
            <div className="ks-empty-icon">🎉</div>
            <h2 className="font-hand text-2xl font-bold text-ink mt-4">Hôm nay đã xong!</h2>
            <p className="text-ink/55 mt-2">Không còn thẻ nào đến hạn. Quay lại ngày mai.</p>
          </div>
        ) : (
          <ReviewCard key={current.id} word={word} onRate={(r) => submitRating(current.id, r)} />
        )}
      </main>
    </div>
  );
}
