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
    <header className="ks-topbar sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2">

        {/* ── Left: back home + sidebar toggle ── */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Back-to-home button — rõ ràng, luôn hiện */}
          <Link
            href="/"
            className="ks-icon-btn flex items-center gap-1.5 px-2.5 py-1.5 group"
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
            <span className="font-hand text-sm font-black tracking-tight leading-none">KRD</span>
          </Link>

          {/* Divider */}
          <span className="w-px h-5 bg-ink/15 mx-0.5" />

          {/* Hamburger — chỉ khi có sidebar, mobile only */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="ks-icon-btn lg:hidden p-1.5"
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
          <span className="font-hand font-semibold text-ink truncate text-sm sm:text-base">
            {title}
          </span>
          {titleKo && (
            <span className="text-ink/40 font-normal text-xs sm:text-sm shrink-0" lang="ko">
              {titleKo}
            </span>
          )}
        </div>

        {/* ── Right: progress / count ── */}
        <div className="flex items-center gap-2 shrink-0">
          {progress && (
            <>
              <span className="text-xs text-ink/50 tabular-nums hidden sm:block">
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
            <span className="ks-count-pill">{countText}</span>
          )}
          <UserButton />
        </div>

      </div>
    </header>
  );
}
