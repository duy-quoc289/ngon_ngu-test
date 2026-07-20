"use client";

import { Tick } from "duma-icons-react";
import type { Lesson } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getLessonIcon } from "@/lib/lesson-icons";

interface ListProps {
  topic: string;
  lessons: Lesson[];
  currentIdx: number;
  completed: Set<string>;
  onSelect: (idx: number) => void;
}

/** List of lesson links — không có khung card, không có title. Reuse được trong drawer. */
export function LessonList({ topic, lessons, currentIdx, completed, onSelect }: ListProps) {
  return (
    <ul className="space-y-0.5">
      {lessons.map((l, i) => {
        const isActive = i === currentIdx;
        const isDone = completed.has(l.id);
        const icon = getLessonIcon(topic, l.id, 14) ?? l.icon;
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
                <span className="ks-side-icon ks-side-icon-done"><Tick size={13} /></span>
              ) : (
                <span className="ks-side-icon">{i + 1}</span>
              )}
              <span className="ks-side-text">
                {icon && (
                  <span className="ks-side-emoji" lang={typeof icon === "string" ? "ko" : undefined}>
                    {icon}
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
  topic,
  lessons,
  currentIdx,
  completed,
  onSelect,
  title,
  countText,
}: SidebarProps) {
  return (
    <div className="ks-surface overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b-2 border-dashed border-ink/15">
        <h2 className="font-hand font-bold text-base text-ink mb-1">{title}</h2>
        <ProgressBar
          value={completed.size}
          max={lessons.length}
          showPercent
          size="sm"
          className="mt-2"
        />
        <p className="text-xs text-ink/50 mt-1.5">{countText}</p>
      </div>
      {/* List */}
      <div className="p-2">
        <LessonList
          topic={topic}
          lessons={lessons}
          currentIdx={currentIdx}
          completed={completed}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

