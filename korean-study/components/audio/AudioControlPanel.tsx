"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioProvider";
import { toggleTheme, getIsDark } from "@/lib/theme";

const RATES = [0.5, 0.75, 1, 1.25];

export function AudioControlPanel() {
  const { volume, setVolume, rate, setRate } = useAudio();
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Đọc theme hiện tại sau hydrate
  useEffect(() => {
    setIsDark(getIsDark());
  }, []);

  // Click ngoài panel → đóng
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  const handleThemeToggle = () => {
    const newDark = toggleTheme();
    setIsDark(newDark);
  };

  return (
    <div className="ks-controls" ref={panelRef}>
      <button
        type="button"
        className="ks-controls-toggle"
        aria-label="Cài đặt"
        title="Cài đặt"
        onClick={() => setOpen((v) => !v)}
      >
        {/* Gear icon */}
        <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="ks-controls-popover" hidden={!open}>

        {/* ── Dark mode toggle ── */}
        <div className="ks-controls-row">
          <span className="ks-controls-label">
            {isDark ? "🌙" : "☀️"} Giao diện
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Chuyển chế độ sáng/tối"
            onClick={handleThemeToggle}
            className={[
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
              "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              isDark ? "bg-primary-500" : "bg-slate-200",
            ].join(" ")}
          >
            <span
              className={[
              "inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white shadow",
              "transition-transform duration-200 text-[10px]",
              isDark ? "translate-x-5.5" : "translate-x-0.5",
              ].join(" ")}
            >
              {isDark ? "🌙" : "☀️"}
            </span>
          </button>
          <span className="ks-controls-val">{isDark ? "Tối" : "Sáng"}</span>
        </div>

        <div className="ks-controls-divider" />

        {/* ── Volume ── */}
        <div className="ks-controls-row">
          <label className="ks-controls-label" htmlFor="ks-volume">
            🔊 Âm lượng
          </label>
          <input
            id="ks-volume"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="ks-controls-range"
          />
          <span className="ks-controls-val">{Math.round(volume * 100)}%</span>
        </div>

        {/* ── Speed ── */}
        <div className="ks-controls-row">
          <span className="ks-controls-label">⏩ Tốc độ</span>
          <div className="ks-controls-rates">
            {RATES.map((r) => (
              <button
                key={r}
                type="button"
                className={r === rate ? "is-active" : ""}
                onClick={() => setRate(r)}
              >
                x{r}
              </button>
            ))}
          </div>
        </div>

        <p className="ks-controls-hint">
          Phím <kbd>Space</kbd> để nghe lại từ cuối
        </p>
      </div>
    </div>
  );
}
