"use client";

import { type HTMLAttributes } from "react";
import { Skeleton as SketchSkeleton } from "sketchbook-ui";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "avatar" | "button";
  width?: string | number;
  height?: string | number;
  // Không còn ý nghĩa với hình vẽ tay (đường viền wobble thay cho border-radius) — giữ lại để tương thích ngược, không dùng.
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

// variant cũ → variant thật của sketchbook-ui (vẽ path SVG wobble)
const VARIANT_MAP: Record<NonNullable<SkeletonProps["variant"]>, "text" | "rectangle" | "avatar"> = {
  text: "text",
  card: "rectangle",
  avatar: "avatar",
  button: "rectangle",
};

const DEFAULT_WIDTH: Record<NonNullable<SkeletonProps["variant"]>, string> = {
  text: "100%",
  card: "100%",
  avatar: "48px",
  button: "96px",
};

export function Skeleton({
  variant = "text",
  width,
  height,
  rounded: _rounded,
  className = "",
  ...props
}: SkeletonProps) {
  return (
    <SketchSkeleton
      variant={VARIANT_MAP[variant]}
      width={width ?? DEFAULT_WIDTH[variant]}
      height={height}
      className={className}
      {...props}
    />
  );
}

// Helper component for multiple text lines
export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "80%" : "100%"}
        />
      ))}
    </div>
  );
}
