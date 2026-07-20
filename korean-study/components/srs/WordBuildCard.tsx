"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
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
      <div className="ks-surface w-full max-w-md mx-auto p-8 text-center">
        <p className="text-ink/55 mb-4">
          Từ này không hỗ trợ chế độ ghép chữ.
        </p>
        <Button variant="outline" size="sm" onClick={() => onResult(true)}>
          Bỏ qua →
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Prompt + Building area */}
      <div className="ks-surface p-6 text-center mb-4">
        <p className="text-xs font-semibold text-ink/45 uppercase tracking-widest mb-3">
          Nghĩa tiếng Việt
        </p>
        <p className="font-hand text-2xl font-bold text-ink mb-6">
          {word.vi}
          {word.viExtra && (
            <span className="ml-2 text-base font-normal text-ink/45">
              {word.viExtra}
            </span>
          )}
        </p>

        {/* Building tray */}
        <div className="min-h-14 flex flex-wrap justify-center items-center gap-2 border-b-2 border-dashed border-ink/15 pb-4 mb-2">
          {selected.length === 0 ? (
            <p className="text-ink/30 text-sm">
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
                        ? "bg-success-100 dark:bg-success-900/40 text-success-700 dark:text-success-300 border-success-400"
                        : "bg-error-100 dark:bg-error-900/40 text-error-700 dark:text-error-300 border-error-400"
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
                ? "opacity-25 cursor-default bg-paper-overlay border-ink/15 text-ink/40"
                : "bg-paper border-ink/30 text-ink hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 active:scale-95"
            }`}
          >
            {block.char}
          </button>
        ))}
      </div>

      {/* Actions */}
      {submitted ? (
        <div
          className={`rounded-xl p-4 text-center border-2 ${
            isCorrect
              ? "bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800"
              : "bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800"
          }`}
        >
          <p className="font-hand font-semibold text-ink mb-1">
            {isCorrect ? "✅ Đúng rồi!" : (
              <>❌ Sai — Đáp án: <span className="font-bold">{word.ko}</span>{" "}
                <span className="text-ink/50 text-sm">({word.rom})</span>
              </>
            )}
          </p>
          <div className="flex gap-2 justify-center mt-3">
            {!isCorrect && (
              <Button variant="outline" size="sm" onClick={reset}>
                Thử lại
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={() => onResult(isCorrect)}>
              Tiếp theo →
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset}>
            Xóa
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={selected.length === 0}
            className="flex-1"
          >
            Kiểm tra
          </Button>
        </div>
      )}
    </div>
  );
}
