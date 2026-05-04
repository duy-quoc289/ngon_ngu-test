"use client";

import { type ReactNode, useState } from "react";

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
    icon: "ℹ️",
    bg: "bg-info-50 dark:bg-info-900/20",
    border: "border-info-200 dark:border-info-800",
    text: "text-info-800 dark:text-info-200",
    title: "text-info-900 dark:text-info-100",
  },
  success: {
    icon: "✅",
    bg: "bg-success-50 dark:bg-success-900/20",
    border: "border-success-200 dark:border-success-800",
    text: "text-success-800 dark:text-success-200",
    title: "text-success-900 dark:text-success-100",
  },
  warning: {
    icon: "⚠️",
    bg: "bg-warning-50 dark:bg-warning-900/20",
    border: "border-warning-200 dark:border-warning-800",
    text: "text-warning-800 dark:text-warning-200",
    title: "text-warning-900 dark:text-warning-100",
  },
  error: {
    icon: "❌",
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
      className={`rounded-lg border p-4 flex gap-3 ${cfg.bg} ${cfg.border} ${cfg.text} ${className}`}
    >
      <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">
        {cfg.icon}
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
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
