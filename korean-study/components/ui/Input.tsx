"use client";

import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { Input as SketchInput } from "sketchbook-ui";
import { sketchColors, skFont } from "@/lib/sketch-theme";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "error" | "success";
  inputSize?: "sm" | "md" | "lg";
  label?: string;
  helperText?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
}

// variant → màu bút viền (xem lib/sketch-theme.ts để đổi tông màu chung)
const VARIANT_STROKE: Record<NonNullable<InputProps["variant"]>, string> = {
  default: sketchColors.ink,
  error: sketchColors.penRed,
  success: sketchColors.penGreen,
};

const helperTextColor = {
  default: "text-ink/50",
  error: "text-error-600",
  success: "text-success-600",
};

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      inputSize = "md",
      label,
      helperText,
      prefixIcon,
      suffixIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="ks-field-label block text-sm mb-1.5 text-ink">
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          {prefixIcon && (
            <span
              className={`shrink-0 text-ink/45 ${iconSizeClasses[inputSize]}`}
              aria-hidden="true"
            >
              {prefixIcon}
            </span>
          )}
          <SketchInput
            ref={ref}
            size={inputSize}
            colors={{ stroke: VARIANT_STROKE[variant], bg: sketchColors.paper, bgOverlay: sketchColors.paperOverlay, text: sketchColors.ink }}
            typography={{ fontFamily: skFont }}
            disabled={disabled}
            className={`flex-1 min-w-0 ${className}`}
            {...props}
          />
          {suffixIcon && (
            <span
              className={`shrink-0 text-ink/45 ${iconSizeClasses[inputSize]}`}
              aria-hidden="true"
            >
              {suffixIcon}
            </span>
          )}
        </div>
        {helperText && (
          <p className={`mt-1.5 text-sm ${helperTextColor[variant]}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
