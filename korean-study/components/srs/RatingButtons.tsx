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
        "border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40",
    },
    {
      rating: "hard",
      label: "Khó",
      shortcut: "2",
      className:
        "border-2 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40",
    },
    {
      rating: "good",
      label: "Được",
      shortcut: "3",
      className:
        "border-2 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/40",
    },
    {
      rating: "easy",
      label: "Dễ",
      shortcut: "4",
      className:
        "border-2 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40",
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
          className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${b.className}`}
        >
          <span>{b.label}</span>
          <span className="text-xs opacity-50 font-normal">{b.shortcut}</span>
        </button>
      ))}
    </div>
  );
}
