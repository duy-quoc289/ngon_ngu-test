"use client";

import { type HTMLAttributes, type ReactNode } from "react";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "pink" | "gray";
  size?: "xs" | "sm";
  children: ReactNode;
}

// Màu washi tape — trỏ tới CSS var trong app/globals.css (tự đổi theo dark mode)
const COLOR_STYLES: Record<NonNullable<TagProps["color"]>, { bg: string; text: string }> = {
  blue: { bg: "var(--sk-washi-blue)", text: "var(--sk-ink)" },
  green: { bg: "var(--sk-washi-green)", text: "var(--sk-ink)" },
  yellow: { bg: "var(--sk-washi-yellow)", text: "var(--sk-ink)" },
  red: { bg: "var(--sk-washi-pink)", text: "var(--sk-ink)" },
  purple: { bg: "var(--sk-washi-blue)", text: "var(--sk-ink)" },
  pink: { bg: "var(--sk-washi-pink)", text: "var(--sk-ink)" },
  gray: { bg: "var(--sk-paper-overlay)", text: "var(--sk-ink)" },
};

export function Tag({
  color = "gray",
  size = "xs",
  className = "",
  children,
  style,
  ...props
}: TagProps) {
  const baseClasses = "inline-flex items-center font-medium rounded transition-colors duration-base";

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-sm",
  };

  const c = COLOR_STYLES[color];

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} font-hand ${className}`}
      style={{ backgroundColor: c.bg, color: c.text, ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
