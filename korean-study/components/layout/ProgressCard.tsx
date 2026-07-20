"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

// Tổng số lesson của từng topic (lấy từ data/*.json)
const PHASES = [
  { label: "Hangul",     storageKey: "ks-progress-hangul",        total: 7  },
  { label: "Số đếm",    storageKey: "ks-progress-numbers",       total: 9  },
  { label: "Nối âm",    storageKey: "ks-progress-pronunciation",  total: 8  },
  { label: "Từ vựng",   storageKey: "ks-vocab-state",             total: -1 }, // -1 = chỉ kiểm tra có key không
  { label: "Flashcards", storageKey: "ks-srs-vocab",              total: -1 }, // có data SRS = đã bắt đầu
] as const;

function isDone(storageKey: string, total: number): boolean {
  try {
    if (total === 0) return false; // phase chưa triển khai
    if (total === -1) return Boolean(localStorage.getItem(storageKey)); // chỉ cần đã visit
    const raw = localStorage.getItem(storageKey);
    if (!raw) return false;
    const arr = JSON.parse(raw) as string[];
    return arr.length >= total;
  } catch {
    return false;
  }
}

export function ProgressCard() {
  const [phases, setPhases] = useState(() =>
    PHASES.map((p) => ({ label: p.label, done: false })),
  );

  useEffect(() => {
    setPhases(PHASES.map((p) => ({ label: p.label, done: isDone(p.storageKey, p.total) })));
  }, []);

  const doneCount = phases.filter((p) => p.done).length;
  const total = phases.length;
  const currentPhase = phases.find((p) => !p.done);
  // Nhãn ngắn — Badge của sketchbook-ui vẽ hình lục giác theo chiều rộng chữ,
  // chuỗi dài (vd "Phase 2/5 — Hangul") làm hình vẽ phình to đè lên nội dung khác.
  const badgeLabel = currentPhase ? `Phase ${doneCount + 1}/${total}` : "Hoàn thành 🎉";
  const doneLabels = phases.filter((p) => p.done).map((p) => p.label);
  const description =
    doneCount === 0
      ? "Bắt đầu với Hangul — bảng chữ cái tiếng Hàn."
      : `Đang ở Phase ${doneCount + 1} — ${doneLabels.join(" + ")} hoàn thành.`;

  return (
    <Card variant="outlined" className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-hand font-bold text-lg text-ink flex items-center gap-2">
            <span>📊</span>
            Tiến độ học
          </h2>
          <p className="text-ink/60 text-sm mt-1">{description}</p>
        </div>
        <span className="ks-count-pill shrink-0 font-hand">{badgeLabel}</span>
      </div>
      <ProgressBar value={doneCount} max={total} showPercent label="Tổng tiến độ" />
      <div className="grid grid-cols-5 gap-2 mt-4">
        {phases.map((p) => (
          <div key={p.label} className="text-center">
            <div className={`text-lg mb-0.5 ${p.done ? "" : "opacity-30 grayscale"}`}>
              {p.done ? "✅" : "⏳"}
            </div>
            <p
              className={`text-xs font-medium ${
                p.done ? "text-ink/80" : "text-ink/35"
              }`}
            >
              {p.label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
