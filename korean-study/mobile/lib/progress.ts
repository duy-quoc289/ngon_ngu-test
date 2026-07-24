"use client";

import { useCallback, useEffect, useState } from "react";
import { markLessonDone, getLessonProgress } from "./progress-sync";
import { createClient } from "@/lib/supabase/client";

interface StoredProgress {
  userId?: string;
  ids: string[];
}

function loadProgress(storageKey: string): StoredProgress {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { ids: [] };
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return { ids: parsed as string[] };
    return parsed as StoredProgress;
  } catch {
    return { ids: [] };
  }
}

function saveProgress(storageKey: string, data: StoredProgress) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // ignore quota
  }
}

/**
 * Track lesson IDs đã xem cho 1 topic. Anonymous → chỉ local. Đã login →
 * merge (union) với server + sync khi mark. Port từ lib/progress.ts gốc.
 */
export function useProgress(topic: string) {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storageKey = `ks-progress-${topic}`;
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      const stored = loadProgress(storageKey);

      const isMine = !stored.userId || stored.userId === uid;
      const localIds = isMine ? new Set(stored.ids) : new Set<string>();

      setCompleted(localIds);
      setHydrated(true);

      if (!uid) return;

      const serverSet = await getLessonProgress(topic);

      setCompleted(() => {
        const merged = new Set([...localIds, ...serverSet]);
        if (isMine) {
          for (const id of localIds) {
            if (!serverSet.has(id)) {
              markLessonDone(topic, id).catch(console.error);
            }
          }
        }
        saveProgress(storageKey, { userId: uid, ids: [...merged] });
        return merged;
      });
    });
  }, [topic]);

  const markCompleted = useCallback(
    (id: string) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        const uid = data.user?.id;
        setCompleted((prev) => {
          if (prev.has(id)) return prev;
          const next = new Set(prev);
          next.add(id);
          saveProgress(`ks-progress-${topic}`, { userId: uid, ids: [...next] });
          markLessonDone(topic, id).catch(console.error);
          return next;
        });
      });
    },
    [topic],
  );

  return { completed, markCompleted, hydrated };
}
