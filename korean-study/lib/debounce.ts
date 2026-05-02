"use client";

import { useEffect, useState } from "react";

/** Debounce 1 value — return ra value mới sau khi `delay` ms không có thay đổi. */
export function useDebouncedValue<T>(value: T, delay = 120): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
