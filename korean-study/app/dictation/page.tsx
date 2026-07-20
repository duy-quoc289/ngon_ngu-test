"use client";

import { useState, useRef, useEffect } from "react";
import { getRandomSegment, type DictationSegment } from "@/actions/dictation";
import { useAudio } from "@/components/audio/AudioProvider";
import { TopBar } from "@/components/layout/TopBar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

function normalizeKo(s: string) {
  return s.normalize("NFC").trim().toLowerCase().replace(/[?!.,~]/g, "").replace(/\s+/g, " ");
}

const LEVELS = [
  { value: 1, label: "Sơ cấp",    labelKo: "초급" },
  { value: 2, label: "Trung cấp", labelKo: "중급" },
] as const;
type Level = typeof LEVELS[number]["value"];

export default function DictationPage() {
  const [level, setLevel]           = useState<Level>(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [segment, setSegment]       = useState<DictationSegment | null>(null);
  const [input, setInput]           = useState("");
  const [result, setResult]         = useState<"correct" | "wrong" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const { play, current }           = useAudio();

  const isPlaying = !!segment && current?.btnId === segment.text;

  // Auto-play khi segment mới load
  useEffect(() => {
    if (!segment) return;
    const t = setTimeout(() => play(segment.text, segment.text), 200);
    return () => clearTimeout(t);
  }, [segment]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchNext() {
    setLoading(true);
    setError("");
    setInput("");
    setResult(null);
    setShowAnswer(false);
    setSegment(null);

    const res = await getRandomSegment(level);
    if ("error" in res) {
      setError(res.error);
    } else {
      setSegment(res);
      setTimeout(() => inputRef.current?.focus(), 600);
    }
    setLoading(false);
  }

  function handleCheck() {
    if (!segment || !input.trim()) return;
    setResult(normalizeKo(input) === normalizeKo(segment.text) ? "correct" : "wrong");
  }

  return (
    <>
      <TopBar title="Chép chính tả" titleKo="받아쓰기" />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Level selector */}
        <div className="flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => { setLevel(l.value); setSegment(null); setError(""); setInput(""); setResult(null); }}
              className={`ks-cat-chip ks-cat-blue ${level === l.value ? "is-active" : ""}`}
            >
              {l.label}
              <span className="text-xs opacity-70" lang="ko">{l.labelKo}</span>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-error-50 dark:bg-error-900/20 border-2 border-error-200 dark:border-error-800 text-error-700 dark:text-error-300 text-sm">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!segment && !loading && !error && (
          <div className="ks-surface p-10 text-center space-y-4">
            <div className="text-4xl">🎧</div>
            <div>
              <p className="font-hand font-semibold text-ink">Luyện nghe chép chính tả</p>
              <p className="text-sm text-ink/55 mt-1">
                Nghe câu Korean → gõ lại Hangul → kiểm tra đáp án.
              </p>
            </div>
            <Button variant="primary" onClick={fetchNext} icon={
              <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            }>
              Bắt đầu
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="ks-surface p-8 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}

        {/* Audio player + exercise */}
        {segment && !loading && (
          <div className="space-y-4">
            {/* Audio player card */}
            <div className="ks-surface p-8 flex flex-col items-center gap-5">
              <p className="text-xs font-semibold text-ink/45 uppercase tracking-widest">
                Nghe và gõ lại
              </p>

              {/* Big play button */}
              <button
                onClick={() => play(segment.text, segment.text)}
                className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-ink transition-all ${
                  isPlaying
                    ? "bg-primary-500 text-white scale-95"
                    : "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:scale-105"
                }`}
                style={{ boxShadow: "3px 3px 0 rgb(35 34 34 / 0.15)" }}
                aria-label="Phát âm"
              >
                {isPlaying ? (
                  /* Wave animation khi đang phát */
                  <span className="flex items-end gap-0.5 h-7">
                    {[1,2,3,4,3].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-current rounded-full animate-bounce"
                        style={{ height: `${h * 5}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </span>
                ) : (
                  <svg viewBox="0 0 24 24" width={32} height={32} fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <p className="text-xs text-ink/45">
                {isPlaying ? "Đang phát…" : "Nhấn để phát · Space để phát lại"}
              </p>
            </div>

            {/* Input card */}
            <div className="ks-surface p-5 space-y-3">
              <label className="ks-field-label text-sm block text-ink">
                Gõ lại những gì bạn nghe được
              </label>
              <div className="flex gap-2">
                <Input
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
                  variant={result === "correct" ? "success" : result === "wrong" ? "error" : "default"}
                  className="text-center"
                />
                <Button variant="primary" onClick={handleCheck} disabled={!input.trim()}>
                  Kiểm tra
                </Button>
              </div>

              {/* Feedback */}
              {result && (
                <div className={`rounded-xl px-4 py-3 text-sm space-y-1.5 border-2 ${
                  result === "correct"
                    ? "bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-700 dark:text-success-300"
                    : "bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800 text-error-700 dark:text-error-300"
                }`}>
                  <p className="font-hand font-semibold">{result === "correct" ? "✓ Chính xác!" : "✗ Chưa đúng"}</p>
                  {result === "wrong" && (
                    showAnswer
                      ? <p>Đáp án: <strong lang="ko">{segment.text}</strong></p>
                      : <button onClick={() => setShowAnswer(true)} className="text-xs underline opacity-80 hover:opacity-100">Xem đáp án</button>
                  )}
                </div>
              )}

              {/* Next */}
              <div className="flex justify-center pt-1">
                <Button variant="outline" onClick={fetchNext} disabled={loading}>
                  {loading ? "Đang lấy…" : "Bài tiếp theo →"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
