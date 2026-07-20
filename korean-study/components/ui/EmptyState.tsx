"use client";

import { type ReactNode } from "react";
import { Search } from "duma-icons-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon = <Search size={32} />,
  title,
  description,
  action,
  className = "",
  children,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      <div className="ks-empty-icon mb-4 select-none">{icon}</div>
      <h3 className="font-hand text-lg font-bold text-ink mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-ink/55 max-w-sm">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
      {action && (
        <div className="mt-6">
          <Button variant="primary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
