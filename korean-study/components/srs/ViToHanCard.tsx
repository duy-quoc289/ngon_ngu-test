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
          className="ks-surface w-full cursor-pointer p-8 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          aria-label="Lật thẻ để xem tiếng Hàn"
        >
          <p className="text-xs font-semibold text-ink/45 uppercase tracking-widest mb-5">
            Nghĩa tiếng Việt
          </p>
          <p className="font-hand text-3xl font-bold text-ink">
            {word.vi}
            {word.viExtra && (
              <span className="ml-2 text-lg font-normal text-ink/45">
                {word.viExtra}
              </span>
            )}
          </p>
          {word.tags && word.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-5">
              {word.tags.map((t) => (
                <span key={t} className="ks-vocab-tag">
                  {t}
                </span>
              ))}
            </div>
          )}
          <p className="mt-8 text-sm text-ink/45">
            Nhấp để xem tiếng Hàn · Space
          </p>
        </div>
      ) : (
        <div className="ks-surface w-full p-8 text-center border-success-500! dark:border-success-400!">
          <p className="text-xs font-semibold text-ink/45 uppercase tracking-widest mb-4">
            Tiếng Hàn
          </p>
          <p className="font-hand text-5xl font-bold tracking-tight text-ink mb-2">
            {word.ko}
          </p>
          <p className="text-base text-ink/55 mb-5">{word.rom}</p>
          <div className="border-t-2 border-dashed border-ink/15 pt-4 mb-2">
            <p className="text-lg text-ink/80">
              {word.vi}
              {word.viExtra && (
                <span className="ml-2 text-base font-normal text-ink/45"> {word.viExtra}</span>
              )}
            </p>
          </div>
          {word.note && (
            <p className="mt-3 text-sm text-ink/55 italic">{word.note}</p>
          )}
          <div className="flex justify-center mt-5">
            <AudioButton text={word.ko} label={`Phát âm ${word.ko}`} />
          </div>
        </div>
      )}
    </div>
  );
}
