"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Analytics, Card as CardIcon, Trophy, Tick } from "duma-icons-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { HOME_PHASES, isPhaseDone } from "@/lib/home-phases";

// icon/iconLang khớp với SectionCard ở trang chủ để người dùng nhận ra cùng 1 mục
const PHASE_ICONS: Record<string, { icon: ReactNode; iconLang?: string }> = {
  "/hangul": { icon: "한", iconLang: "ko" },
  "/numbers": { icon: "1" },
  "/pronunciation": { icon: "발", iconLang: "ko" },
  "/vocab": { icon: "단", iconLang: "ko" },
  "/flashcards": { icon: <CardIcon size={18} /> },
};

export function ProgressCard() {
  const [phases, setPhases] = useState(() =>
    HOME_PHASES.map((p) => ({ label: p.label, ...PHASE_ICONS[p.href], done: false })),
  );

  useEffect(() => {
    setPhases(
      HOME_PHASES.map((p) => ({
        label: p.label,
        ...PHASE_ICONS[p.href],
        done: isPhaseDone(p.storageKey, p.total),
      })),
    );
  }, []);

  const doneCount = phases.filter((p) => p.done).length;
  const total = phases.length;
  const currentIndex = phases.findIndex((p) => !p.done);
  const isAllDone = currentIndex === -1;
  // Nhãn ngắn — Badge của sketchbook-ui vẽ hình lục giác theo chiều rộng chữ,
  // chuỗi dài (vd "Phase 2/5 — Hangul") làm hình vẽ phình to đè lên nội dung khác.
  const badgeLabel: ReactNode = isAllDone
    ? <span className="inline-flex items-center gap-1">Hoàn thành <Trophy size={14} className="text-warning-500" /></span>
    : `Phase ${doneCount + 1}/${total}`;
  const description = isAllDone
    ? "Đã hoàn thành cả 5 chặng — quay lại ôn tập bất cứ lúc nào."
    : doneCount === 0
      ? "Bắt đầu với Hangul — bảng chữ cái tiếng Hàn."
      : `Tiếp theo: ${phases[currentIndex].label}.`;

  return (
    <Card variant="outlined" className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="font-hand font-bold text-lg text-ink flex items-center gap-2">
            <Analytics size={20} />
            Tiến độ học
          </h2>
          <p className="text-ink/60 text-sm mt-1">{description}</p>
        </div>
        <span className="ks-count-pill shrink-0 font-hand">{badgeLabel}</span>
      </div>
      <ProgressBar value={doneCount} max={total} showPercent label="Tổng tiến độ" />

      {/* Chặng học — "hành trình" nối các mốc bằng đường kẻ tay */}
      <div className="flex items-start mt-6">
        {phases.map((p, i) => {
          const isCurrent = i === currentIndex;
          return (
            <Fragment key={p.label}>
              <div className="flex flex-col items-center gap-1.5 shrink-0 w-14 sm:w-16">
                <div className="relative">
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-primary-400/40 animate-ping" />
                  )}
                  <div
                    className={`relative w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-ink grid place-items-center text-sm sm:text-base font-bold transition-transform ${
                      p.done
                        ? "bg-success-500 text-white"
                        : isCurrent
                          ? "bg-primary-500 text-white -translate-y-0.5"
                          : "bg-paper-overlay text-ink/35"
                    }`}
                    style={
                      p.done || isCurrent
                        ? { boxShadow: "2px 2px 0 rgb(35 34 34 / 0.2)" }
                        : undefined
                    }
                  >
                    {p.done ? <Tick size={16} /> : <span lang={p.iconLang}>{p.icon}</span>}
                  </div>
                </div>
                <p
                  className={`text-[11px] sm:text-xs text-center leading-tight ${
                    isCurrent ? "font-hand font-bold text-primary-600" : p.done ? "text-ink/70" : "text-ink/35"
                  }`}
                >
                  {p.label}
                </p>
              </div>
              {i < phases.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-4.5 sm:mt-5.5 ${
                    p.done ? "bg-success-400" : "border-t-2 border-dashed border-ink/20"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </Card>
  );
}
