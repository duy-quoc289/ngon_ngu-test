"use client";

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
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2 hover:-translate-y-0.5"
      >
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span>Trước</span>
      </button>

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
                  : "w-2 h-2 bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
          {total > 10 && (
            <span className="text-xs text-slate-400 ml-1">{currentIdx + 1}/{total}</span>
          )}
        </div>
      </div>
      <div className="sm:hidden text-sm text-slate-500 dark:text-slate-400 tabular-nums text-center flex-1">
        {currentIdx + 1} / {total}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-linear-to-r from-primary-500 to-violet-500 hover:from-primary-600 hover:to-violet-600 text-white shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2 hover:-translate-y-0.5"
      >
        <span>{isLast ? "Hoàn thành ✓" : "Tiếp"}</span>
        {!isLast && (
          <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        )}
      </button>
    </nav>
  );
}
