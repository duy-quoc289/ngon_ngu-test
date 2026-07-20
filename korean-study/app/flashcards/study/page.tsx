"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FlashCard } from "@/components/srs/FlashCard";
import { ViToHanCard } from "@/components/srs/ViToHanCard";
import { DictationCard } from "@/components/srs/DictationCard";
import { WordBuildCard } from "@/components/srs/WordBuildCard";
import { RatingButtons } from "@/components/srs/RatingButtons";
import { TopBar } from "@/components/layout/TopBar";
import { Tag } from "@/components/ui/Tag";
import { Spinner } from "@/components/ui/Spinner";
import { useSrsStore } from "@/lib/srs-store";
import type { SrsRating } from "@/lib/srs";
import vocabData from "@/data/vocab.json";
import type { VocabCategory, VocabWord } from "@/lib/types";

const WORD_MAP = new Map<string, VocabWord>(
  (vocabData.categories as VocabCategory[]).flatMap((cat) =>
    cat.words.map((w) => [w.audio, w]),
  ),
);
const ALL_IDS = [...WORD_MAP.keys()];

type StudyMode = "han-vi" | "vi-han" | "dictation" | "word-build";

const MODE_POOL: StudyMode[] = ["han-vi", "vi-han", "dictation", "word-build"];

const MODE_META: Record<StudyMode, { icon: string; label: string }> = {
  "han-vi":     { icon: "🔤", label: "한 → Vi" },
  "vi-han":     { icon: "✍️",  label: "Vi → 한" },
  "dictation":  { icon: "🎧", label: "Nghe"    },
  "word-build": { icon: "🧩", label: "Ghép chữ" },
};

function randomMode(): StudyMode {
  return MODE_POOL[Math.floor(Math.random() * MODE_POOL.length)];
}

interface SessionResult { total: number; correct: number }

export default function StudyPage() {
  const { queue, hydrated, submitRating } = useSrsStore(ALL_IDS);

  const sessionQueue = useMemo(
    () => (hydrated ? [...queue] : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated],
  );

  // mode gán khi session start — mỗi card có mode riêng, random
  const [cardModes, setCardModes] = useState<StudyMode[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState<SessionResult | null>(null);

  // Gán mode random cho từng card khi hydrated xong

  useEffect(() => {
    if (hydrated && cardModes.length === 0 && sessionQueue.length > 0) {
      setCardModes(sessionQueue.map(() => randomMode()));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, sessionQueue.length]);

  const mode: StudyMode = cardModes[index] ?? "han-vi";

  const currentItem = sessionQueue[index];
  const currentWord = currentItem ? WORD_MAP.get(currentItem.id) : undefined;
  const total = sessionQueue.length;

  const advanceCard = useCallback(
    (newCorrect: number, idx: number) => {
      if (idx >= total - 1) {
        setResult({ total, correct: newCorrect });
      } else {
        setIndex((i) => i + 1);
        setFlipped(false);
        setCardKey((k) => k + 1);
        // mode tiếp theo đã được gán sẵn trong cardModes
      }
    },
    [total],
  );

  const handleRate = useCallback(
    (rating: SrsRating) => {
      if (!currentItem) return;
      submitRating(currentItem.id, rating);
      const isCorrect = rating !== "again";
      const nc = correct + (isCorrect ? 1 : 0);
      setCorrect(nc);
      advanceCard(nc, index);
    },
    [currentItem, submitRating, correct, index, advanceCard],
  );

  const handleNext = useCallback(
    (isCorrect: boolean) => {
      if (!currentItem) return;
      submitRating(currentItem.id, isCorrect ? "good" : "again");
      const nc = correct + (isCorrect ? 1 : 0);
      setCorrect(nc);
      advanceCard(nc, index);
    },
    [currentItem, submitRating, correct, index, advanceCard],
  );

  useEffect(() => {
    if (mode !== "han-vi" && mode !== "vi-han") return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (!flipped) {
        if (e.key === " " || e.key === "ArrowDown") { e.preventDefault(); setFlipped(true); }
      } else {
        if (e.key === "1") handleRate("again");
        else if (e.key === "2") handleRate("hard");
        else if (e.key === "3") handleRate("good");
        else if (e.key === "4") handleRate("easy");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, flipped, handleRate]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="font-hand text-2xl font-bold text-ink mb-2">Hôm nay đã xong!</h2>
        <p className="text-ink/55 mb-6">Không có thẻ nào đến hạn hôm nay.</p>
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink font-hand font-semibold transition-transform duration-base hover:-translate-y-0.5"
          style={{ boxShadow: "3px 3px 0 rgb(35 34 34 / 0.15)" }}
        >
          ← Về Flashcards
        </Link>
      </div>
    );
  }

  if (result) {
    const accuracy = Math.round((result.correct / result.total) * 100);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">{accuracy >= 80 ? "🏆" : accuracy >= 50 ? "💪" : "📖"}</p>
        <h2 className="font-hand text-2xl font-bold text-ink mb-1">Phiên học hoàn thành</h2>
        <p className="text-ink/55 mb-6">
          {result.correct}/{result.total} đúng · {accuracy}% chính xác
        </p>
        <div className="flex gap-3">
          <Link
            href="/flashcards/study"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-ink bg-primary-500 text-white font-hand font-semibold transition-transform duration-base hover:-translate-y-0.5"
            style={{ boxShadow: "3px 3px 0 rgb(35 34 34 / 0.2)" }}
          >
            Tiếp tục học
          </Link>
          <Link
            href="/flashcards"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-ink bg-paper text-ink font-hand font-semibold transition-transform duration-base hover:-translate-y-0.5"
            style={{ boxShadow: "3px 3px 0 rgb(35 34 34 / 0.15)" }}
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const isFlipMode = mode === "han-vi" || mode === "vi-han";

  return (
    <>
      <TopBar title="Ôn tập" titleKo="복습" progress={{ done: index, total }} />

      {/* Mode badge — chỉ hiển thị, không cho chọn */}
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-1 flex justify-center">
        <Tag color="gray" size="sm">
          <span className="mr-1">{MODE_META[mode].icon}</span>
          {MODE_META[mode].label}
        </Tag>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {currentWord ? (
          <>
            {mode === "han-vi" && (
              <FlashCard
                key={`${currentItem.id}-${cardKey}`}
                word={currentWord}
                flipped={flipped}
                onFlip={() => setFlipped(true)}
              />
            )}
            {mode === "vi-han" && (
              <ViToHanCard
                key={`${currentItem.id}-${cardKey}`}
                word={currentWord}
                flipped={flipped}
                onFlip={() => setFlipped(true)}
              />
            )}
            {mode === "dictation" && (
              <DictationCard
                key={`${currentItem.id}-${cardKey}`}
                word={currentWord}
                onResult={handleNext}
              />
            )}
            {mode === "word-build" && (
              <WordBuildCard
                key={`${currentItem.id}-${cardKey}`}
                word={currentWord}
                onResult={handleNext}
              />
            )}

            {isFlipMode && flipped && (
              <>
                <RatingButtons onRate={handleRate} />
                <p className="text-center text-xs text-ink/45 mt-4">
                  Phím tắt:{" "}
                  <kbd className="px-1 py-0.5 rounded bg-paper-overlay border border-ink/15 text-xs">1</kbd> Sai ·{" "}
                  <kbd className="px-1 py-0.5 rounded bg-paper-overlay border border-ink/15 text-xs">2</kbd> Khó ·{" "}
                  <kbd className="px-1 py-0.5 rounded bg-paper-overlay border border-ink/15 text-xs">3</kbd> Được ·{" "}
                  <kbd className="px-1 py-0.5 rounded bg-paper-overlay border border-ink/15 text-xs">4</kbd> Dễ
                </p>
              </>
            )}

            {isFlipMode && !flipped && (
              <p className="text-center text-sm text-ink/45 mt-6">
                Nhấp vào thẻ hoặc{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-paper-overlay border border-ink/15 text-xs">Space</kbd>{" "}
                để xem đáp án
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-ink/45">Không tìm thấy từ.</p>
        )}
      </main>
    </>
  );
}
