"use client";

import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";

// ─── Context ─────────────────────────────────────────────

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
  active: "",
  setActive: () => {},
});

// ─── Tabs Root ───────────────────────────────────────────

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
}

export function Tabs({
  defaultValue = "",
  value,
  onChange,
  className = "",
  children,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultValue);
  const active = value ?? internalActive;

  const setActive = (id: string) => {
    if (!value) setInternalActive(id);
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// ─── TabList ─────────────────────────────────────────────

export function TabList({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard ←/→ navigate tabs
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    if (!tabs) return;
    const arr = Array.from(tabs);
    const focusedIdx = arr.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowRight" && focusedIdx < arr.length - 1) {
      arr[focusedIdx + 1].focus();
    } else if (e.key === "ArrowLeft" && focusedIdx > 0) {
      arr[focusedIdx - 1].focus();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={`flex border-b-2 border-ink/15 gap-1 ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Tab ─────────────────────────────────────────────────

export interface TabProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ value, children, disabled = false, className = "" }: TabProps) {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActive(value)}
      className={`
        ks-tab relative px-4 py-2.5 text-sm transition-all duration-base
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        disabled:opacity-40 disabled:cursor-not-allowed
        ${isActive ? "is-active text-primary-600" : "hover:opacity-100"}
        ${className}
      `}
    >
      {children}
      {/* Underline indicator — nét highlighter thay vì underline mảnh */}
      {isActive && (
        <span className="ks-tab-underline absolute -bottom-0.5 left-1 right-1" />
      )}
    </button>
  );
}

// ─── TabPanel ────────────────────────────────────────────

export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className = "" }: TabPanelProps) {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return (
    <div role="tabpanel" className={`animate-fade-in ${className}`}>
      {children}
    </div>
  );
}
