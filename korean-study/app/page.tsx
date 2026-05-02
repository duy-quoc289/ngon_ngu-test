import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl">🇰🇷</span>
            <span>Học tiếng Hàn</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <Link href="/hangul" className="hover:text-accent-600">
              Hangul
            </Link>
            <Link href="/numbers" className="hover:text-accent-600">
              Số đếm
            </Link>
            <Link href="/pronunciation" className="hover:text-accent-600">
              Nối âm
            </Link>
            <Link href="/vocab" className="hover:text-accent-600">
              Từ vựng
            </Link>
            <Link href="/summary" className="hover:text-accent-600">
              Lộ trình
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10">
        <div className="text-center">
          <p className="text-3xl sm:text-4xl mb-3" lang="ko">
            안녕하세요
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-linear-to-r from-accent-600 via-violet-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Reference học tiếng Hàn
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Tài liệu cá nhân ngắn gọn cho người mới bắt đầu — đủ cover Stage 1 (Hangul, số đếm,
            nối âm) trước khi bước vào TOPIK 1.
          </p>
        </div>
      </section>

      {/* Progress card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="text-accent-500">📊</span>
                Tiến độ học
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Bạn đang ở Phase 2 — đã có Hangul + Số đếm + Nối âm + 160 từ vựng. Phase 3
                (Flashcard SRS) sắp tới.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              Phase 2/4 — Vocabulary
            </span>
          </div>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-accent-500 to-violet-500 rounded-full"
              style={{ width: "50%" }}
            />
          </div>
        </div>
      </section>

      {/* Section cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-xl font-bold mb-4">Nội dung học</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <SectionCard
            href="/hangul"
            icon="한"
            iconLang="ko"
            iconBg="from-accent-500 to-violet-500"
            iconShadow="shadow-accent-500/30"
            title="Hangul (한글)"
            desc="21 nguyên âm, 14+5 phụ âm. Cấu trúc âm tiết. Bài tập đọc thử."
            cta="Bắt đầu ở đây →"
          />
          <SectionCard
            href="/numbers"
            icon="1"
            iconBg="from-emerald-500 to-teal-500"
            iconShadow="shadow-emerald-500/30"
            title="Số đếm (숫자)"
            desc="2 hệ thống Hán-Hàn vs thuần Hàn. Đơn vị đếm. Bẫy giờ-phút."
            cta="Học tiếp →"
          />
          <SectionCard
            href="/pronunciation"
            icon="발"
            iconLang="ko"
            iconBg="from-pink-500 to-rose-500"
            iconShadow="shadow-pink-500/30"
            title="Quy tắc nối âm"
            desc="7 quy tắc 받침: nối âm, đồng hóa mũi, ㄹ, bật hơi, lược ㅎ, căng âm, vòm hóa."
            cta="Quan trọng →"
          />
          <SectionCard
            href="/summary"
            icon="★"
            iconBg="from-amber-500 to-orange-500"
            iconShadow="shadow-amber-500/30"
            title="Lộ trình ôn tập"
            desc="Kế hoạch 4 tuần đầu + mẹo học hiệu quả."
            cta="Xem lộ trình →"
          />
          <Link
            href="/vocab"
            className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-accent-500 hover:shadow-lg transition-all sm:col-span-2"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-white grid place-items-center text-xl font-bold shadow-md shadow-violet-500/30 shrink-0"
                lang="ko"
              >
                단
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold group-hover:text-accent-600 flex items-center gap-2">
                  Từ vựng (단어)
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Mới
                  </span>
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  160 từ theo 4 chủ đề: 👋 chào hỏi (40), 👨‍👩‍👧 gia đình (30), 🍚 ăn uống
                  (45), 🛍️ mua sắm (45). Có search + filter.
                </p>
                <span className="inline-block mt-2 text-xs text-accent-600 font-medium">
                  Học từ vựng →
                </span>
              </div>
            </div>
          </Link>

          <PlaceholderCard
            icon="문"
            title="Ngữ pháp (문법)"
            phase="Phase 4"
            desc="10 ngữ pháp cốt lõi: -아/어요, -았/었-, particles, kính ngữ..."
          />
          <PlaceholderCard
            icon="🎴"
            title="Flashcards (SRS)"
            phase="Phase 3"
            desc="Học từ vựng theo phương pháp Leitner box (5 cấp). Tiến độ lưu trong trình duyệt — không cần đăng ký."
            colSpan
          />
        </div>
      </section>

      {/* External resources */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-xl font-bold mb-4">Tài nguyên bên ngoài (khuyên dùng)</h2>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Site này tập trung làm reference cá nhân ngắn gọn. Cho học bài bản, hãy combine với:
          </p>
          <ul className="space-y-3">
            <ResourceItem
              emoji="📺"
              href="https://talktomeinkorean.com/"
              title="Talk To Me In Korean (TTMIK)"
              desc="Series Level 1-2 free, người dạy bản xứ, có audio + transcript."
            />
            <ResourceItem
              emoji="🎴"
              href="https://ankiweb.net/"
              title="Anki + Korean Decks"
              desc='SRS chuẩn industry. Tìm "TOPIK 1 vocabulary" trong shared decks.'
            />
            <ResourceItem
              emoji="📚"
              href="https://www.sejong-korean.org/"
              title="Sejong Korean"
              desc="Giáo trình chính thức của Hàn Quốc. PDF free 1-4."
            />
            <ResourceItem
              emoji="🔍"
              href="https://dict.naver.com/"
              title="Naver Dictionary"
              desc="Từ điển có audio chuẩn nhất. Cài app trên điện thoại."
            />
          </ul>
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <span>화이팅! 파이팅!</span>
          <span>Made with ❤️</span>
        </div>
      </footer>
    </>
  );
}

interface SectionCardProps {
  href: string;
  icon: string;
  iconLang?: string;
  iconBg: string;
  iconShadow: string;
  title: string;
  desc: string;
  cta: string;
}

function SectionCard({
  href,
  icon,
  iconLang,
  iconBg,
  iconShadow,
  title,
  desc,
  cta,
}: SectionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-accent-500 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl bg-linear-to-br ${iconBg} text-white grid place-items-center text-xl font-bold shadow-md ${iconShadow} shrink-0`}
          lang={iconLang}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold group-hover:text-accent-600">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{desc}</p>
          <span className="inline-block mt-2 text-xs text-accent-600 font-medium">{cta}</span>
        </div>
      </div>
    </Link>
  );
}

interface PlaceholderProps {
  icon: string;
  title: string;
  phase: string;
  desc: string;
  colSpan?: boolean;
}

function PlaceholderCard({ icon, title, phase, desc, colSpan }: PlaceholderProps) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 p-5 opacity-70 ${colSpan ? "sm:col-span-2" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 grid place-items-center text-xl font-bold shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold flex items-center gap-2">
            {title}
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {phase}
            </span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}

interface ResourceProps {
  emoji: string;
  href: string;
  title: string;
  desc: string;
}

function ResourceItem({ emoji, href, title, desc }: ResourceProps) {
  return (
    <li className="flex gap-3">
      <span className="text-2xl shrink-0">{emoji}</span>
      <div>
        <a
          href={href}
          target="_blank"
          rel="noopener"
          className="font-semibold text-accent-600 hover:underline"
        >
          {title}
        </a>
        <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
      </div>
    </li>
  );
}
