import Link from "next/link";
import {
  ArrowSingleRight as ArrowSingleRightIcon,
  MovieClapper as MovieClapperIcon,
  Card as CardIcon,
  Doc as DocIcon,
  Search as SearchIcon,
  Hand,
  Fire,
  Heart,
} from "duma-icons-react";
import { Card } from "@/components/ui/Card";
import { ProgressCard } from "@/components/layout/ProgressCard";
import { SectionGrid } from "@/components/layout/SectionGrid";
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
          <Link href="/" className="flex items-center gap-1.5 font-hand font-black text-ink tracking-tight shrink-0" style={{ transform: "rotate(-1deg)" }}>
            <span className="w-6 h-6 rounded-md bg-primary-500 text-white text-xs grid place-items-center shrink-0" lang="ko">한</span>
            <span className="text-lg">KRD</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1 text-sm overflow-x-auto">
            {NAV_LINKS.map((n) => (
              <Link key={n.href} href={n.href} className="ks-icon-btn shrink-0 whitespace-nowrap px-3 py-1.5 font-hand font-medium">
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
            <p className="text-4xl sm:text-5xl font-hand font-black mb-4 text-ink flex items-center justify-center gap-3" lang="ko" style={{ transform: "rotate(-1deg)" }}>
              안녕하세요 <Hand size={40} className="text-warning-500 shrink-0" />
            </p>
            <h1 className="font-hand text-3xl sm:text-4xl lg:text-5xl font-bold mb-1 text-ink leading-tight" style={{ transform: "rotate(-1.5deg)" }}>
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
                <ArrowSingleRightIcon size={16} />
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
        <SectionGrid />
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
              { Icon: MovieClapperIcon, href: "https://talktomeinkorean.com/", title: "Talk To Me In Korean", desc: "Series Level 1-2 free, audio + transcript chuẩn bản xứ." },
              { Icon: CardIcon, href: "https://ankiweb.net/", title: "Anki + Korean Decks", desc: 'SRS chuẩn industry. Tìm "TOPIK 1 vocabulary" trong shared decks.' },
              { Icon: DocIcon, href: "https://www.sejong-korean.org/", title: "Sejong Korean", desc: "Giáo trình chính thức của Hàn Quốc. PDF free 1-4." },
              { Icon: SearchIcon, href: "https://dict.naver.com/", title: "Naver Dictionary", desc: "Từ điển có audio chuẩn nhất. Cài app trên điện thoại." },
            ].map((r) => (
              <li key={r.href} className="flex gap-3 group">
                <span className="shrink-0 mt-0.5 text-primary-600">
                  <r.Icon size={30} />
                </span>
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
          <span lang="ko" className="inline-flex items-center gap-1">화이팅! 파이팅! <Fire size={14} className="text-secondary-500" /></span>
          <div className="flex items-center gap-3">
            <Link href="/design-system" className="hover:text-primary-500 transition-colors text-xs">Design System</Link>
            <span>·</span>
            <span className="inline-flex items-center gap-1">Made with <Heart size={14} className="text-secondary-500" /></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

