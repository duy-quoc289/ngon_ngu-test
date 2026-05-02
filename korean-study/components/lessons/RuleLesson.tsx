"use client";

import { useAudioButtonState } from "@/components/audio/AudioButton";
import type { RuleExample, RuleLesson as RuleLessonType } from "@/lib/types";
import { renderInlineMarkdown } from "../layout/Hero";
import { PlayIcons } from "./PlayIcons";

interface Props {
  lesson: RuleLessonType;
}

export function RuleLesson({ lesson }: Props) {
  return (
    <>
      {lesson.formula && (
        <div className="ks-card">
          <h3 className="ks-card-title">Công thức</h3>
          <div className="ks-rule-formula">{renderInlineMarkdown(lesson.formula)}</div>
        </div>
      )}

      {lesson.explanation && (
        <div className="ks-card ks-card-intro">
          <p>{renderInlineMarkdown(lesson.explanation)}</p>
        </div>
      )}

      {lesson.diagram && (
        <div className="ks-card">
          <h3 className="ks-card-title">Cách biến đổi</h3>
          <div className="ks-rule-transform">
            <div className="ks-rule-state">
              <div className="ks-rule-state-label">Viết</div>
              <div className="ks-rule-state-text" lang="ko">
                {lesson.diagram.before}
              </div>
            </div>
            <div className="ks-rule-arrow">→</div>
            <div className="ks-rule-state">
              <div className="ks-rule-state-label">Đọc</div>
              <div className="ks-rule-state-text ks-rule-state-after" lang="ko">
                {lesson.diagram.after || lesson.diagram.result || ""}
              </div>
            </div>
            {lesson.diagram.result && lesson.diagram.result !== lesson.diagram.after && (
              <div className="ks-rule-pron">{lesson.diagram.result}</div>
            )}
          </div>
        </div>
      )}

      {lesson.examples && lesson.examples.length > 0 && (
        <div className="ks-card">
          <h3 className="ks-card-title">Ví dụ — click để nghe</h3>
          <div className="ks-rule-examples-grid">
            {lesson.examples.map((e, i) => (
              <RuleExampleButton key={i} ex={e} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function RuleExampleButton({ ex }: { ex: RuleExample }) {
  const audioPath = ex.audio ? `/audio/${ex.audio}.mp3` : undefined;
  const { isPlaying, isLoading, onClick } = useAudioButtonState(audioPath);
  const stateClass = isPlaying ? "is-playing" : isLoading ? "is-loading" : "";

  return (
    <button
      type="button"
      className={`ks-rule-example ${stateClass}`}
      data-audio={audioPath}
      onClick={onClick}
      disabled={!audioPath}
    >
      <div className="ks-rule-example-pair">
        <span className="ks-rule-example-written" lang="ko">
          {ex.written}
        </span>
        {ex.read && (
          <>
            <span className="ks-rule-example-arrow">→</span>
            <span className="ks-rule-example-read" lang="ko">
              {ex.read}
            </span>
          </>
        )}
      </div>
      <div className="ks-rule-example-meta">
        {ex.rom && <span className="ks-rule-example-rom">{ex.rom}</span>}
        {ex.vi && <span className="ks-rule-example-vi">{ex.vi}</span>}
      </div>
      {audioPath && (
        <div className="ks-rule-example-play">
          <PlayIcons />
        </div>
      )}
    </button>
  );
}
