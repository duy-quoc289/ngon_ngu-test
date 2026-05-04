"use client";

import { useCallback, useEffect, useState } from "react";
import { markLessonDone, getLessonProgress, type TopicKey } from "@/actions/progress";
import { createClient } from "@/lib/supabase/client";

/**
 * Track lesson IDs đã xem cho 1 topic.
 * - Load từ localStorage ngay (instant)
 * - Nếu đã login: merge với server (union), sync khi mark
 *
 * @param topic key (vd: "hangul", "numbers"...) → key LocalStorage `ks-progress-{topic}`
 */
export function useProgress(topic: string) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storageKey = `ks-progress-${topic}`;

    // 1. Load localStorage ngay
    let local = new Set<string>();
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) local = new Set(JSON.parse(raw) as string[]);
    } catch { /* ignore */ }
    setCompleted(local);
    setHydrated(true);

    // 2. Nếu login → fetch server + merge
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const serverSet = await getLessonProgress(topic as TopicKey);

      // Union: local ∪ server
      setCompleted((prev) => {
        const merged = new Set([...prev, ...serverSet]);
        // Sync local IDs chưa có trên server lên server
        for (const id of prev) {
          if (!serverSet.has(id)) {
            markLessonDone(topic as TopicKey, id).catch(console.error);
          }
        }
        try {
          localStorage.setItem(storageKey, JSON.stringify([...merged]));
        } catch { /* ignore */ }
        return merged;
      });
    });
  }, [topic]);

  const markCompleted = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        try {
          localStorage.setItem(`ks-progress-${topic}`, JSON.stringify([...next]));
        } catch { /* ignore */ }
        // Fire-and-forget sync lên server
        markLessonDone(topic as TopicKey, id).catch(console.error);
        return next;
      });
    },
    [topic],
  );

  return { completed, markCompleted, hydrated };
}
