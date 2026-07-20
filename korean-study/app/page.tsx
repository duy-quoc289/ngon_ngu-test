import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProgressCard } from "@/components/layout/ProgressCard";
import { UserButton } from "@/components/auth/UserButton";

const NAV_LINKS = [
  { href: "/hangul", label: "Hangul" },
  { href: "/numbers", label: "Số đếm" },
  { href: "/pronunciation", label: "Nối âm" },
  { href: "/vocab", label: "Từ vựng" },
  { href: "/flashcards", label: "Thẻ ôn" },
  { href: "/grammar", label: "Ngữ pháp" },
  { href: "/summary", label: "Lộ trình" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Nav ── */}
      <nav className="ks-topbar sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 font-hand font-black text-ink tracking-tight" style={{ transform: "rotate(-1deg)" }}>
            <span className="text-base">🇰🇷</span>
            <span className="text-lg">KRD</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1 text-sm">
            {NAV_LINKS.map((n) => (
              <Link key={n.href} href={n.href} className="ks-icon-btn px-3 py-1.5 font-hand font-medium">
                {n.label}
              </Link>
            ))}
          </div>
          {/* Mobile nav */}
          <div className="flex sm:hidden items-center gap-2 text-sm overflow-x-auto">
            {NAV_LINKS.slice(0, 5).map((n) => (
              <Link key={n.href} href={n.href} className="ks-icon-btn shrink-0 px-2 py-1 text-xs font-hand font-medium">
                {n.label}
              </Link>
            ))}
          </div>
          <UserButton />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-14">
          <div className="text-center">
            <p className="text-4xl sm:text-5xl font-hand font-black mb-4 text-ink" lang="ko" style={{ transform: "rotate(-1deg)" }}>
              안녕하세요 👋
            </p>
            <h1 className="font-hand text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 text-ink leading-tight inline-block" style={{ transform: "rotate(-1.5deg)" }}>
              Tham khảo học tiếng Hàn
            </h1>
            <span className="ks-stamp block w-fit mx-auto mt-3 mb-5">TOPIK 1 · PHASE 0</span>
            <p className="text-ink/65 text-lg max-w-2xl mx-auto leading-relaxed">
              Tài liệu cá nhân ngắn gọn — cover Stage&nbsp;1 (Hangul, số đếm, nối âm) +&nbsp;160&nbsp;từ vựng trước khi bước vào TOPIK&nbsp;1.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/hangul"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-ink bg-primary-500 text-white font-hand font-semibold transition-transform duration-base hover:-translate-y-0.5"
                style={{ boxShadow: "3px 3px 0 rgb(35 34 34 / 0.2)" }}
              >
                Bắt đầu học
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
              </Link>
              <Link
                href="/vocab"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-ink bg-paper text-ink font-hand font-semibold transition-transform duration-base hover:-translate-y-0.5"
                style={{ boxShadow: "3px 3px 0 rgb(35 34 34 / 0.15)" }}
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
        <h2 className="ks-section-label mb-5">Nội dung học</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionCard
            href="/hangul"
            icon="한"
            iconLang="ko"
            iconColor="blue"
            title="Hangul (한글)"
            desc="21 nguyên âm, 14+5 phụ âm. Cấu trúc âm tiết. Bài tập đọc thử."
            cta="Bắt đầu ở đây"
            status="done"
          />
          <SectionCard
            href="/numbers"
            icon="1"
            iconColor="green"
            title="Số đếm (숫자)"
            desc="2 hệ thống Hán-Hàn vs thuần Hàn. Đơn vị đếm. Bẫy giờ-phút."
            cta="Học tiếp"
            status="done"
          />
          <SectionCard
            href="/pronunciation"
            icon="발"
            iconLang="ko"
            iconColor="coral"
            title="Quy tắc nối âm"
            desc="7 quy tắc 받침: nối âm, đồng hóa mũi, ㄹ, bật hơi, lược ㅎ, căng âm, vòm hóa."
            cta="Quan trọng"
            status="done"
          />
          <SectionCard
            href="/summary"
            icon="★"
            iconColor="highlight"
            title="Lộ trình ôn tập"
            desc="Kế hoạch 4 tuần đầu + mẹo học hiệu quả."
            cta="Xem lộ trình"
            status="done"
          />

          {/* Vocab — full-width */}
          <SectionCard
            wide
            href="/vocab"
            icon="단"
            iconLang="ko"
            iconColor="purple"
            title="Từ vựng (단어)"
            badge={<Badge variant="success" size="sm">160 từ</Badge>}
            desc="160 từ theo 4 chủ đề: 👋 Chào hỏi · 👨‍👩‍👧 Gia đình · 🍚 Ăn uống · 🛍️ Mua sắm. Có search + filter."
            cta="Học từ vựng"
          />

          {/* Flashcards SRS — Phase 3, đã có */}
          <SectionCard
            wide
            href="/flashcards"
            icon="🎴"
            iconColor="green"
            title="Thẻ ghi nhớ (SRS)"
            badge={<Badge variant="primary" size="sm">Giai đoạn 3</Badge>}
            desc="Học từ vựng theo hộp Leitner (5 cấp). Ôn đúng lúc, không quên. Tiến độ lưu trong trình duyệt."
            cta="Bắt đầu ôn"
          />

          <SectionCard
            href="/grammar"
            icon="문"
            iconLang="ko"
            iconColor="purple"
            title="Ngữ pháp (문법)"
            badge={<Badge variant="primary" size="sm">Giai đoạn 4</Badge>}
            desc="10 ngữ pháp cốt lõi TOPIK 1: 이다, -아/어요, thì quá khứ, tương lai, particles và phủ định."
            cta="Học ngay"
          />
          <SectionCard
            href="/dictation"
            icon="🎧"
            iconColor="coral"
            title="Chép chính tả"
            badge={<Badge variant="primary" size="sm">Giai đoạn 5</Badge>}
            desc="Nghe đoạn Korean từ 세종학당 → gõ lại Hangul → kiểm tra. Luyện phản xạ nghe-viết."
            cta="Luyện ngay"
          />
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="ks-section-label mb-5">Tài nguyên khuyên dùng</h2>
        <Card variant="outlined" className="p-5 sm:p-6">
          <p className="text-sm text-ink/60 mb-5">
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
                    className="font-hand font-semibold text-primary-600 hover:underline"
                  >
                    {r.title} ↗
                  </a>
                  <p className="text-sm text-ink/55 mt-0.5">{r.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-sm text-ink/50 border-t-2 border-dashed border-ink/20">
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

const ICON_BG: Record<string, string> = {
  blue: "var(--sk-washi-blue)",
  coral: "var(--sk-washi-pink)",
  green: "var(--sk-washi-green)",
  purple: "var(--sk-washi-blue)",
  highlight: "var(--sk-washi-yellow)",
};

interface SectionCardProps {
  href: string;
  icon: string;
  iconLang?: string;
  iconColor: keyof typeof ICON_BG;
  title: string;
  desc: string;
  cta: string;
  badge?: React.ReactNode;
  status?: "done" | "active" | "locked";
  wide?: boolean;
}

function SectionCard({ href, icon, iconLang, iconColor, title, desc, cta, badge, status, wide }: SectionCardProps) {
  return (
    <Link
      href={href}
      className={`ks-card group hover:-translate-y-0.5 transition-transform duration-base flex items-start gap-4 ${wide ? "sm:col-span-2" : ""}`}
    >
      <div
        className="w-12 h-12 rounded-xl border-2 border-ink text-ink grid place-items-center text-xl font-bold shrink-0"
        style={{ background: ICON_BG[iconColor], boxShadow: "2px 2px 0 rgb(35 34 34 / 0.15)", transform: "rotate(-2deg)" }}
        lang={iconLang}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-hand font-semibold text-ink group-hover:text-primary-600 flex items-center gap-2 transition-colors">
          {title}
          {status === "done" && <span className="text-xs text-success-600">✓</span>}
          {badge}
        </h3>
        <p className="text-ink/55 text-sm mt-1">{desc}</p>
        <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 font-hand font-semibold group-hover:gap-2 transition-all">
          {cta}
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" /></svg>
        </span>
      </div>
    </Link>
  );
}

