"use client";

import { useEffect, useMemo, useState } from "react";
import vocabData from "@/data/vocab.json";
import type { FlatVocabWord, VocabCategory, VocabData } from "@/lib/types";
import { useDebouncedValue } from "@/lib/debounce";
import { VocabRow } from "@/components/VocabRow";

const DATA = vocabData as VocabData;
const STORAGE_KEY = "ks-vocab-state";

interface Persisted {
  catId?: string;
  query?: string;
}

export default function VocabListPage() {
  const [catId, setCatId] = useState("all");
  const [query, setQuery] = useState("");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query, 120);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Persisted;
        /* eslint-disable react-hooks/set-state-in-effect */
        if (s.catId) setCatId(s.catId);
        if (s.query) setQuery(s.query);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ catId, query }));
    } catch {
      // ignore quota
    }
  }, [catId, query]);

  const flat = useMemo<FlatVocabWord[]>(
    () => DATA.categories.flatMap((c) => c.words.map((w) => ({ ...w, _catId: c.id }))),
    [],
  );
  const catLookup = useMemo<Record<string, VocabCategory>>(
    () => Object.fromEntries(DATA.categories.map((c) => [c.id, c])),
    [],
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
          w.vi.toLowerCase().includes(q),
      );
    }
    return result;
  }, [flat, catId, debouncedQuery]);

  return (
    <div className="ks-app-shell">
      <header className="ks-vocab-header">
        <div className="ks-vocab-search-wrap">
          <span className="ks-vocab-search-icon" aria-hidden>🔍</span>
          <input
            type="search"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm từ..."
            className="ks-vocab-search"
            aria-label="Tìm từ"
          />
          {query && (
            <button type="button" className="ks-vocab-search-clear" aria-label="Xóa" onClick={() => setQuery("")}>×</button>
          )}
        </div>

        <div className="ks-cat-scroller">
          <button
            type="button"
            className={`ks-cat-chip ks-cat-slate${catId === "all" ? " is-active" : ""}`}
            onClick={() => setCatId("all")}
          >
            Tất cả <span className="ks-cat-count">{flat.length}</span>
          </button>
          {DATA.categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`ks-cat-chip ks-cat-${c.color}${catId === c.id ? " is-active" : ""}`}
              onClick={() => setCatId(c.id)}
            >
              <span aria-hidden>{c.icon}</span> {c.title} <span className="ks-cat-count">{c.words.length}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="ks-vocab-list-main">
        {filtered.length === 0 ? (
          <div className="ks-empty-state">
            <div className="ks-empty-icon">🔎</div>
            <h2 className="font-hand text-xl font-bold text-ink mt-3">Không tìm thấy</h2>
            <p className="text-ink/55 mt-1 text-sm">Thử từ khóa khác hoặc bỏ bộ lọc.</p>
          </div>
        ) : (
          <ul className="ks-vocab-list">
            {filtered.map((w, i) => {
              const rowKey = `${w._catId}-${i}-${w.ko}`;
              return (
                <VocabRow
                  key={rowKey}
                  word={w}
                  category={catLookup[w._catId]}
                  expanded={expandedKey === rowKey}
                  onToggle={() => setExpandedKey(expandedKey === rowKey ? null : rowKey)}
                />
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
