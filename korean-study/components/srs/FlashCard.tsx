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
          className="ks-surface w-full cursor-pointer p-8 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="Lật thẻ để xem đáp án"
        >
          <p className="font-hand text-5xl font-bold tracking-tight text-ink mb-3">
            {word.ko}
          </p>
          <div className="flex justify-center mt-4" onClick={(e) => e.stopPropagation()}>
            <AudioButton text={word.ko} label={`Phát âm ${word.ko}`} />
          </div>
          <p className="mt-6 text-sm text-ink/45">
            Nhấp để xem đáp án · Space
          </p>
        </div>
      )}

      {/* ─── Back ─── */}
      {flipped && (
        <div className="ks-surface w-full p-8 text-center border-primary-400! dark:border-primary-600!">
          <p className="font-hand text-5xl font-bold tracking-tight text-ink mb-1">
            {word.ko}
          </p>
          <p className="text-base text-ink/55 mb-5">{word.rom}</p>

          <div className="border-t-2 border-dashed border-ink/15 pt-5">
            <p className="text-2xl font-semibold text-ink">
              {word.vi}
              {word.viExtra && (
                <span className="ml-2 text-base font-normal text-ink/55">
                  {word.viExtra}
                </span>
              )}
            </p>
          </div>

          {word.note && (
            <p className="mt-4 text-sm text-ink/55 italic">
              {word.note}
            </p>
          )}

          {word.tags && word.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {word.tags.map((t) => (
                <span key={t} className="ks-vocab-tag">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-5">
            <AudioButton text={word.ko} label={`Phát âm ${word.ko}`} />
          </div>
        </div>
      )}
    </div>
  );
}
