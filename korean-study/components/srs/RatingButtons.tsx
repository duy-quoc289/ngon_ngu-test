"use client";

import type { SrsRating } from "@/lib/srs";

interface Props {
  onRate: (r: SrsRating) => void;
}

const BUTTONS: { rating: SrsRating; label: string; shortcut: string; className: string }[] =
  [
    {
      rating: "again",
      label: "Sai",
      shortcut: "1",
      className:
        "border-error-300 dark:border-error-700 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950/40",
    },
    {
      rating: "hard",
      label: "Khó",
      shortcut: "2",
      className:
        "border-warning-400 dark:border-warning-700 text-warning-700 dark:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-950/40",
    },
    {
      rating: "good",
      label: "Được",
      shortcut: "3",
      className:
        "border-success-300 dark:border-success-700 text-success-600 dark:text-success-400 hover:bg-success-50 dark:hover:bg-success-950/40",
    },
    {
      rating: "easy",
      label: "Dễ",
      shortcut: "4",
      className:
        "border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40",
    },
  ];

/** Bốn nút rating sau khi đã lật thẻ. */
export function RatingButtons({ onRate }: Props) {
  return (
    <div className="flex gap-3 justify-center mt-6">
      {BUTTONS.map((b) => (
        <button
          key={b.rating}
          onClick={() => onRate(b.rating)}
          className={`font-hand flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border-2 bg-paper font-semibold text-sm transition-all active:scale-95 ${b.className}`}
        >
          <span>{b.label}</span>
          <span className="text-xs opacity-50 font-normal">{b.shortcut}</span>
        </button>
      ))}
    </div>
  );
}
