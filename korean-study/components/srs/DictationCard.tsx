"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/components/audio/AudioProvider";
import { AudioButton } from "@/components/audio/AudioButton";
import type { VocabWord } from "@/lib/types";

interface Props {
  word: VocabWord;
  onResult: (correct: boolean) => void;
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/-/g, "").replace(/\s+/g, "");
}

/** Chính tả: tự động phát audio → user gõ tiếng Hàn hoặc phiên âm La-tinh → auto-check. */
export function DictationCard({ word, onResult }: Props) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { play } = useAudio();
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPlayed = useRef(false);

  // Autoplay khi card mount
  useEffect(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    setTimeout(() => play(word.ko, word.ko), 250);
    setTimeout(() => inputRef.current?.focus(), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit() {
    if (submitted || !input.trim()) return;
    const ans = normalize(input);
    const correct =
      ans === normalize(word.ko) ||
      (word.rom ? ans === normalize(word.rom) : false);
    setIsCorrect(correct);
    setSubmitted(true);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Audio card */}
      <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-8 text-center mb-4">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
          Nghe và gõ lại
        </p>
        <div className="flex justify-center mb-3">
          <AudioButton text={word.ko} label="Phát lại" />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Gõ tiếng Hàn <span className="opacity-50">hoặc romanization</span>
        </p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { if (!submitted) setInput(e.target.value); }}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="안녕하세요 · hoặc an-nyeong-ha-se-yo"
          className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg font-medium bg-white dark:bg-slate-900 outline-none transition-colors ${
            submitted
              ? isCorrect
                ? "border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400"
                : "border-red-400 dark:border-red-600 text-red-600 dark:text-red-400"
              : "border-slate-200 dark:border-slate-700 focus:border-primary-400 dark:focus:border-primary-600 text-slate-800 dark:text-slate-100"
          }`}
          disabled={submitted}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        {submitted ? (
          <div
            className={`rounded-xl p-4 text-center ${
              isCorrect
                ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
            }`}
          >
            <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
              {isCorrect ? "✅ Đúng rồi!" : "❌ Sai rồi"}
            </p>
            {!isCorrect && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                Đáp án:{" "}
                <span className="font-bold text-slate-900 dark:text-slate-50">{word.ko}</span>{" "}
                <span className="text-slate-500">({word.rom})</span>
              </p>
            )}
            <button
              onClick={() => onResult(isCorrect)}
              className="mt-3 px-6 py-2 rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Tiếp theo →
            </button>
          </div>
        ) : (
          <button
            onClick={submit}
            disabled={!input.trim()}
            className="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Kiểm tra <span className="opacity-60 text-sm">(Enter)</span>
          </button>
        )}
      </div>
    </div>
  );
}
