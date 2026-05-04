"use client";

import { useCallback, useEffect, useState } from "react";
import { markLessonDone, getLessonProgress, type TopicKey } from "@/actions/progress";
import { createClient } from "@/lib/supabase/client";

interface StoredProgress {
  userId?: string; // undefined = anonymous (backward compat với format cũ)
  ids: string[];
}

function loadProgress(storageKey: string): StoredProgress {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { ids: [] };
    const parsed = JSON.parse(raw) as unknown;
    // Backward compat: format cũ là string[] thuần
    if (Array.isArray(parsed)) return { ids: parsed as string[] };
    return parsed as StoredProgress;
  } catch {
    return { ids: [] };
  }
}

function saveProgress(storageKey: string, data: StoredProgress) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch { /* ignore quota */ }
}

/**
 * Track lesson IDs đã xem cho 1 topic.
 * - Nếu đã login: merge với server (union), sync khi mark
 * - userId được lưu cùng data để tránh user khác nhận nhầm progress
 *
 * @param topic key (vd: "hangul", "numbers"...) → key LocalStorage `ks-progress-{topic}`
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

      // Kiểm tra ownership: undefined userId = anonymous/legacy → coi là của user hiện tại
      const isMine = !stored.userId || stored.userId === uid;
      const localIds = isMine ? new Set(stored.ids) : new Set<string>();

      setCompleted(localIds);
      setHydrated(true);

      if (!uid) return; // anonymous — chỉ dùng local

      const serverSet = await getLessonProgress(topic as TopicKey);

      // Union: local (nếu là của mình) ∪ server
      setCompleted(() => {
        const merged = new Set([...localIds, ...serverSet]);
        // Sync local IDs chưa có trên server (chỉ nếu data là của mình)
        if (isMine) {
          for (const id of localIds) {
            if (!serverSet.has(id)) {
              markLessonDone(topic as TopicKey, id).catch(console.error);
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
          markLessonDone(topic as TopicKey, id).catch(console.error);
          return next;
        });
      });
    },
    [topic],
  );

  return { completed, markCompleted, hydrated };
}
