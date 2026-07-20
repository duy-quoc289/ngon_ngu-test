"use client";

import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "error" | "success";
  inputSize?: "sm" | "md" | "lg";
  label?: string;
  helperText?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
}

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
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses =
      "w-full rounded-lg border-2 font-hand transition-all duration-base ease-smooth focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      default:
        "border-ink bg-paper text-ink placeholder:text-ink/35 focus:border-primary-500 focus:ring-primary-500",
      error:
        "border-error-500 bg-paper text-ink placeholder:text-ink/35 focus:border-error-600 focus:ring-error-500",
      success:
        "border-success-500 bg-paper text-ink placeholder:text-ink/35 focus:border-success-600 focus:ring-success-500",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-3 text-lg",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    const helperTextColor = {
      default: "text-ink/50",
      error: "text-error-600",
      success: "text-success-600",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="ks-field-label block text-sm mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 ${iconSizeClasses[inputSize]}`}
            >
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              ${baseClasses}
              ${variantClasses[variant]}
              ${sizeClasses[inputSize]}
              ${prefixIcon ? "pl-10" : ""}
              ${suffixIcon ? "pr-10" : ""}
              ${className}
            `}
            {...props}
          />
          {suffixIcon && (
            <div
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 ${iconSizeClasses[inputSize]}`}
            >
              {suffixIcon}
            </div>
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
