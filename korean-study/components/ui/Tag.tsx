"use client";

import { type HTMLAttributes, type ReactNode } from "react";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "pink" | "gray";
  size?: "xs" | "sm";
  children: ReactNode;
}

export function Tag({
  color = "gray",
  size = "xs",
  className = "",
  children,
  ...props
}: TagProps) {
  const baseClasses =
    "inline-flex items-center font-medium rounded transition-colors duration-base";

  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    green:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    yellow:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    purple:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    gray: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };

  const sizeClasses = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-sm",
  };

  return (
    <span
      className={`${baseClasses} ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
