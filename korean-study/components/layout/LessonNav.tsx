"use client";

import { Button } from "@/components/ui/Button";

interface Props {
  currentIdx: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

export function LessonNav({ currentIdx, total, onPrev, onNext }: Props) {
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === total - 1;

  return (
    <nav className="mt-8 flex items-center gap-3">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={isFirst}
        className="flex-1 sm:flex-none justify-center"
        icon={
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        }
      >
        Trước
      </Button>

      <div className="hidden sm:flex flex-1 items-center justify-center">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: Math.min(total, 10) }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-base ${
                i === currentIdx
                  ? "w-4 h-2 bg-primary-500"
                  : i < currentIdx
                  ? "w-2 h-2 bg-primary-300 dark:bg-primary-700"
                  : "w-2 h-2 bg-ink/15"
              }`}
            />
          ))}
          {total > 10 && (
            <span className="text-xs text-ink/40 ml-1">{currentIdx + 1}/{total}</span>
          )}
        </div>
      </div>
      <div className="sm:hidden text-sm text-ink/50 tabular-nums text-center flex-1">
        {currentIdx + 1} / {total}
      </div>

      <Button
        variant="primary"
        onClick={onNext}
        disabled={isLast}
        className="flex-1 sm:flex-none justify-center"
        icon={
          !isLast ? (
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          ) : undefined
        }
        iconPosition="right"
      >
        {isLast ? "Hoàn thành ✓" : "Tiếp"}
      </Button>
    </nav>
  );
}
