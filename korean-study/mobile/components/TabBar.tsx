"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { key: "review", href: "/", label: "Ôn tập", icon: "📇" },
  { key: "vocab", href: "/vocab", label: "Từ vựng", icon: "📚" },
  { key: "profile", href: null, label: "Cá nhân", icon: "🙂" },
] as const;

/**
 * Tab bar dưới màn hình, persistent qua route (đặt trong layout, không
 * remount khi chuyển tab) — thay cho TopBar/hamburger của bản web.
 */
export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="ks-tabbar" aria-label="Điều hướng chính">
      {TABS.map((t) => {
        const isActive = t.href !== null && pathname === t.href;
        if (t.href === null) {
          return (
            <button key={t.key} type="button" className="ks-tab-btn" disabled aria-label={`${t.label} (sắp có)`}>
              <span className="ks-tab-icon" aria-hidden>{t.icon}</span>
              <span className="ks-tab-label">{t.label}</span>
            </button>
          );
        }
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
