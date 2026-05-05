"use client";

import { AudioButton } from "@/components/audio/AudioButton";
import type { VocabWord } from "@/lib/types";

interface Props {
  word: VocabWord;
  flipped: boolean;
  onFlip: () => void;
}

/** Vi → Han: hiện nghĩa Việt trước, lật để xem Hàn. */
export function ViToHanCard({ word, flipped, onFlip }: Props) {
  return (
    <div className="w-full max-w-md mx-auto select-none">
      {!flipped ? (
        <div
          role="button"
          tabIndex={0}
          onClick={onFlip}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onFlip(); }
          }}
          className="w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-shadow cursor-pointer p-8 text-center focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300"
          aria-label="Lật thẻ để xem tiếng Hàn"
        >
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-5">
            Nghĩa tiếng Việt
          </p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {word.vi}
            {word.viExtra && (
              <span className="ml-2 text-lg font-normal text-slate-400 dark:text-slate-500">
                {word.viExtra}
              </span>
            )}
          </p>
          {word.tags && word.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-5">
              {word.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-8 text-sm text-slate-400 dark:text-slate-500">
            Nhấp để xem tiếng Hàn · Space
          </p>
        </div>
      ) : (
        <div className="w-full rounded-2xl border-2 border-emerald-400 dark:border-emerald-600 bg-white dark:bg-slate-900 shadow-lg p-8 text-center">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
            Tiếng Hàn
          </p>
          <p className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
            {word.ko}
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400 mb-5">{word.rom}</p>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mb-2">
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {word.vi}
              {word.viExtra && (
                <span className="ml-2 text-base font-normal text-slate-400"> {word.viExtra}</span>
              )}
            </p>
          </div>
          {word.note && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 italic">{word.note}</p>
          )}
          <div className="flex justify-center mt-5">
            <AudioButton text={word.ko} label={`Phát âm ${word.ko}`} />
          </div>
        </div>
      )}
    </div>
  );
}
