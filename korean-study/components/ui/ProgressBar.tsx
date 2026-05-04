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

  const trackH = size === "sm" ? "h-1.5" : "h-2.5";

  const fillGradient = {
    primary: "from-primary-500 to-violet-500",
    success: "from-success-500 to-emerald-400",
    warning: "from-warning-500 to-amber-400",
  };

  return (
    <div className={className}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {label}
            </span>
          )}
          {showPercent && (
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {pct}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full ${trackH} bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full bg-linear-to-r ${fillGradient[color]} rounded-full transition-all duration-slow ease-smooth`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
