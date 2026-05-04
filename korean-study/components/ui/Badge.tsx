"use client";

import { type HTMLAttributes, type ReactNode } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  removable?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}

export function Badge({
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center gap-1 font-medium rounded-full transition-colors duration-base";

  const variantClasses = {
    default:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    primary:
      "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    success:
      "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300",
    warning:
      "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300",
    error:
      "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300",
    info: "bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  const removeButtonVariants = {
    default: "hover:bg-slate-200 dark:hover:bg-slate-700",
    primary: "hover:bg-primary-200 dark:hover:bg-primary-800/50",
    success: "hover:bg-success-200 dark:hover:bg-success-800/50",
    warning: "hover:bg-warning-200 dark:hover:bg-warning-800/50",
    error: "hover:bg-error-200 dark:hover:bg-error-800/50",
    info: "hover:bg-info-200 dark:hover:bg-info-800/50",
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={`rounded-full p-0.5 transition-colors ${removeButtonVariants[variant]}`}
          aria-label="Remove"
        >
          <svg
            className="w-3 h-3"
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
    </span>
  );
}
