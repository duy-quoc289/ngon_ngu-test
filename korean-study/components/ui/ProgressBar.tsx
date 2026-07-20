"use client";

export interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: "sm" | "md";
  color?: "primary" | "success" | "warning";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = false,
  size = "md",
  color = "primary",
  className = "",
}: ProgressBarProps) {
  const pct = Math.min(Math.max(Math.round((value / Math.max(max, 1)) * 100), 0), 100);

  const trackH = size === "sm" ? "h-2" : "h-3";

  // Màu bút phẳng (không gradient) — khớp bảng màu washi/pen trong lib/sketch-theme.ts
  const fillColor = {
    primary: "bg-primary-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
  };

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="font-hand text-sm font-medium text-ink">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-xs text-ink/50 tabular-nums">
              {pct}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${trackH} bg-paper-overlay border border-ink/20 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full ${fillColor[color]} rounded-full transition-all duration-slow ease-smooth`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
