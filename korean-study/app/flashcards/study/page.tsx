"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FlashCard } from "@/components/srs/FlashCard";
import { ViToHanCard } from "@/components/srs/ViToHanCard";
import { DictationCard } from "@/components/srs/DictationCard";
import { WordBuildCard } from "@/components/srs/WordBuildCard";
import { RatingButtons } from "@/components/srs/RatingButtons";
import { ProgressBar } from "@/components/ui/ProgressBar";
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-primary-300 border-t-primary-600" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Hôm nay đã xong!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Không có thẻ nào đến hạn hôm nay.</p>
        <Link href="/flashcards" className="px-6 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          ← Về Flashcards
        </Link>
      </div>
    );
  }

  if (result) {
    const accuracy = Math.round((result.correct / result.total) * 100);
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">{accuracy >= 80 ? "🏆" : accuracy >= 50 ? "💪" : "📖"}</p>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Phiên học hoàn thành</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {result.correct}/{result.total} đúng · {accuracy}% chính xác
        </p>
        <div className="flex gap-3">
          <Link href="/flashcards/study" className="px-6 py-2.5 rounded-xl bg-linear-to-r from-primary-500 to-violet-500 text-white font-semibold hover:-translate-y-0.5 transition-all shadow-lg">
            Tiếp tục học
          </Link>
          <Link href="/flashcards" className="px-6 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const isFlipMode = mode === "han-vi" || mode === "vi-han";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link
            href="/flashcards"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all shrink-0"
          >
            <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-sm font-black tracking-tight">KRD</span>
          </Link>
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 min-w-0">
            <ProgressBar value={index} max={total} size="sm" />
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            {index + 1}/{total}
          </span>
        </div>
      </header>

      {/* Mode badge — chỉ hiển thị, không cho chọn */}
      <div className="max-w-2xl mx-auto px-4 pt-3 pb-1 flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <span>{MODE_META[mode].icon}</span>
          {MODE_META[mode].label}
        </span>
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
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
                  Phím tắt:{" "}
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs">1</kbd> Sai ·{" "}
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs">2</kbd> Khó ·{" "}
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs">3</kbd> Được ·{" "}
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs">4</kbd> Dễ
                </p>
              </>
            )}

            {isFlipMode && !flipped && (
              <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-6">
                Nhấp vào thẻ hoặc{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs">Space</kbd>{" "}
                để xem đáp án
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-slate-400">Không tìm thấy từ.</p>
        )}
      </main>
    </div>
  );
}
