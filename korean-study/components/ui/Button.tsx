"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Button as SketchButton } from "sketchbook-ui";
import { sketchColors, skFont } from "@/lib/sketch-theme";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children: ReactNode;
}

// variant → màu bút (xem lib/sketch-theme.ts để đổi tông màu chung)
const VARIANT_COLORS: Record<
  NonNullable<ButtonProps["variant"]>,
  { bg: string; stroke: string; text: string; bgOverlay?: string }
> = {
  primary: { bg: sketchColors.penBlue, stroke: sketchColors.ink, text: sketchColors.onPen },
  secondary: { bg: sketchColors.penCoral, stroke: sketchColors.ink, text: sketchColors.onPen },
  danger: { bg: sketchColors.penRed, stroke: sketchColors.ink, text: sketchColors.onPen },
  outline: { bg: sketchColors.paper, stroke: sketchColors.ink, text: sketchColors.ink, bgOverlay: sketchColors.paperOverlay },
  ghost: { bg: "transparent", stroke: "transparent", text: sketchColors.ink },
};

const ICON_SIZE = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <SketchButton
      size={size}
      colors={colors}
      typography={{ fontFamily: skFont, fontWeight: 500 }}
      showBorder={variant !== "ghost"}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <svg
          className={`animate-spin ${ICON_SIZE[size]}`}
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === "left" && (
        <span className={ICON_SIZE[size]} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className={ICON_SIZE[size]} aria-hidden="true">
          {icon}
        </span>
      )}
    </SketchButton>
  );
}
