"use client";

import Link from "next/link";

interface Props {
  title: string;
  titleKo?: string;
  /** Hiển thị nút hamburger (chỉ ở pages có sidebar). */
  onToggleSidebar?: () => void;
  /** Hiển thị progress (số đã xong / tổng) — chỉ ở lesson pages. */
  progress?: { done: number; total: number };
  /** Hiển thị count text custom (vd: vocab page hiển thị "5/160"). */
  countText?: string;
}

export function TopBar({ title, titleKo, onToggleSidebar, progress, countText }: Props) {
  const pct = progress ? Math.round((progress.done / Math.max(progress.total, 1)) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Mở danh sách bài học"
          >
            <svg
              viewBox="0 0 24 24"
              width={22}
              height={22}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <Link href="/" className="flex items-center gap-2 font-semibold hover:text-accent-600">
          <span className="text-xl">🇰🇷</span>
          <span className="hidden sm:inline">Học tiếng Hàn</span>
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold">
          <span>{title}</span>{" "}
          {titleKo && (
            <span className="text-slate-400 font-normal" lang="ko">
              {titleKo}
            </span>
          )}
        </span>

        <div className="ml-auto flex items-center gap-3">
          {progress && (
            <>
              <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline tabular-nums">
                {progress.done}/{progress.total}
              </span>
              <div className="w-24 sm:w-36 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-accent-500 to-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </>
          )}
          {countText && !progress && (
            <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
              {countText}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
