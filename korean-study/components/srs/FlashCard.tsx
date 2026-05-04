"use client";

import { AudioButton } from "@/components/audio/AudioButton";
import type { VocabWord } from "@/lib/types";

interface Props {
  word: VocabWord;
  flipped: boolean;
  onFlip: () => void;
}

/** Flashcard với flip animation: front = 한글, back = nghĩa Việt. */
export function FlashCard({ word, flipped, onFlip }: Props) {
  function flip() {
    if (!flipped) onFlip();
  }

  return (
    <div className="w-full max-w-md mx-auto select-none">
      {/* ─── Front ─── */}
      {!flipped && (
        <div
          role="button"
          tabIndex={0}
          onClick={flip}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } }}
          className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-shadow cursor-pointer p-8 text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300"
          aria-label="Lật thẻ để xem đáp án"
        >
          <p className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-3">
            {word.ko}
          </p>
          {word.audio && (
            <div className="flex justify-center mt-4" onClick={(e) => e.stopPropagation()}>
              <AudioButton
                src={`/audio/${word.audio}.mp3`}
                label={`Phát âm ${word.ko}`}
              />
            </div>
          )}
          <p className="mt-6 text-sm text-slate-400 dark:text-slate-500">
            Nhấp để xem đáp án · Space
          </p>
        </div>
      )}

      {/* ─── Back ─── */}
      {flipped && (
        <div className="w-full rounded-2xl border-2 border-primary-400 dark:border-primary-600 bg-white dark:bg-slate-900 shadow-lg p-8 text-center">
          <p className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-1">
            {word.ko}
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400 mb-5">{word.rom}</p>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {word.vi}
              {word.viExtra && (
                <span className="ml-2 text-base font-normal text-slate-500 dark:text-slate-400">
                  {word.viExtra}
                </span>
              )}
            </p>
          </div>

          {word.note && (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 italic">
              {word.note}
            </p>
          )}

          {word.tags && word.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {word.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {word.audio && (
            <div className="flex justify-center mt-5">
              <AudioButton
                src={`/audio/${word.audio}.mp3`}
                label={`Phát âm ${word.ko}`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
