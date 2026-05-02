"use client";

import { useAudioButtonState } from "@/components/audio/AudioButton";
import type {
  ComparisonItem,
  ComparisonLesson as ComparisonLessonType,
} from "@/lib/types";

interface Props {
  lesson: ComparisonLessonType;
}

export function ComparisonLesson({ lesson }: Props) {
  return (
    <div className="ks-cmp-grid">
      {lesson.groups.map((g, i) => (
        <div key={i} className={`ks-cmp-group ks-cmp-${g.color}`}>
          <div className="ks-cmp-name">{g.name}</div>
          <div className="ks-cmp-desc">{g.description}</div>
          <div className="ks-cmp-items">
            {g.items.map((it, j) => (
              <CmpItem key={j} item={it} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CmpItem({ item }: { item: ComparisonItem }) {
  const audioPath = item.audio ? `/audio/${item.audio}.mp3` : undefined;
  const { isPlaying, isLoading, onClick } = useAudioButtonState(audioPath);
  const stateClass = isPlaying ? "is-playing" : isLoading ? "is-loading" : "";

  return (
    <button
      type="button"
      className={`ks-cmp-item ${stateClass}`}
      data-audio={audioPath}
      onClick={onClick}
      disabled={!audioPath}
    >
      <span className="ks-cmp-char" lang="ko">
        {item.char}
      </span>
      {item.syllable && (
        <span className="ks-cmp-syl" lang="ko">
          {item.syllable}
        </span>
      )}
    </button>
  );
}
