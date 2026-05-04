"use client";

import { useMemo, useState } from "react";
import type { VocabWord } from "@/lib/types";

const DISTRACTOR_POOL = [
  "가", "나", "다", "마", "바", "사", "지", "도", "로", "자",
  "어", "의", "라", "고", "그", "기", "모", "를", "가", "에",
];

function isKoreanSyllable(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return code >= 0xac00 && code <= 0xd7a3;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Block { id: string; char: string }

interface Props {
  word: VocabWord;
  onResult: (correct: boolean) => void;
}

/** Ghép chữ: hiện nghĩa Việt → chọn các ô âm tiết Hàn theo thứ tự đúng. */
export function WordBuildCard({ word, onResult }: Props) {
  const syllables = useMemo(() => [...word.ko].filter(isKoreanSyllable), [word.ko]);

  const blocks: Block[] = useMemo(() => {
    if (syllables.length === 0) return [];
    const n = syllables.length;
    const distractorCount = n <= 3 ? 2 : n <= 5 ? 1 : 0;
    const pool = DISTRACTOR_POOL.filter((d) => !syllables.includes(d));
    const distractors = shuffle(pool).slice(0, distractorCount);
    const all: Block[] = [
      ...syllables.map((s, i) => ({ id: `orig-${i}`, char: s })),
      ...distractors.map((s, i) => ({ id: `dist-${i}`, char: s })),
    ];
    return shuffle(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.ko]);

  const [selected, setSelected] = useState<string[]>([]); // block ids theo thứ tự
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const builtWord = selected.map((id) => blocks.find((b) => b.id === id)?.char ?? "").join("");
  const usedIds = new Set(selected);

  function tapBlock(id: string) {
    if (submitted) return;
    if (usedIds.has(id)) {
      setSelected((prev) => prev.filter((x) => x !== id));
    } else {
      setSelected((prev) => [...prev, id]);
    }
  }

  function submit() {
    if (submitted) return;
    const correct = builtWord === syllables.join("");
    setIsCorrect(correct);
    setSubmitted(true);
  }

  function reset() {
    setSelected([]);
    setSubmitted(false);
    setIsCorrect(false);
  }

  // Fallback cho từ không thuần Hàn (câu có ___, spaces...)
  if (syllables.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          Từ này không hỗ trợ chế độ ghép chữ.
        </p>
        <button
          onClick={() => onResult(true)}
          className="px-6 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          Bỏ qua →
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Prompt + Building area */}
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-6 text-center mb-4">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          Nghĩa tiếng Việt
        </p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
          {word.vi}
          {word.viExtra && (
            <span className="ml-2 text-base font-normal text-slate-400 dark:text-slate-500">
              {word.viExtra}
            </span>
          )}
        </p>

        {/* Building tray */}
        <div className="min-h-14 flex flex-wrap justify-center items-center gap-2 border-b-2 border-dashed border-slate-200 dark:border-slate-700 pb-4 mb-2">
          {selected.length === 0 ? (
            <p className="text-slate-300 dark:text-slate-600 text-sm">
              Chọn các ký tự bên dưới...
            </p>
          ) : (
            selected.map((id) => {
              const block = blocks.find((b) => b.id === id);
              return block ? (
                <button
                  key={id}
                  onClick={() => !submitted && tapBlock(id)}
                  disabled={submitted}
                  className={`w-12 h-12 rounded-xl text-xl font-bold transition-all border-2 ${
                    submitted
                      ? isCorrect
                        ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-400"
                        : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-400"
                      : "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-primary-400 hover:bg-primary-200 active:scale-95"
                  }`}
                >
                  {block.char}
                </button>
              ) : null;
            })
          )}
        </div>
      </div>

      {/* Available blocks */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {blocks.map((block) => (
          <button
            key={block.id}
            onClick={() => tapBlock(block.id)}
            disabled={submitted}
            className={`w-12 h-12 rounded-xl text-xl font-bold border-2 transition-all ${
              usedIds.has(block.id)
                ? "opacity-25 cursor-default bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
                : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 active:scale-95"
            }`}
          >
            {block.char}
          </button>
        ))}
      </div>

      {/* Actions */}
      {submitted ? (
        <div
          className={`rounded-xl p-4 text-center ${
            isCorrect
              ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
              : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
          }`}
        >
          <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
            {isCorrect ? "✅ Đúng rồi!" : (
              <>❌ Sai — Đáp án: <span className="font-bold">{word.ko}</span>{" "}
                <span className="text-slate-500 text-sm">({word.rom})</span>
              </>
            )}
          </p>
          <div className="flex gap-2 justify-center mt-3">
            {!isCorrect && (
              <button
                onClick={reset}
                className="px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Thử lại
              </button>
            )}
            <button
              onClick={() => onResult(isCorrect)}
              className="px-6 py-2 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Tiếp theo →
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Xóa
          </button>
          <button
            onClick={submit}
            disabled={selected.length === 0}
            className="flex-1 py-3 rounded-xl bg-primary-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
          >
            Kiểm tra
          </button>
        </div>
      )}
    </div>
  );
}
