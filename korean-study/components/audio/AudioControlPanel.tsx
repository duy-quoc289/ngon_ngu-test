"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "./AudioProvider";

const RATES = [0.5, 0.75, 1, 1.25];

export function AudioControlPanel() {
  const { volume, setVolume, rate, setRate } = useAudio();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Click ngoài panel → đóng
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  return (
    <div className="ks-controls" ref={panelRef}>
      <button
        type="button"
        className="ks-controls-toggle"
        aria-label="Cài đặt audio"
        title="Cài đặt audio"
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
          <path d="M8 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM8 6a2 2 0 110 4 2 2 0 010-4z" />
        </svg>
      </button>
      <div className="ks-controls-popover" hidden={!open}>
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
                {r}×
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
