"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TABS = [
  { key: "learn", href: "/learn", label: "Học", icon: "🎓" },
  { key: "review", href: "/", label: "Ôn tập", icon: "📇" },
  { key: "vocab", href: "/vocab", label: "Từ vựng", icon: "📚" },
  { key: "dictation", href: "/dictation", label: "Nghe", icon: "🎧" },
  { key: "profile", href: "/profile", label: "Cá nhân", icon: "🙂" },
] as const;

/**
 * Tab bar dưới màn hình, persistent qua route (đặt trong layout, không
 * remount khi chuyển tab) — thay cho TopBar/hamburger của bản web.
 */
export function TabBar() {
  const pathname = usePathname();
  const params = useSearchParams();

  // Ẩn tab bar khi đang trong "lesson runner" (full-screen, có footer riêng
  // với nút Tiếp tục) — tránh 2 thanh dưới cùng chồng lên nhau.
  if (pathname.startsWith("/learn/") && params.get("l")) return null;

  return (
    <nav className="ks-tabbar" aria-label="Điều hướng chính">
      {TABS.map((t) => {
        const isActive = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.key}
            href={t.href}
            className={`ks-tab-btn${isActive ? " is-active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="ks-tab-icon" aria-hidden>{t.icon}</span>
            <span className="ks-tab-label">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
