"use client";

import { type HTMLAttributes } from "react";
import { Spinner as SketchSpinner } from "sketchbook-ui";
import { sketchColors } from "@/lib/sketch-theme";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "white" | "current";
}

// size cũ "xs" không có trong sketchbook-ui (sm/md/lg) — thu nhỏ thủ công qua style
const XS_DIM = { width: 16, height: 16 };

const STROKE_COLOR: Record<NonNullable<SpinnerProps["color"]>, string> = {
  primary: sketchColors.penBlue,
  white: sketchColors.white,
  current: "currentColor",
};

export function Spinner({
  size = "md",
  color = "primary",
  className = "",
  style,
  ...props
}: SpinnerProps) {
  return (
    <SketchSpinner
      size={size === "xs" ? "sm" : size}
      colors={{ stroke: STROKE_COLOR[color] }}
      label="Loading"
      className={className}
      style={size === "xs" ? { ...XS_DIM, ...style } : style}
      {...props}
    />
  );
}
