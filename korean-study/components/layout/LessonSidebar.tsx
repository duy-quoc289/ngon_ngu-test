"use client";

import type { Lesson } from "@/lib/types";

interface ListProps {
  lessons: Lesson[];
  currentIdx: number;
  completed: Set<string>;
  onSelect: (idx: number) => void;
}

/** List of lesson links — không có khung card, không có title. Reuse được trong drawer. */
export function LessonList({ lessons, currentIdx, completed, onSelect }: ListProps) {
  return (
    <ul className="space-y-1">
      {lessons.map((l, i) => {
        const isActive = i === currentIdx;
        const isDone = completed.has(l.id);
        return (
          <li key={l.id}>
            <a
              href={`?l=${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelect(i);
              }}
              className={`ks-side-item ${isActive ? "is-active" : ""} ${
                isDone ? "is-done" : ""
              }`}
            >
              {isDone ? (
                <span className="ks-side-icon ks-side-icon-done">✓</span>
              ) : (
                <span className="ks-side-icon">{i + 1}</span>
              )}
              <span className="ks-side-text">
                {l.icon && (
                  <span className="ks-side-emoji" lang="ko">
                    {l.icon}
                  </span>
                )}
                <span>{l.title}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

interface SidebarProps extends ListProps {
  title: string;
  countText: string;
}

/** Desktop sidebar — card-styled với title + count + list. */
export function LessonSidebar({
  lessons,
  currentIdx,
  completed,
  onSelect,
  title,
  countText,
}: SidebarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <h2 className="font-bold text-lg mb-1">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{countText}</p>
      <LessonList
        lessons={lessons}
        currentIdx={currentIdx}
        completed={completed}
        onSelect={onSelect}
      />
    </div>
  );
}
