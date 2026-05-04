"use client";

import { useEffect, useMemo, useState } from "react";
import type { FlatVocabWord, VocabCategory, VocabData } from "@/lib/types";
import { TopBar } from "@/components/layout/TopBar";
import { Hero } from "@/components/layout/Hero";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDebouncedValue } from "@/lib/debounce";
import { CategoryChips } from "./CategoryChips";
import { SearchBox } from "./SearchBox";
import { VocabCard } from "./VocabCard";

const STORAGE_KEY = "ks-vocab-state";

interface PersistedState {
  catId?: string;
  query?: string;
}

interface Props {
  data: VocabData;
}

export function VocabPage({ data }: Props) {
  const [catId, setCatId] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 120);

  // Hydrate state từ localStorage. setState trong effect là pattern chuẩn cho hydration.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as PersistedState;
        /* eslint-disable react-hooks/set-state-in-effect */
        if (s.catId) setCatId(s.catId);
        if (s.query) setQuery(s.query);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Save state vào localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ catId, query }));
    } catch {
      // ignore quota error
    }
  }, [catId, query, hydrated]);

  // Flat list cho filter
  const flat = useMemo<FlatVocabWord[]>(
    () =>
      data.categories.flatMap((c) =>
        c.words.map((w) => ({ ...w, _catId: c.id })),
      ),
    [data],
  );

  const catLookup = useMemo<Record<string, VocabCategory>>(
    () => Object.fromEntries(data.categories.map((c) => [c.id, c])),
    [data],
  );

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let result = flat;
    if (catId !== "all") result = result.filter((w) => w._catId === catId);
    if (q) {
      result = result.filter(
        (w) =>
          w.ko.toLowerCase().includes(q) ||
          w.rom.toLowerCase().includes(q) ||
          w.vi.toLowerCase().includes(q) ||
          (w.viExtra || "").toLowerCase().includes(q) ||
          (w.tags || []).some((t) => t.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [flat, catId, debouncedQuery]);

  return (
    <>
      <TopBar
        title={data.title}
        titleKo={data.titleKo}
        countText={`${filtered.length}/${flat.length}`}
      />

      <main className="max-w-5xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6">
          <Hero
            icon="단"
            step="Phase 2 · Vocabulary"
            title="Từ vựng cơ bản"
            hint="~160 từ thực dụng theo 4 chủ đề. Click thẻ để nghe, dùng filter và search để tìm nhanh."
          />
        </div>

        <CategoryChips
          categories={data.categories}
          total={flat.length}
          active={catId}
          onSelect={setCatId}
        />

        <SearchBox value={query} onChange={setQuery} />

        {filtered.length > 0 ? (
          <div className="ks-vocab-list mt-5">
            {filtered.map((w, i) => (
              <VocabCard
                key={`${w._catId}-${i}-${w.ko}`}
                word={w}
                category={catLookup[w._catId]}
                query={debouncedQuery}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title="Không tìm thấy từ nào"
            description={
              debouncedQuery
                ? `Không có từ khớp với "${debouncedQuery}". Thử tìm kiếm khác hoặc xóa bộ lọc.`
                : "Không có từ nào trong danh mục này."
            }
            action={
              debouncedQuery || catId !== "all"
                ? { label: "Xóa bộ lọc", onClick: () => { setQuery(""); setCatId("all"); } }
                : undefined
            }
            className="mt-8"
          />
        )}
      </main>
    </>
  );
}
