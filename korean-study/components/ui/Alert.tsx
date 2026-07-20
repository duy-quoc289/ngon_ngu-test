"use client";

import { type ReactNode, useState } from "react";
import { Cross, Info, Tick, Caution } from "duma-icons-react";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  children: ReactNode;
}

const variantConfig = {
  info: {
    Icon: Info,
    bg: "bg-info-50 dark:bg-info-900/20",
    border: "border-info-200 dark:border-info-800",
    text: "text-info-800 dark:text-info-200",
    title: "text-info-900 dark:text-info-100",
  },
  success: {
    Icon: Tick,
    bg: "bg-success-50 dark:bg-success-900/20",
    border: "border-success-200 dark:border-success-800",
    text: "text-success-800 dark:text-success-200",
    title: "text-success-900 dark:text-success-100",
  },
  warning: {
    Icon: Caution,
    bg: "bg-warning-50 dark:bg-warning-900/20",
    border: "border-warning-200 dark:border-warning-800",
    text: "text-warning-800 dark:text-warning-200",
    title: "text-warning-900 dark:text-warning-100",
  },
  error: {
    Icon: Cross,
    bg: "bg-error-50 dark:bg-error-900/20",
    border: "border-error-200 dark:border-error-800",
    text: "text-error-800 dark:text-error-200",
    title: "text-error-900 dark:text-error-100",
  },
};

export function Alert({
  variant = "info",
  title,
  dismissible = false,
  onDismiss,
  className = "",
  children,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const cfg = variantConfig[variant];

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={`ks-alert p-4 flex gap-3 ${cfg.bg} ${cfg.text} ${className}`}
    >
      <span className="shrink-0 mt-0.5" aria-hidden="true">
        <cfg.Icon size={18} />
      </span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`font-semibold text-sm mb-1 ${cfg.title}`}>{title}</p>
        )}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-2"
          aria-label="Đóng"
        >
          <Cross size={14} />
        </button>
      )}
    </div>
  );
}
