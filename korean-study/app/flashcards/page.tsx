"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { Skeleton } from "@/components/ui/Skeleton";
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
    <>
      <TopBar title="Thẻ ghi nhớ" titleKo="플래시카드" />

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* ── Hero queue count ── */}
        <div className="text-center mb-10">
          {!hydrated ? (
            <Skeleton variant="card" height={80} className="rounded-2xl" />
          ) : queue.length === 0 ? (
            <>
              <p className="text-5xl mb-3">🎉</p>
              <h2 className="font-hand text-2xl font-bold text-ink mb-2">
                Hôm nay đã xong!
              </h2>
              <p className="text-ink/55">
                Không có thẻ nào đến hạn. Quay lại ngày mai.
              </p>
            </>
          ) : (
            <>
              <p className="font-hand text-6xl font-black text-primary-600 mb-1">
                {queue.length}
              </p>
              <p className="text-lg text-ink/70 mb-1">thẻ hôm nay</p>
              <p className="text-sm text-ink/45">
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
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-ink bg-primary-500 text-white font-hand font-bold text-lg transition-transform duration-base hover:-translate-y-0.5"
              style={{ boxShadow: "3px 3px 0 rgb(35 34 34 / 0.2)" }}
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
            <div key={s.label} className="ks-surface p-4 text-center">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="font-hand text-lg font-bold text-ink">{s.value}</p>
              <p className="text-xs text-ink/55">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Leitner boxes info ── */}
        <div className="ks-surface p-5">
          <h3 className="font-hand font-semibold text-ink mb-4 text-sm">
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
                <span className="w-16 text-xs font-mono bg-paper-overlay text-ink/70 border border-ink/15 rounded px-2 py-0.5 text-center">
                  Box {b.box}
                </span>
                <span className="w-16 text-ink/55 shrink-0">{b.interval}</span>
                <span className="text-ink/70">{b.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/45 mt-4">
            <strong>Đúng</strong> → lên box · <strong>Sai</strong> → về Box 1
          </p>
        </div>
      </main>
    </>
  );
}
