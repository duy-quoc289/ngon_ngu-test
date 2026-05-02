"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Track lesson IDs đã xem cho 1 topic. Persist vào LocalStorage.
 *
 * @param topic key (vd: "hangul", "numbers"...) → key LocalStorage `ks-progress-{topic}`
 */
export function useProgress(topic: string) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  // Read 1 lần khi mount (chỉ chạy ở client → tránh hydration mismatch).
  // setState trong effect là pattern chuẩn cho localStorage hydration.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`ks-progress-${topic}`);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCompleted(new Set(arr));
      }
    } catch {
      // ignore parse error
    }
    setHydrated(true);
  }, [topic]);

  const markCompleted = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        try {
          localStorage.setItem(`ks-progress-${topic}`, JSON.stringify([...next]));
        } catch {
          // ignore quota error
        }
        return next;
      });
    },
    [topic],
  );

  return { completed, markCompleted, hydrated };
}
