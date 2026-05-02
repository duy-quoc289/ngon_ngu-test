"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Topic } from "@/lib/types";
import { LessonShell } from "@/components/layout/LessonShell";
import { Hero } from "@/components/layout/Hero";
import { LessonViewer } from "./LessonViewer";
import { useProgress } from "@/lib/progress";

interface Props {
  data: Topic;
}

/** Wrapper page chung cho các topic — quản lý lesson selection + progress. */
export function TopicPage({ data }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const lessonIdParam = params.get("l");
  const { completed, markCompleted } = useProgress(data.topic);

  const currentIdx = useMemo(() => {
    if (!lessonIdParam) return 0;
    const i = data.lessons.findIndex((l) => l.id === lessonIdParam);
    return i >= 0 ? i : 0;
  }, [lessonIdParam, data.lessons]);

  const lesson = data.lessons[currentIdx];

  // Mark lesson as visited (counts as "done") khi đổi
  useEffect(() => {
    markCompleted(lesson.id);
  }, [lesson.id, markCompleted]);

  // Scroll to top khi đổi lesson
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIdx]);

  const select = (idx: number) => {
    if (idx < 0 || idx >= data.lessons.length) return;
    const id = data.lessons[idx].id;
    router.replace(`?l=${id}`, { scroll: false });
  };

  return (
    <LessonShell
      data={data}
      currentIdx={currentIdx}
      completed={completed}
      onSelect={select}
    >
      <Hero
        icon={lesson.icon}
        step={`Bài ${currentIdx + 1} / ${data.lessons.length}`}
        title={lesson.title}
        hint={lesson.hint}
      />
      <LessonViewer lesson={lesson} />
    </LessonShell>
  );
}
