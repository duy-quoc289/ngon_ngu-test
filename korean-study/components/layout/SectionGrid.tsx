"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowSingleRight, Star, Card as CardIcon, Headphone, Hand, Cutlery, ShoppingCart, Home, Tick, Play } from "duma-icons-react";
import { Badge } from "@/components/ui/Badge";
import { HOME_PHASES, isPhaseDone } from "@/lib/home-phases";

const ICON_BG: Record<string, string> = {
  blue: "var(--sk-washi-blue)",
  coral: "var(--sk-washi-pink)",
  green: "var(--sk-washi-green)",
  purple: "var(--sk-washi-blue)",
  highlight: "var(--sk-washi-yellow)",
};

interface SectionCardData {
  href: string;
  icon: ReactNode;
  iconLang?: string;
  iconColor: keyof typeof ICON_BG;
  title: string;
  desc: ReactNode;
  cta: string;
  badge?: "vocab" | "srs" | "grammar" | "dictation";
  wide?: boolean;
}

const BADGES: Record<NonNullable<SectionCardData["badge"]>, React.ReactNode> = {
  vocab: <Badge variant="success" size="sm">160 từ</Badge>,
  srs: <Badge variant="primary" size="sm">Giai đoạn 3</Badge>,
  grammar: <Badge variant="primary" size="sm">Giai đoạn 4</Badge>,
  dictation: <Badge variant="primary" size="sm">Giai đoạn 5</Badge>,
};

const CARDS: SectionCardData[] = [
  {
    href: "/hangul", icon: "한", iconLang: "ko", iconColor: "blue",
    title: "Hangul (한글)", desc: "21 nguyên âm, 14+5 phụ âm. Cấu trúc âm tiết. Bài tập đọc thử.",
    cta: "Bắt đầu ở đây",
  },
  {
    href: "/numbers", icon: "1", iconColor: "green",
    title: "Số đếm (숫자)", desc: "2 hệ thống Hán-Hàn vs thuần Hàn. Đơn vị đếm. Bẫy giờ-phút.",
    cta: "Học tiếp",
  },
  {
    href: "/pronunciation", icon: "발", iconLang: "ko", iconColor: "coral",
    title: "Quy tắc nối âm", desc: "7 quy tắc 받침: nối âm, đồng hóa mũi, ㄹ, bật hơi, lược ㅎ, căng âm, vòm hóa.",
    cta: "Quan trọng",
  },
  {
    href: "/summary", icon: <Star size={24} />, iconColor: "highlight",
    title: "Lộ trình ôn tập", desc: "Kế hoạch 4 tuần đầu + mẹo học hiệu quả.",
    cta: "Xem lộ trình",
  },
  {
    href: "/vocab", icon: "단", iconLang: "ko", iconColor: "purple", wide: true,
    title: "Từ vựng (단어)", badge: "vocab",
    desc: (
      <>
        160 từ theo 4 chủ đề: <Hand size={13} className="inline" /> Chào hỏi ·{" "}
        <Home size={13} className="inline" /> Gia đình ·{" "}
        <Cutlery size={13} className="inline" /> Ăn uống · <ShoppingCart size={13} className="inline" /> Mua sắm. Có search + filter.
      </>
    ),
    cta: "Học từ vựng",
  },
  {
    href: "/flashcards", icon: <CardIcon size={24} />, iconColor: "green", wide: true,
    title: "Thẻ ghi nhớ (SRS)", badge: "srs",
    desc: "Học từ vựng theo hộp Leitner (5 cấp). Ôn đúng lúc, không quên. Tiến độ lưu trong trình duyệt.",
    cta: "Bắt đầu ôn",
  },
  {
    href: "/grammar", icon: "문", iconLang: "ko", iconColor: "purple",
    title: "Ngữ pháp (문법)", badge: "grammar",
    desc: "10 ngữ pháp cốt lõi TOPIK 1: 이다, -아/어요, thì quá khứ, tương lai, particles và phủ định.",
    cta: "Học ngay",
  },
  {
    href: "/dictation", icon: <Headphone size={24} />, iconColor: "coral",
    title: "Chép chính tả", badge: "dictation",
    desc: "Nghe đoạn Korean từ 세종학당 → gõ lại Hangul → kiểm tra. Luyện phản xạ nghe-viết.",
    cta: "Luyện ngay",
  },
];

/** Trạng thái từng thẻ, tính từ cùng nguồn dữ liệu với đường hành trình ở ProgressCard. */
function useCardStatus() {
  const [status, setStatus] = useState<Record<string, "done" | "current">>({});

  useEffect(() => {
    const currentIndex = HOME_PHASES.findIndex((p) => !isPhaseDone(p.storageKey, p.total));
    const next: Record<string, "done" | "current"> = {};
    HOME_PHASES.forEach((p, i) => {
      if (isPhaseDone(p.storageKey, p.total)) next[p.href] = "done";
      else if (i === currentIndex) next[p.href] = "current";
    });
    setStatus(next);
  }, []);

  return status;
}

export function SectionGrid() {
  const status = useCardStatus();

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {CARDS.map((c) => (
        <SectionCard key={c.href} {...c} status={status[c.href]} />
      ))}
    </div>
  );
}

function SectionCard({
  href, icon, iconLang, iconColor, title, desc, cta, badge, wide, status,
}: SectionCardData & { status?: "done" | "current" }) {
  return (
    <Link
      href={href}
      className={`ks-card relative group hover:-translate-y-0.5 transition-transform duration-base flex items-start gap-4 ${wide ? "sm:col-span-2" : ""} ${
        status === "current" ? "border-primary-500! ring-2 ring-primary-300/60" : ""
      }`}
    >
      {status === "done" && (
        <span
          className="absolute -top-2.5 -right-2.5 rotate-[10deg] bg-success-500 text-white text-[11px] font-hand font-bold px-2 py-0.5 rounded-md border-2 border-ink inline-flex items-center gap-1"
          style={{ boxShadow: "2px 2px 0 rgb(35 34 34 / 0.25)" }}
        >
          <Tick size={11} /> Đã học
        </span>
      )}
      {status === "current" && (
        <span
          className="absolute -top-2.5 -right-2.5 -rotate-[8deg] bg-primary-500 text-white text-[11px] font-hand font-bold px-2 py-0.5 rounded-md border-2 border-ink inline-flex items-center gap-1"
          style={{ boxShadow: "2px 2px 0 rgb(35 34 34 / 0.25)" }}
        >
          <Play size={10} /> Tiếp theo
        </span>
      )}
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
          {badge && BADGES[badge]}
        </h3>
        <p className="text-ink/55 text-sm mt-1">{desc}</p>
        <span className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 font-hand font-semibold group-hover:gap-2 transition-all">
          {cta}
          <ArrowSingleRight size={14} />
        </span>
      </div>
    </Link>
  );
}
