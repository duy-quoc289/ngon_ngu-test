"use client";

import { type HTMLAttributes, type ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "elevated" | "outlined";
  hoverable?: boolean;
  clickable?: boolean;
  children: ReactNode;
}

export function Card({
  variant = "elevated",
  hoverable = false,
  clickable = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseClasses =
    "rounded-lg transition-all duration-base ease-smooth bg-white dark:bg-slate-900";

  const variantClasses = {
    flat: "shadow-none",
    elevated: "shadow-md hover:shadow-lg",
    outlined: "border border-slate-200 dark:border-slate-800 shadow-sm",
  };

  const hoverClasses = hoverable
    ? "hover:-translate-y-1 hover:shadow-xl"
    : "";

  const clickableClasses = clickable
    ? "cursor-pointer active:scale-[0.98]"
    : "";

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${hoverClasses}
        ${clickableClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 py-4 border-b border-slate-200 dark:border-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 py-4 border-t border-slate-200 dark:border-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
