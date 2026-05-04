"use client";

import type { Lesson } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ListProps {
  lessons: Lesson[];
  currentIdx: number;
  completed: Set<string>;
  onSelect: (idx: number) => void;
}

/** List of lesson links — không có khung card, không có title. Reuse được trong drawer. */
export function LessonList({ lessons, currentIdx, completed, onSelect }: ListProps) {
  return (
    <ul className="space-y-0.5">
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

/** Desktop sidebar — card-styled với title + count + progress + list. */
export function LessonSidebar({
  lessons,
  currentIdx,
  completed,
  onSelect,
  title,
  countText,
}: SidebarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-1">{title}</h2>
        <ProgressBar
          value={completed.size}
          max={lessons.length}
          showPercent
          size="sm"
          className="mt-2"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{countText}</p>
      </div>
      {/* List */}
      <div className="p-2">
        <LessonList
          lessons={lessons}
          currentIdx={currentIdx}
          completed={completed}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

