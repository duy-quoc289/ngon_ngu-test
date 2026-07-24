"use client";

import { useEffect, useRef, useState } from "react";
import { getRandomSegment, type DictationSegment } from "@/lib/dictation";
import { useAudio } from "@/components/audio/AudioProvider";

function normalizeKo(s: string) {
  return s.normalize("NFC").trim().toLowerCase().replace(/[?!.,~]/g, "").replace(/\s+/g, " ");
}

const LEVELS = [
  { value: 1, label: "Sơ cấp", labelKo: "초급" },
  { value: 2, label: "Trung cấp", labelKo: "중급" },
] as const;
type Level = (typeof LEVELS)[number]["value"];

export default function DictationPage() {
  const [level, setLevel] = useState<Level>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [segment, setSegment] = useState<DictationSegment | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { play, current } = useAudio();

  const isPlaying = !!segment && current?.btnId === segment.text;

  useEffect(() => {
    if (!segment) return;
    const t = setTimeout(() => play(segment.text, segment.text), 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment]);

  async function fetchNext() {
    setLoading(true);
    setError("");
    setInput("");
    setResult(null);
    setShowAnswer(false);
    setSegment(null);

    const res = await getRandomSegment(level);
    if ("error" in res) setError(res.error);
    else {
      setSegment(res);
      setTimeout(() => inputRef.current?.focus(), 500);
    }
    setLoading(false);
  }

  function handleCheck() {
    if (!segment || !input.trim()) return;
    setResult(normalizeKo(input) === normalizeKo(segment.text) ? "correct" : "wrong");
  }

  return (
    <div className="ks-app-shell">
      <header className="ks-path-header">
        <div>
          <h1 className="ks-path-title font-hand">Chép chính tả</h1>
          <p className="ks-path-subtitle">받아쓰기 — nghe rồi gõ lại</p>
        </div>
      </header>

      <main className="ks-dict-main">
        <div className="ks-cat-scroller ks-dict-levels">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              type="button"
              className={`ks-cat-chip ks-cat-blue${level === l.value ? " is-active" : ""}`}
              onClick={() => { setLevel(l.value); setSegment(null); setError(""); setInput(""); setResult(null); }}
            >
              {l.label} <span lang="ko">{l.labelKo}</span>
            </button>
          ))}
        </div>

        {error && <div className="ks-dict-error">{error}</div>}

        {!segment && !loading && !error && (
          <div className="ks-surface ks-dict-empty">
            <span className="ks-dict-empty-icon" aria-hidden>🎧</span>
            <p className="font-hand font-semibold text-ink">Luyện nghe chép chính tả</p>
            <p className="text-sm text-ink/55 mt-1">Nghe câu tiếng Hàn → gõ lại → kiểm tra.</p>
            <button type="button" className="ks-runner-btn is-primary ks-dict-start" onClick={fetchNext}>
              ▶ Bắt đầu
            </button>
          </div>
        )}

        {loading && (
          <div className="ks-surface ks-dict-empty">
            <span className="ks-dict-spinner" aria-hidden />
          </div>
        )}

        {segment && !loading && (
          <div className="ks-dict-exercise">
            <div className="ks-surface ks-dict-play-card">
              <p className="ks-dict-play-label">Nghe và gõ lại</p>
              <button
                type="button"
                className={`ks-dict-play${isPlaying ? " is-playing" : ""}`}
                onClick={() => play(segment.text, segment.text)}
                aria-label="Phát âm"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <p className="ks-dict-play-hint">{isPlaying ? "Đang phát…" : "Chạm để phát lại"}</p>
            </div>

            <div className="ks-surface ks-dict-input-card">
              <label className="ks-field-label" htmlFor="dict-input">Gõ lại những gì bạn nghe được</label>
              <input
                id="dict-input"
                ref={inputRef}
                type="text"
                lang="ko"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={input}
                onChange={(e) => { setInput(e.target.value); setResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="한국어로 입력하세요..."
                className={`ks-dict-input${result ? ` is-${result}` : ""}`}
              />
              <button type="button" className="ks-runner-btn is-primary" onClick={handleCheck} disabled={!input.trim()}>
                Kiểm tra
              </button>

              {result && (
                <div className={`ks-dict-feedback is-${result}`}>
                  <p className="font-hand font-semibold">{result === "correct" ? "✓ Chính xác!" : "✕ Chưa đúng"}</p>
                  {result === "wrong" && (
                    showAnswer
                      ? <p>Đáp án: <strong lang="ko">{segment.text}</strong></p>
                      : <button type="button" className="ks-dict-show-answer" onClick={() => setShowAnswer(true)}>Xem đáp án</button>
                  )}
                </div>
              )}

              <button type="button" className="ks-runner-btn is-ghost" onClick={fetchNext} disabled={loading}>
                Bài tiếp theo →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
