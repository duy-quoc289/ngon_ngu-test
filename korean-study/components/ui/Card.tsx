"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { Card as SketchCard } from "sketchbook-ui";
import { sketchColors, skFont } from "@/lib/sketch-theme";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "elevated" | "outlined";
  hoverable?: boolean;
  clickable?: boolean;
  children: ReactNode;
}

// variant cũ → variant "sketchy" của sketchbook-ui
const VARIANT_MAP: Record<NonNullable<CardProps["variant"]>, "paper" | "notebook" | "sticky"> = {
  flat: "paper",
  elevated: "notebook",
  outlined: "notebook",
};

export function Card({
  variant = "elevated",
  hoverable = false,
  clickable = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const hoverClasses = hoverable ? "transition-transform duration-base hover:-translate-y-1" : "";
  const clickableClasses = clickable ? "cursor-pointer active:scale-[0.98]" : "";

  return (
    <SketchCard
      variant={VARIANT_MAP[variant]}
      colors={{ bg: sketchColors.paper, stroke: sketchColors.ink, text: sketchColors.ink }}
      typography={{ fontFamily: skFont }}
      className={`${hoverClasses} ${clickableClasses} ${className}`}
      {...props}
    >
      {children}
    </SketchCard>
  );
}

export function CardHeader({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 border-b-2 border-dashed border-black/15 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 border-t-2 border-dashed border-black/15 ${className}`} {...props}>
      {children}
    </div>
  );
}
