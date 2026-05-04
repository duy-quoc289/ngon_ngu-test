"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { UserButton } from "@/components/auth/UserButton";

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
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2">

        {/* ── Left: back home + sidebar toggle ── */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Back-to-home button — rõ ràng, luôn hiện */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group"
            aria-label="Về trang chủ KRD"
          >
            <svg
              viewBox="0 0 24 24"
              width={15}
              height={15}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-sm font-black tracking-tight leading-none">KRD</span>
          </Link>

          {/* Divider */}
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* Hamburger — chỉ khi có sidebar, mobile only */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Mở danh sách bài học"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Center: page title ── */}
        <div className="flex-1 min-w-0 flex items-baseline gap-1.5">
          <span className="font-semibold text-slate-800 dark:text-slate-100 truncate text-sm sm:text-base">
            {title}
          </span>
          {titleKo && (
            <span className="text-slate-400 dark:text-slate-500 font-normal text-xs sm:text-sm shrink-0" lang="ko">
              {titleKo}
            </span>
          )}
        </div>

        {/* ── Right: progress / count ── */}
        <div className="flex items-center gap-2 shrink-0">
          {progress && (
            <>
              <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums hidden sm:block">
                {progress.done}/{progress.total}
              </span>
              <ProgressBar
                value={progress.done}
                max={progress.total}
                size="sm"
                className="w-20 sm:w-28"
              />
            </>
          )}
          {countText && !progress && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              {countText}
            </span>
          )}
          <UserButton />
        </div>

      </div>
    </header>
  );
}
