"use client";

import { useEffect, useRef, useState } from "react";
import { Setting, VolumeUp, FastForward, Sun, Night } from "duma-icons-react";
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
        <Setting size={18} />
      </button>

      <div className="ks-controls-popover" hidden={!open}>

        {/* ── Dark mode toggle ── */}
        <div className="ks-controls-row">
          <span className="ks-controls-label flex items-center gap-1">
            {isDark ? <Night size={14} /> : <Sun size={14} />} Giao diện
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
              "transition-transform duration-200",
              isDark ? "translate-x-5.5 text-primary-600" : "translate-x-0.5 text-warning-500",
              ].join(" ")}
            >
              {isDark ? <Night size={11} /> : <Sun size={11} />}
            </span>
          </button>
          <span className="ks-controls-val">{isDark ? "Tối" : "Sáng"}</span>
        </div>

        <div className="ks-controls-divider" />

        {/* ── Volume ── */}
        <div className="ks-controls-row">
          <label className="ks-controls-label flex items-center gap-1" htmlFor="ks-volume">
            <VolumeUp size={14} /> Âm lượng
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
          <span className="ks-controls-label flex items-center gap-1"><FastForward size={14} /> Tốc độ</span>
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
