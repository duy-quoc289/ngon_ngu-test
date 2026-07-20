"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { Badge as SketchBadge } from "sketchbook-ui";
import { sketchColors, skFont } from "@/lib/sketch-theme";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  removable?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}

// variant → màu washi tape (xem lib/sketch-theme.ts để đổi tông màu chung)
const VARIANT_COLORS: Record<NonNullable<BadgeProps["variant"]>, { bg: string; text: string; stroke: string }> = {
  default: { bg: sketchColors.paper, text: sketchColors.ink, stroke: sketchColors.ink },
  primary: { bg: sketchColors.washiBlue, text: sketchColors.ink, stroke: sketchColors.ink },
  success: { bg: sketchColors.washiGreen, text: sketchColors.ink, stroke: sketchColors.ink },
  warning: { bg: sketchColors.washiYellow, text: sketchColors.ink, stroke: sketchColors.ink },
  error: { bg: sketchColors.washiPink, text: sketchColors.ink, stroke: sketchColors.ink },
  info: { bg: sketchColors.washiBlue, text: sketchColors.ink, stroke: sketchColors.ink },
};

export function Badge({
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1">
      <SketchBadge
        variant={variant === "primary" ? "info" : variant}
        size={size}
        colors={VARIANT_COLORS[variant]}
        typography={{ fontFamily: skFont, fontWeight: 500 }}
        className={className}
        {...props}
      >
        {children}
      </SketchBadge>
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
          aria-label="Remove"
          style={{ color: sketchColors.ink }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
