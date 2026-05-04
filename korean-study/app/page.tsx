import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressCard } from "@/components/layout/ProgressCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 font-black text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors tracking-tight">
            <span className="text-base">🇰🇷</span>
            <span className="text-lg">KRD</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1 text-sm">
            {[
              { href: "/hangul", label: "Hangul" },
              { href: "/numbers", label: "Số đếm" },
              { href: "/pronunciation", label: "Nối âm" },
              { href: "/vocab", label: "Từ vựng" },
              { href: "/flashcards", label: "Thẻ ôn" },
              { href: "/summary", label: "Lộ trình" },
            ].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all font-medium"
              >
                {n.label}
              </Link>
            ))}
          </div>
          {/* Mobile nav */}
          <div className="flex sm:hidden items-center gap-2 text-sm overflow-x-auto">
            <Link href="/hangul" className="shrink-0 px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:text-primary-600 text-xs font-medium">Hangul</Link>
            <Link href="/vocab" className="shrink-0 px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:text-primary-600 text-xs font-medium">Từ vựng</Link>
            <Link href="/flashcards" className="shrink-0 px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:text-primary-600 text-xs font-medium">Thẻ ôn</Link>
            <Link href="/summary" className="shrink-0 px-2 py-1 rounded text-slate-600 dark:text-slate-400 hover:text-primary-600 text-xs font-medium">Lộ trình</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary-50 via-violet-50/60 to-slate-50 dark:from-primary-950/40 dark:via-violet-950/30 dark:to-slate-950 pointer-events-none" />
        <div className="absolute top-0 right-0 w-150 h-150 rounded-full bg-primary-200/20 dark:bg-primary-900/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-violet-200/20 dark:bg-violet-900/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-14">
          <div className="text-center">
            <p
              className="text-4xl sm:text-5xl font-black mb-4 text-slate-800 dark:text-slate-100 tracking-tight"
              lang="ko"
            >
              안녕하세요 👋
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 bg-linear-to-r from-primary-600 via-violet-500 to-pink-500 bg-clip-text text-transparent leading-tight pb-1">
              Tham khảo học tiếng Hàn
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Tài liệu cá nhân ngắn gọn — cover Stage&nbsp;1 (Hangul, số đếm, nối âm) +&nbsp;160&nbsp;từ vựng trước khi bước vào TOPIK&nbsp;1.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/hangul"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold shadow-md shadow-primary-500/30 hover:shadow-lg hover:shadow-primary-500/40 transition-all duration-base hover:-translate-y-0.5"
              >
                Bắt đầu học
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
              </Link>
              <Link
                href="/vocab"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-base hover:-translate-y-0.5"
              >
                160 từ vựng
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Progress card ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 -mt-2">
        <ProgressCard />
      </section>

      {/* ── Section cards ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Nội dung học</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionCard
            href="/hangul"
            icon="한"
            iconLang="ko"
            iconBg="from-primary-500 to-violet-500"
            iconShadow="shadow-primary-500/30"
            title="Hangul (한글)"
            desc="21 nguyên âm, 14+5 phụ âm. Cấu trúc âm tiết. Bài tập đọc thử."
            cta="Bắt đầu ở đây"
            status="done"
          />
          <SectionCard
            href="/numbers"
            icon="1"
            iconBg="from-emerald-500 to-teal-500"
            iconShadow="shadow-emerald-500/30"
            title="Số đếm (숫자)"
            desc="2 hệ thống Hán-Hàn vs thuần Hàn. Đơn vị đếm. Bẫy giờ-phút."
            cta="Học tiếp"
            status="done"
          />
          <SectionCard
            href="/pronunciation"
            icon="발"
            iconLang="ko"
            iconBg="from-pink-500 to-rose-500"
            iconShadow="shadow-pink-500/30"
            title="Quy tắc nối âm"
            desc="7 quy tắc 받침: nối âm, đồng hóa mũi, ㄹ, bật hơi, lược ㅎ, căng âm, vòm hóa."
            cta="Quan trọng"
            status="done"
          />
          <SectionCard
            href="/summary"
            icon="★"
            iconBg="from-amber-500 to-orange-500"
            iconShadow="shadow-amber-500/30"
            title="Lộ trình ôn tập"
            desc="Kế hoạch 4 tuần đầu + mẹo học hiệu quả."
            cta="Xem lộ trình"
            status="done"
          />

          {/* Vocab — full-width */}
          <Link
            href="/vocab"
            className="group sm:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-base flex items-start gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white grid place-items-center text-xl font-bold shadow-md shadow-violet-500/30 shrink-0"
              lang="ko"
            >
              단
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center gap-2 transition-colors">
                Từ vựng (단어)
                <Badge variant="success" size="sm">160 từ</Badge>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                160 từ theo 4 chủ đề: 👋 Chào hỏi · 👨‍👩‍👧 Gia đình · 🍚 Ăn uống · 🛍️ Mua sắm. Có search + filter.
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-2 transition-all">
                Học từ vựng
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
              </span>
            </div>
          </Link>

          {/* Flashcards SRS — Phase 3, đã có */}
          <Link
            href="/flashcards"
            className="group sm:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg transition-all duration-base flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 text-white grid place-items-center text-xl font-bold shadow-md shadow-emerald-500/30 shrink-0">
              🎴
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center gap-2 transition-colors">
                Thẻ ghi nhớ (SRS)
                <Badge variant="primary" size="sm">Giai đoạn 3</Badge>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Học từ vựng theo hộp Leitner (5 cấp). Ôn đúng lúc, không quên. Tiến độ lưu trong trình duyệt.
              </p>
              <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-2 transition-all">
                Bắt đầu ôn
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
              </span>
            </div>
          </Link>
          <PlaceholderCard
            icon="문"
            iconLang="ko"
            title="Ngữ pháp (문법)"
            phase="Giai đoạn 4"
            desc="10 ngữ pháp cốt lõi: -아/어요, -았/었-, particles, kính ngữ..."
          />
          <PlaceholderCard
            icon="✍️"
            title="Chính tả"
            phase="Giai đoạn 5"
            desc="Nghe - chép lại từ/câu. Luyện phản xạ nghe-viết Hangul."
          />
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Tài nguyên khuyên dùng</h2>
        <Card variant="outlined" className="p-5 sm:p-6 bg-white dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
            Site này là tham khảo cá nhân ngắn gọn. Để học bài bản, combine với:
          </p>
          <ul className="space-y-4">
            {[
              { emoji: "📺", href: "https://talktomeinkorean.com/", title: "Talk To Me In Korean", desc: "Series Level 1-2 free, audio + transcript chuẩn bản xứ." },
              { emoji: "🎴", href: "https://ankiweb.net/", title: "Anki + Korean Decks", desc: 'SRS chuẩn industry. Tìm "TOPIK 1 vocabulary" trong shared decks.' },
              { emoji: "📚", href: "https://www.sejong-korean.org/", title: "Sejong Korean", desc: "Giáo trình chính thức của Hàn Quốc. PDF free 1-4." },
              { emoji: "🔍", href: "https://dict.naver.com/", title: "Naver Dictionary", desc: "Từ điển có audio chuẩn nhất. Cài app trên điện thoại." },
            ].map((r) => (
              <li key={r.href} className="flex gap-3 group">
                <span className="text-2xl shrink-0 mt-0.5">{r.emoji}</span>
                <div>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {r.title} ↗
                  </a>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{r.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-sm text-slate-500 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <span lang="ko">화이팅! 파이팅! 🔥</span>
          <div className="flex items-center gap-3">
            <Link href="/design-system" className="hover:text-primary-500 transition-colors text-xs">Design System</Link>
            <span>·</span>
            <span>Made with ❤️</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────

interface SectionCardProps {
  href: string;
  icon: string;
  iconLang?: string;
  iconBg: string;
  iconShadow: string;
  title: string;
  desc: string;
  cta: string;
  status?: "done" | "active" | "locked";
}

function SectionCard({ href, icon, iconLang, iconBg, iconShadow, title, desc, cta, status = "active" }: SectionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-base flex items-start gap-4"
    >
      <div
        className={`w-12 h-12 rounded-xl bg-linear-to-br ${iconBg} text-white grid place-items-center text-xl font-bold shadow-md ${iconShadow} shrink-0`}
        lang={iconLang}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex items-center gap-2 transition-colors">
          {title}
          {status === "done" && <span className="text-xs text-success-600 dark:text-success-400">✓</span>}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{desc}</p>
        <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-2 transition-all">
          {cta}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
        </span>
      </div>
    </Link>
  );
}

interface PlaceholderProps {
  icon: string;
  iconLang?: string;
  title: string;
  phase: string;
  desc: string;
  colSpan?: boolean;
}

function PlaceholderCard({ icon, iconLang, title, phase, desc, colSpan }: PlaceholderProps) {
  return (
    <div className={`rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-5 ${colSpan ? "sm:col-span-2" : ""}`}>
      <div className="flex items-start gap-4 opacity-60">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 grid place-items-center text-xl font-bold shrink-0" lang={iconLang}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            {title}
            <Badge variant="default" size="sm">{phase}</Badge>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}
