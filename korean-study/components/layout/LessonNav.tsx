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
        className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-accent-500 hover:text-accent-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
      >
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span>Trước</span>
      </button>
      <div className="hidden sm:block flex-1 text-center text-sm text-slate-500 dark:text-slate-400">
        <span>{currentIdx + 1}</span> / <span>{total}</span>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-linear-to-r from-accent-500 to-violet-500 hover:from-accent-600 hover:to-violet-600 text-white shadow-md shadow-accent-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
      >
        <span>Tiếp</span>
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </nav>
  );
}
