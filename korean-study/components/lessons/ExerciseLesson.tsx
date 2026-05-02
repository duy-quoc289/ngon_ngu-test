"use client";

import { useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import type { ExerciseLesson as ExerciseLessonType } from "@/lib/types";

interface Props {
  lesson: ExerciseLessonType;
}

export function ExerciseLesson({ lesson }: Props) {
  const [allOpen, setAllOpen] = useState(false);

  return (
    <div className="ks-card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="ks-card-title m-0">Đọc thử</h3>
        <button
          type="button"
          className="ks-btn-ghost text-sm"
          onClick={() => setAllOpen((v) => !v)}
        >
          {allOpen ? "Ẩn tất cả đáp án" : "Hiện tất cả đáp án"}
        </button>
      </div>
      <div className="ks-ex-list">
        {lesson.items.map((item, i) => (
          <div key={i} className="ks-ex-item">
            <div className="ks-ex-num">{i + 1}</div>
            <div className="ks-ex-word" lang="ko">
              {item.ko}
            </div>
            <details className="ks-ex-answer" open={allOpen}>
              <summary>Hiện đáp án</summary>
              {item.rom && <div className="ks-ex-rom">{item.rom}</div>}
              {item.vi && <div className="ks-ex-vi">{item.vi}</div>}
            </details>
            {item.audio && (
              <AudioButton
                src={`/audio/${item.audio}.mp3`}
                label={`Nghe ${item.ko}`}
                className="ks-ex-audio"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
