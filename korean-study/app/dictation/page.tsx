"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { getRandomSegment, type DictationSegment } from "@/actions/dictation";
import { useAudio } from "@/components/audio/AudioProvider";

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
          >
            <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-sm font-black tracking-tight">KRD</span>
          </Link>
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
          <h1 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chép chính tả</h1>
          <span className="text-xs text-slate-400 dark:text-slate-500" lang="ko">받아쓰기</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Level selector */}
        <div className="flex gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => { setLevel(l.value); setSegment(null); setError(""); setInput(""); setResult(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                level === l.value
                  ? "bg-primary-600 text-white shadow-sm"
                  : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              {l.label}
              <span className="text-xs opacity-70" lang="ko">{l.labelKo}</span>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!segment && !loading && !error && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4">
            <div className="text-4xl">🎧</div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Luyện nghe chép chính tả</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Nghe câu Korean → gõ lại Hangul → kiểm tra đáp án.
              </p>
            </div>
            <button
              onClick={fetchNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors shadow-md shadow-primary-500/20"
            >
              <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              Bắt đầu
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 animate-pulse space-y-4">
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
        )}

        {/* Audio player + exercise */}
        {segment && !loading && (
          <div className="space-y-4">
            {/* Audio player card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center gap-5">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Nghe và gõ lại
              </p>

              {/* Big play button */}
              <button
                onClick={() => play(segment.text, segment.text)}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isPlaying
                    ? "bg-primary-600 text-white shadow-primary-500/30 scale-95"
                    : "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:scale-105"
                }`}
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

              <p className="text-xs text-slate-400 dark:text-slate-500">
                {isPlaying ? "Đang phát…" : "Nhấn để phát · Space để phát lại"}
              </p>
            </div>

            {/* Input card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Gõ lại những gì bạn nghe được
              </label>
              <div className="flex gap-2">
                <input
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
                  className={`flex-1 px-3 py-2.5 text-base rounded-xl border transition-colors outline-none font-medium ${
                    result === "correct"
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                      : result === "wrong"
                      ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:border-primary-400 dark:focus:border-primary-600"
                  }`}
                />
                <button
                  onClick={handleCheck}
                  disabled={!input.trim()}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Kiểm tra
                </button>
              </div>

              {/* Feedback */}
              {result && (
                <div className={`rounded-xl px-4 py-3 text-sm space-y-1.5 ${
                  result === "correct"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                }`}>
                  <p className="font-semibold">{result === "correct" ? "✓ Chính xác!" : "✗ Chưa đúng"}</p>
                  {result === "wrong" && (
                    showAnswer
                      ? <p>Đáp án: <strong lang="ko">{segment.text}</strong></p>
                      : <button onClick={() => setShowAnswer(true)} className="text-xs underline opacity-80 hover:opacity-100">Xem đáp án</button>
                  )}
                </div>
              )}

              {/* Next */}
              <button
                onClick={fetchNext}
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all disabled:opacity-40"
              >
                {loading ? "Đang lấy…" : "Bài tiếp theo →"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
