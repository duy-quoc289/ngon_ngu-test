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
      "w-full rounded-md border transition-all duration-base ease-smooth focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-900";

    const variantClasses = {
      default:
        "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500",
      error:
        "border-error-500 bg-white text-slate-900 placeholder:text-slate-400 focus:border-error-600 focus:ring-error-500 dark:bg-slate-800 dark:text-slate-100",
      success:
        "border-success-500 bg-white text-slate-900 placeholder:text-slate-400 focus:border-success-600 focus:ring-success-500 dark:bg-slate-800 dark:text-slate-100",
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
      default: "text-slate-500 dark:text-slate-400",
      error: "text-error-600 dark:text-error-400",
      success: "text-success-600 dark:text-success-400",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 ${iconSizeClasses[inputSize]}`}
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
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 ${iconSizeClasses[inputSize]}`}
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
