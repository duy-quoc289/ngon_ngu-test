"use client";

import { useEffect, useState } from "react";
import type { Topic } from "@/lib/types";
import { TopBar } from "./TopBar";
import { LessonSidebar, LessonList } from "./LessonSidebar";
import { LessonNav } from "./LessonNav";

interface Props {
  data: Topic;
  currentIdx: number;
  completed: Set<string>;
  onSelect: (idx: number) => void;
  children: React.ReactNode;
}

export function LessonShell({ data, currentIdx, completed, onSelect, children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Keyboard ←/→ chuyển bài
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "ArrowLeft" && currentIdx > 0) onSelect(currentIdx - 1);
      else if (e.key === "ArrowRight" && currentIdx < data.lessons.length - 1)
        onSelect(currentIdx + 1);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [currentIdx, data.lessons.length, onSelect]);

  const countText = `${data.lessons.length} bài học`;

  const sidebarSelect = (idx: number) => {
    onSelect(idx);
    setDrawerOpen(false);
  };

  return (
    <>
      <TopBar
        title={data.title}
        titleKo={data.titleKo}
        onToggleSidebar={() => setDrawerOpen(true)}
        progress={{ done: completed.size, total: data.lessons.length }}
      />

      <div className="max-w-6xl mx-auto flex gap-6 px-4 py-6 lg:py-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20">
            <LessonSidebar
              lessons={data.lessons}
              currentIdx={currentIdx}
              completed={completed}
              onSelect={onSelect}
              title={data.title}
              countText={countText}
            />
          </div>
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-xl p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">{data.title}</h2>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 -mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Đóng"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width={22}
                    height={22}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12M6 18l12-12" />
                  </svg>
                </button>
              </div>
              <LessonList
                lessons={data.lessons}
                currentIdx={currentIdx}
                completed={completed}
                onSelect={sidebarSelect}
              />
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="space-y-6">{children}</div>
          <LessonNav
            currentIdx={currentIdx}
            total={data.lessons.length}
            onPrev={() => onSelect(currentIdx - 1)}
            onNext={() => onSelect(currentIdx + 1)}
          />
        </main>
      </div>
    </>
  );
}
