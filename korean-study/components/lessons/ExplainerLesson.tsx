import type { ExplainerLesson as ExplainerLessonType } from "@/lib/types";
import { renderInlineMarkdown } from "../layout/Hero";

interface Props {
  lesson: ExplainerLessonType;
}

export function ExplainerLesson({ lesson }: Props) {
  return (
    <>
      {lesson.blocks.map((b, i) => {
        switch (b.kind) {
          case "intro":
            return (
              <div key={i} className="ks-card ks-card-intro">
                <p>{renderInlineMarkdown(b.text)}</p>
              </div>
            );
          case "diagram":
            return (
              <div key={i} className="ks-card">
                <h3 className="ks-card-title">{b.title}</h3>
                {b.examples.map((ex, j) => (
                  <div key={j} className="ks-diagram-row">
                    <div className="ks-diagram-parts">
                      {ex.parts.map((p, k) => (
                        <span key={k}>
                          <span className="ks-diagram-part" lang="ko">
                            {p}
                          </span>
                          {k < ex.parts.length - 1 && (
                            <span className="ks-diagram-plus">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                    <span className="ks-diagram-arrow">→</span>
                    <div className="ks-diagram-result">
                      <div lang="ko">{ex.result}</div>
                      {ex.romanization && (
                        <div className="ks-diagram-rom">{ex.romanization}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          case "rules":
            return (
              <div key={i} className="ks-card">
                <h3 className="ks-card-title">{b.title}</h3>
                <div className="ks-rule-list">
                  {b.items.map((r, j) => (
                    <div key={j} className="ks-rule">
                      <div className="ks-rule-label">{r.label}</div>
                      {r.chars && r.chars.length > 0 && (
                        <div className="ks-rule-chars">
                          {r.chars.map((c, k) => (
                            <span key={k} className="ks-chip" lang="ko">
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="ks-rule-rule">{renderInlineMarkdown(r.rule)}</div>
                      {r.examples && r.examples.length > 0 && (
                        <div className="ks-rule-examples">
                          Ví dụ:{" "}
                          {r.examples.map((e, k) => (
                            <span key={k} className="ks-chip ks-chip-syl" lang="ko">
                              {e}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
        }
      })}
    </>
  );
}
