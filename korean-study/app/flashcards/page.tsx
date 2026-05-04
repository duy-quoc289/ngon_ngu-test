"use client";

import Link from "next/link";
import { useSrsStore } from "@/lib/srs-store";
import vocabData from "@/data/vocab.json";
import type { VocabCategory } from "@/lib/types";

// Lấy toàn bộ word ids từ vocab
const ALL_IDS = (vocabData.categories as VocabCategory[]).flatMap((cat) =>
  cat.words.map((w) => w.audio),
);

export default function FlashcardsPage() {
  const { queue, stats, hydrated } = useSrsStore(ALL_IDS);

  const dueCount = queue.filter((q) => !q.isNew).length;
  const newCount = queue.filter((q) => q.isNew).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── TopBar minimal ── */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
            aria-label="Về trang chủ KRD"
          >
            <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-sm font-black tracking-tight">KRD</span>
          </Link>
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
          <h1 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Thẻ ghi nhớ</h1>
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-0.5">플래시카드</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* ── Hero queue count ── */}
        <div className="text-center mb-10">
          {!hydrated ? (
            <div className="h-20 animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ) : queue.length === 0 ? (
            <>
              <p className="text-5xl mb-3">🎉</p>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Hôm nay đã xong!
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Không có thẻ nào đến hạn. Quay lại ngày mai.
              </p>
            </>
          ) : (
            <>
              <p className="text-6xl font-black text-primary-600 dark:text-primary-400 mb-1">
                {queue.length}
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-1">thẻ hôm nay</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {dueCount > 0 && `${dueCount} ôn lại`}
                {dueCount > 0 && newCount > 0 && " · "}
                {newCount > 0 && `${newCount} từ mới`}
              </p>
            </>
          )}
        </div>

        {/* ── Start button ── */}
        {hydrated && queue.length > 0 && (
          <div className="flex justify-center mb-10">
            <Link
              href="/flashcards/study"
              className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-primary-500 to-violet-500 text-white font-bold text-lg shadow-lg hover:shadow-primary-300/40 dark:hover:shadow-primary-900/40 hover:-translate-y-0.5 transition-all"
            >
              Bắt đầu ôn →
            </Link>
          </div>
        )}

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Streak", value: hydrated ? `${stats.streak} ngày` : "—", icon: "🔥" },
            { label: "Chính xác", value: hydrated ? `${stats.accuracy}%` : "—", icon: "🎯" },
            { label: "Thẻ vững", value: hydrated ? `${stats.mature}/${stats.total}` : "—", icon: "📦" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center"
            >
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Leitner boxes info ── */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4 text-sm">
            Leitner Boxes — cách hoạt động
          </h3>
          <div className="space-y-2">
            {([
              { box: 1, interval: "1 ngày",  desc: "Mới / vừa sai → ôn liền" },
              { box: 2, interval: "2 ngày",  desc: "Đúng 1 lần" },
              { box: 3, interval: "4 ngày",  desc: "Đúng 2 lần liên tiếp" },
              { box: 4, interval: "7 ngày",  desc: "Vững dần" },
              { box: 5, interval: "14 ngày", desc: "Đã thuộc" },
            ] as const).map((b) => (
              <div key={b.box} className="flex items-center gap-3 text-sm">
                <span className="w-16 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded px-2 py-0.5 text-center">
                  Box {b.box}
                </span>
                <span className="w-16 text-slate-500 dark:text-slate-400 shrink-0">{b.interval}</span>
                <span className="text-slate-600 dark:text-slate-400">{b.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
            <strong>Đúng</strong> → lên box · <strong>Sai</strong> → về Box 1
          </p>
        </div>
      </main>
    </div>
  );
}
