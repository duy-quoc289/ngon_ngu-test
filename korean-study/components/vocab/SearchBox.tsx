"use client";

import { useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBox({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Phím tắt: '/' focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="ks-vocab-search-wrap">
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ks-vocab-search-icon"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm theo Hàn / phiên âm / nghĩa Việt…"
        className="ks-vocab-search"
        aria-label="Tìm từ"
      />
      {value && (
        <button
          type="button"
          className="ks-vocab-search-clear"
          aria-label="Xóa"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
