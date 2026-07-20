import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowSingleLeft as ArrowSingleLeftIcon,
  Fire as FireIcon,
  Target as TargetIcon,
  Box as BoxIcon,
  Sync as SyncIcon,
} from "duma-icons-react";
import { fetchProfileStats } from "@/actions/srs";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/profile");

  const stats = await fetchProfileStats();
  if (!stats) redirect("/auth/login?next=/profile");

  const { cards, logs } = stats;

  // ── Tính toán stats ──
  const totalCards = cards.length;
  const matureCards = cards.filter((c) => c.box >= 4).length;
  const totalReps = cards.reduce((s, c) => s + c.total_reviews, 0);
  const correctReps = cards.reduce((s, c) => s + c.correct_reviews, 0);
  const accuracy = totalReps === 0 ? 0 : Math.round((correctReps / totalReps) * 100);

  // Streak: đếm số ngày liên tiếp tính từ hôm nay
  const today = new Date().toISOString().slice(0, 10);
  const logDates = new Set(logs.map((l) => l.date as string));
  let streak = 0;
  const d = new Date();
  while (logDates.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  // Box distribution
  const boxCount = [1, 2, 3, 4, 5].map(
    (b) => cards.filter((c) => c.box === b).length,
  );

  // Hard words (box 1, nhiều lần sai nhất)
  const hardWords = [...cards]
    .filter((c) => c.box === 1 && c.total_reviews > 0)
    .sort((a, b) => {
      const accA = a.correct_reviews / a.total_reviews;
      const accB = b.correct_reviews / b.total_reviews;
      return accA - accB;
    })
    .slice(0, 5);

  // Calendar data (12 tuần gần nhất)
  const calendarWeeks = buildCalendar(logs as { date: string; cards_reviewed: number }[], 12);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
            <ArrowSingleLeftIcon size={15} />
            <span className="text-sm font-black tracking-tight">KRD</span>
          </Link>
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
          <h1 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Hồ sơ</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* User info */}
        <div className="flex items-center gap-4">
          {stats.user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={stats.user.avatar} alt={stats.user.name} width={56} height={56} className="w-14 h-14 rounded-full ring-2 ring-primary-200 dark:ring-primary-800" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xl font-bold flex items-center justify-center ring-2 ring-primary-200 dark:ring-primary-800">
              {stats.user.name[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{stats.user.name}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">{stats.user.email}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Chuỗi ngày", value: `${streak}`, unit: "ngày", Icon: FireIcon, color: "text-secondary-500" },
            { label: "Chính xác", value: `${accuracy}`, unit: "%", Icon: TargetIcon, color: "text-error-500" },
            { label: "Thẻ vững", value: `${matureCards}`, unit: `/${totalCards}`, Icon: BoxIcon, color: "text-primary-600" },
            { label: "Đã ôn", value: `${totalReps}`, unit: "lần", Icon: SyncIcon, color: "text-success-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-center">
              <div className={`flex justify-center mb-1 ${s.color}`}>
                <s.Icon size={24} />
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none">
                {s.value}<span className="text-sm font-normal text-slate-400 ml-0.5">{s.unit}</span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Hộp Leitner distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Phân bổ hộp Leitner</h2>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((box) => {
              const count = boxCount[box - 1];
              const pct = totalCards === 0 ? 0 : Math.round((count / totalCards) * 100);
              const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400", "bg-primary-500"];
              return (
                <div key={box} className="flex items-center gap-3 text-sm">
                  <span className="w-12 shrink-0 text-xs font-mono text-slate-500 dark:text-slate-400">Hộp {box}</span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${colors[box - 1]} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-xs text-slate-500 dark:text-slate-400 text-right shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak calendar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Lịch học (12 tuần)</h2>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={day ? `${day.date}: ${day.count} thẻ` : ""}
                    className={`w-3.5 h-3.5 rounded-sm ${
                      !day ? "bg-transparent" :
                      day.count === 0 ? "bg-slate-100 dark:bg-slate-800" :
                      day.count < 5  ? "bg-emerald-200 dark:bg-emerald-900" :
                      day.count < 15 ? "bg-emerald-400 dark:bg-emerald-700" :
                                       "bg-emerald-600 dark:bg-emerald-500"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400 dark:text-slate-500">
            <span>Ít</span>
            {["bg-slate-100 dark:bg-slate-800", "bg-emerald-200 dark:bg-emerald-900", "bg-emerald-400 dark:bg-emerald-700", "bg-emerald-600 dark:bg-emerald-500"].map((c, i) => (
              <span key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span>Nhiều</span>
          </div>
        </div>

        {/* Từ khó nhất */}
        {hardWords.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Từ khó nhất (hộp 1)</h2>
            <div className="space-y-2">
              {hardWords.map((c) => {
                const acc = c.total_reviews === 0 ? 0 : Math.round((c.correct_reviews / c.total_reviews) * 100);
                return (
                  <div key={c.word_id} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-slate-600 dark:text-slate-400 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{c.word_id}</span>
                    <span className="text-slate-500 dark:text-slate-400">{acc}% đúng · {c.total_reviews} lần</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Helper: xây calendar 12 tuần ──────────────────────────
type CalDay = { date: string; count: number } | null;

function buildCalendar(logs: { date: string; cards_reviewed: number }[], weeks: number): CalDay[][] {
  const logMap = new Map(logs.map((l) => [l.date, l.cards_reviewed]));

  // Tìm ngày đầu tuần (thứ Hai) của tuần hiện tại
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0=Mon
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - dayOfWeek - (weeks - 1) * 7);

  const result: CalDay[][] = [];
  let d = new Date(startDate);

  for (let w = 0; w < weeks; w++) {
    const week: CalDay[] = [];
    for (let day = 0; day < 7; day++) {
      const dateStr = d.toISOString().slice(0, 10);
      const isPast = d <= now;
      week.push(isPast ? { date: dateStr, count: logMap.get(dateStr) ?? 0 } : null);
      d.setDate(d.getDate() + 1);
    }
    result.push(week);
  }

  return result;
}
