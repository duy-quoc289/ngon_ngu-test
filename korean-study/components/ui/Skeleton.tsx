"use client";

import { type HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "avatar" | "button";
  width?: string;
  height?: string;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

export function Skeleton({
  variant = "text",
  width,
  height,
  rounded = "md",
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const baseClasses =
    "animate-shimmer bg-gradient-to-r from-ink/8 via-ink/15 to-ink/8 bg-[length:200%_100%] border border-ink/10";

  const variantClasses = {
    text: "h-4 w-full",
    card: "h-32 w-full",
    avatar: "h-12 w-12",
    button: "h-10 w-24",
  };

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  // Override rounded for avatar variant
  const finalRounded = variant === "avatar" ? "full" : rounded;

  const inlineStyles = {
    ...(width && { width }),
    ...(height && { height }),
    ...style,
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${roundedClasses[finalRounded]}
        ${className}
      `}
      style={inlineStyles}
      aria-hidden="true"
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
