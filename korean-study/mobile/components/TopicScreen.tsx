"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { TopicMeta } from "@/lib/topics";
import { useProgress } from "@/lib/progress";
import { LessonViewer } from "@/components/lessons/LessonViewer";

interface Props {
  meta: TopicMeta;
}

/**
 * Màn học 1 topic, redesign kiểu Duolingo: không có sidebar/hamburger như
 * bản web — thay bằng "lesson path" (danh sách bài dạng đường đi, chạm để
 * mở) khi chưa chọn bài, và "lesson runner" full-screen (progress bar trên
 * cùng + nút Tiếp tục lớn dưới cùng) khi đang học 1 bài.
 */
export function TopicScreen({ meta }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const lessonId = params.get("l");
  const { data } = meta;
  const { completed, markCompleted, hydrated } = useProgress(data.topic);

  const currentIdx = useMemo(() => {
    if (!lessonId) return -1;
    return data.lessons.findIndex((l) => l.id === lessonId);
  }, [lessonId, data.lessons]);

  const lesson = currentIdx >= 0 ? data.lessons[currentIdx] : null;

  useEffect(() => {
    if (lesson) markCompleted(lesson.id);
  }, [lesson, markCompleted]);

  function openLesson(idx: number) {
    router.push(`?l=${data.lessons[idx].id}`, { scroll: false });
  }
  function closeRunner() {
    router.push(`/learn/${meta.slug}`, { scroll: false });
  }
  function go(delta: number) {
    const next = currentIdx + delta;
    if (next < 0) return closeRunner();
    if (next >= data.lessons.length) return closeRunner();
    openLesson(next);
  }

  if (lesson) {
    return (
      <div className="ks-app-shell">
        <header className="ks-runner-header">
          <button type="button" className="ks-runner-close" onClick={closeRunner} aria-label="Đóng bài học">×</button>
          <div className="ks-runner-progress-track">
            <div
              className="ks-runner-progress-fill"
              style={{ width: `${((currentIdx + 1) / data.lessons.length) * 100}%` }}
            />
          </div>
          <span className="ks-runner-progress-text">{currentIdx + 1}/{data.lessons.length}</span>
        </header>

        <main className="ks-runner-main">
          <p className="ks-runner-hint">{lesson.hint}</p>
          <h1 className="ks-runner-title font-hand">{meta.icon} {lesson.title}</h1>
          <div className="ks-runner-content">
            <LessonViewer lesson={lesson} />
          </div>
        </main>

        <footer className="ks-runner-footer">
          <button type="button" className="ks-runner-btn is-ghost" onClick={() => go(-1)}>
            ← Quay lại
          </button>
          <button type="button" className="ks-runner-btn is-primary" onClick={() => go(1)}>
            {currentIdx + 1 >= data.lessons.length ? "Hoàn thành" : "Tiếp tục →"}
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="ks-app-shell">
      <header className="ks-path-header">
        <Link href="/learn" className="ks-runner-close" aria-label="Về danh sách chủ đề">←</Link>
        <div>
          <h1 className="ks-path-title font-hand">{meta.icon} {data.title}</h1>
          <p className="ks-path-subtitle">{data.lessons.length} bài · {hydrated ? completed.size : 0} đã học</p>
        </div>
      </header>

      <main className="ks-path-main">
        <ol className="ks-path-list">
          {data.lessons.map((l, i) => {
            const done = completed.has(l.id);
            return (
              <li key={l.id} className="ks-path-item">
                <button type="button" className={`ks-path-node${done ? " is-done" : ""}`} onClick={() => openLesson(i)}>
                  {done ? "✓" : i + 1}
                </button>
                <button type="button" className="ks-path-label" onClick={() => openLesson(i)}>
                  <span className="ks-path-label-title">{l.title}</span>
                  {l.hint && <span className="ks-path-label-hint">{l.hint}</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
