"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type CardState,
  type SrsRating,
  type SrsState,
  isDue,
  newCard,
  rateCard,
  updateStreak,
} from "./srs";

const STORAGE_KEY = "ks-srs-vocab";
const DAILY_NEW_LIMIT = 20;
const DAILY_REVIEW_LIMIT = 30;

const EMPTY_STATE: SrsState = {
  cards: {},
  streak: 0,
  lastStudyDate: "",
};

function load(): SrsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    return { ...EMPTY_STATE, ...JSON.parse(raw) };
  } catch {
    return EMPTY_STATE;
  }
}

function save(state: SrsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota
  }
}

export interface QueueItem {
  id: string; // audio key của từ
  isNew: boolean;
}

/**
 * Tạo queue ôn hôm nay từ danh sách tất cả word ids.
 * - Ưu tiên: due cards trước, new cards sau.
 * - Cap: 30 review + 20 new = 50 max.
 */
export function buildQueue(allIds: string[], state: SrsState): QueueItem[] {
  const now = Date.now();
  const dueCards: QueueItem[] = [];
  const newCards: QueueItem[] = [];

  for (const id of allIds) {
    const card = state.cards[id];
    if (!card) {
      newCards.push({ id, isNew: true });
    } else if (isDue(card, now)) {
      dueCards.push({ id, isNew: false });
    }
  }

  return [
    ...dueCards.slice(0, DAILY_REVIEW_LIMIT),
    ...newCards.slice(0, DAILY_NEW_LIMIT),
  ];
}

export function useSrsStore(allIds: string[]) {
  const [state, setState] = useState<SrsState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = load();
    setState(loaded);
    setHydrated(true);
  }, []);

  const getCard = useCallback(
    (id: string): CardState => state.cards[id] ?? newCard(),
    [state],
  );

  const submitRating = useCallback(
    (id: string, rating: SrsRating) => {
      setState((prev) => {
        const existing = prev.cards[id] ?? newCard();
        const updated: SrsState = {
          ...prev,
          cards: {
            ...prev.cards,
            [id]: rateCard(existing, rating),
          },
        };
        const withStreak = updateStreak(updated);
        save(withStreak);
        return withStreak;
      });
    },
    [],
  );

  const queue = hydrated ? buildQueue(allIds, state) : [];

  const stats = {
    total: Object.keys(state.cards).length,
    mature: Object.values(state.cards).filter((c) => c.box >= 3).length,
    streak: state.streak,
    accuracy:
      Object.values(state.cards).reduce((sum, c) => sum + c.totalReviews, 0) === 0
        ? 0
        : Math.round(
            (Object.values(state.cards).reduce((sum, c) => sum + c.correctReviews, 0) /
              Object.values(state.cards).reduce((sum, c) => sum + c.totalReviews, 0)) *
              100,
          ),
  };

  return { state, hydrated, queue, stats, getCard, submitRating };
}
