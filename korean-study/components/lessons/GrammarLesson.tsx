"use client";

import { Fragment, useState } from "react";
import type { GrammarLesson as GrammarLessonType, GrammarExample, GrammarExercise } from "@/lib/types";
import { AudioButton } from "@/components/audio/AudioButton";
import { renderInlineMarkdown } from "@/components/layout/Hero";

interface Props {
  lesson: GrammarLessonType;
}

/** Highlight một đoạn text trong câu Korean bằng <mark>. */
function HighlightedKo({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) {
    return <span lang="ko">{text}</span>;
  }
  const parts = text.split(highlight);
  return (
    <span lang="ko">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <mark className="ks-grammar-mark">{highlight}</mark>
          )}
        </Fragment>
      ))}
    </span>
  );
}

function ExampleRow({ ex }: { ex: GrammarExample }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <AudioButton
        text={ex.ko}
        label={ex.ko}
        className="shrink-0 mt-0.5"
      />
      <div className="min-w-0">
        <div className="text-base font-medium leading-snug">
          <HighlightedKo text={ex.ko} highlight={ex.highlight} />
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{ex.rom}</div>
        <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{ex.vi}</div>
      </div>
    </div>
  );
}

interface ExerciseCardProps {
  ex: GrammarExercise;
  idx: number;
}

function ExerciseCard({ ex, idx }: ExerciseCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const correctAnswers = Array.isArray(ex.answer) ? ex.answer : [ex.answer];

  function check(value: string) {
    setUserAnswer(value);
    setSubmitted(true);
  }

  const isCorrect =
    submitted &&
    correctAnswers.some(
      (a) => a.trim().toLowerCase() === userAnswer.trim().toLowerCase(),
    );

  function reset() {
    setUserAnswer("");
    setSubmitted(false);
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        Câu {idx + 1}
      </p>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {ex.question}
      </p>

      {ex.type === "choice" && ex.options ? (
        <div className="grid grid-cols-2 gap-2">
          {ex.options.map((opt) => {
            const isSelected = submitted && userAnswer === opt;
            const isThisCorrect = correctAnswers.includes(opt);
            let cls =
              "px-3 py-2 rounded-lg text-sm font-medium border transition-all text-center cursor-pointer ";
            if (!submitted) {
              cls +=
                "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20";
            } else if (isThisCorrect) {
              cls +=
                "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-300 dark:ring-emerald-700";
            } else if (isSelected && !isThisCorrect) {
              cls +=
                "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300";
            } else {
              cls +=
                "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-600 opacity-60";
            }
            return (
              <button
                key={opt}
                type="button"
                disabled={submitted}
                className={cls}
                lang="ko"
                onClick={() => check(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            lang="ko"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={submitted}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && userAnswer.trim()) check(userAnswer);
            }}
            placeholder="Nhập đáp án..."
            className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors outline-none ${
              submitted
                ? isCorrect
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  : "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:border-primary-400 dark:focus:border-primary-600"
            }`}
          />
          {!submitted ? (
            <button
              type="button"
              disabled={!userAnswer.trim()}
              onClick={() => check(userAnswer)}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
            >
              Thử lại
            </button>
          )}
        </div>
      )}

      {/* Feedback */}
      {submitted && (
        <div
          className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 ${
            isCorrect
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}
        >
          <span className="text-base leading-none mt-0.5">{isCorrect ? "✓" : "✗"}</span>
          <div>
            {isCorrect ? (
              <span>Chính xác!</span>
            ) : (
              <span>
                Đáp án đúng:{" "}
                <strong lang="ko">{correctAnswers.join(" / ")}</strong>
              </span>
            )}
            {ex.hint && !isCorrect && (
              <p className="mt-1 text-xs opacity-80">{ex.hint}</p>
            )}
            {ex.type === "choice" && isCorrect && (
              <button
                type="button"
                onClick={reset}
                className="mt-1 text-xs underline opacity-70 hover:opacity-100"
              >
                Thử lại
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function GrammarLesson({ lesson }: Props) {
  return (
    <div className="space-y-5">
      {/* Formula + meaning */}
      <div className="ks-card ks-card-intro">
        <div className="text-lg font-semibold leading-relaxed text-slate-800 dark:text-slate-100" lang="ko">
          {renderInlineMarkdown(lesson.formula)}
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {lesson.meaning}
        </p>
      </div>

      {/* Rules */}
      {lesson.rules.length > 0 && (
        <div className="ks-card">
          <h3 className="ks-card-title">Cách dùng</h3>
          <div className="ks-rule-list">
            {lesson.rules.map((r, i) => (
              <div key={i} className="ks-rule">
                <div className="ks-rule-label">{r.label}</div>
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
      )}

      {/* Conjugation table */}
      {lesson.conjugation && (
        <div className="ks-card">
          <h3 className="ks-card-title">Bảng chia</h3>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {lesson.conjugation.headers.map((h, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lesson.conjugation.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap" lang="ko">
                      {row.verb}
                    </td>
                    {row.forms.map((form, j) => (
                      <td key={j} className="px-3 py-2.5 text-primary-700 dark:text-primary-300 font-medium" lang="ko">
                        {form}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Examples */}
      <div className="ks-card">
        <h3 className="ks-card-title">Ví dụ</h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 -mt-1">
          {lesson.examples.map((ex, i) => (
            <ExampleRow key={i} ex={ex} />
          ))}
        </div>
      </div>

      {/* Exercises */}
      {lesson.exercise && lesson.exercise.length > 0 && (
        <div className="ks-card">
          <h3 className="ks-card-title">Luyện tập</h3>
          <div className="space-y-3 mt-1">
            {lesson.exercise.map((ex, idx) => (
              <ExerciseCard key={idx} ex={ex} idx={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
