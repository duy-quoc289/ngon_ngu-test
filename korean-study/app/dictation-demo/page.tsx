"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { fetchDictationSegment } from "@/actions/dictation-demo-fetch";
import type { DictationSegment } from "@/actions/dictation";

function normalizeKo(s: string) {
  return s.normalize("NFC").trim().toLowerCase().replace(/[?!.,~ㅋㅎ]/g, "").replace(/\s+/g, " ");
}

// Minimal type cho YouTube IFrame Player API
interface YTPlayer {
  unMute(): void;
  setVolume(v: number): void;
  playVideo(): void;
  destroy(): void;
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: object) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function DictationDemoPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [segment, setSegment] = useState<DictationSegment | null>(null);
  const [replayKey, setReplayKey] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);

  // Khởi tạo YouTube IFrame Player API mỗi khi segment/replayKey thay đổi.
  // onReady callback có quyền gọi unMute() + setVolume() trực tiếp — bypass browser autoplay restriction.
  useEffect(() => {
    if (!segment || !playerContainerRef.current) return;

    function createPlayer() {
      if (!playerContainerRef.current) return;
      // Reset container, tạo div mới để YT API thay thế thành iframe
      playerContainerRef.current.innerHTML = "";
      const div = document.createElement("div");
      playerContainerRef.current.appendChild(div);

      ytPlayerRef.current = new window.YT!.Player(div, {
        videoId: segment!.videoId,
        playerVars: {
          start: segment!.start,
          end: segment!.end,
          autoplay: 1,
          rel: 0,
          cc_load_policy: 0,
          iv_load_policy: 3,
          modestbranding: 1,
        },
        events: {
          onReady(e: { target: YTPlayer }) {
            e.target.unMute();
            e.target.setVolume(50);
            e.target.playVideo();
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      // Load script nếu chưa có
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      try { ytPlayerRef.current?.destroy(); } catch { /* ignore */ }
      ytPlayerRef.current = null;
    };
  }, [segment, replayKey]);

  async function handleFetch() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setSegment(null);
    setInput("");
    setResult(null);
    setShowAnswer(false);

    const res = await fetchDictationSegment(url);
    if ("error" in res) {
      setError(res.error);
    } else {
      setSegment(res);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    setLoading(false);
  }

  function handleCheck() {
    if (!segment || !input.trim()) return;
    const correct = normalizeKo(input) === normalizeKo(segment.text);
    setResult(correct ? "correct" : "wrong");
  }

  function handleNext() {
    handleFetch();
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
            <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            <span className="text-sm font-black tracking-tight">KRD</span>
          </Link>
          <span className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
          <h1 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chép chính tả — Demo</h1>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">thử nghiệm</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* URL input */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              YouTube URL (có Korean caption)
            </label>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
              Video phải có Korean caption (CC) trên YouTube. CC trong player sẽ tắt mặc định — đừng bật lại khi luyện.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-primary-400 dark:focus:border-primary-600 transition-colors"
              />
              <button
                onClick={handleFetch}
                disabled={loading || !url.trim()}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {loading ? "Đang lấy…" : "Lấy ngẫu nhiên"}
              </button>
            </div>
          </div>

          {/* Quick test links — 세종학당 (King Sejong Institute), beginner, Korean CC */}
          <div className="space-y-1.5">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">세종학당 초급 1 — thử nhanh:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "과 1 — 문법 (은/는)", id: "LHd2U9DWay0" },
                { label: "과 1 — 어휘", id: "oVaZ5T-1c1Y" },
                { label: "과 1 — 문법연습", id: "FodWMWpO2Ng" },
                { label: "과 2 — 아니에요", id: "45ZmkAVUdF0" },
                { label: "과 3 — 좋아합니다", id: "32bYbj8bWyQ" },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setUrl(v.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    url === v.id
                      ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Segment player */}
        {segment && (
          <div className="space-y-4">
            {/* YouTube embed — player được inject bởi YT IFrame API */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <div ref={playerContainerRef} className="absolute inset-0 w-full h-full" />
              </div>
              <div className="px-4 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {segment.start}s – {segment.end}s · {segment.end - segment.start}s
                </span>
                <button
                  onClick={() => { setReplayKey((k) => k + 1); setInput(""); setResult(null); setShowAnswer(false); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                  </svg>
                  Phát lại
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
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
                  className={`flex-1 px-3 py-2.5 text-base rounded-lg border transition-colors outline-none font-medium ${
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
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Kiểm tra
                </button>
              </div>

              {/* Result feedback */}
              {result && (
                <div className={`rounded-lg px-4 py-3 text-sm space-y-1.5 ${
                  result === "correct"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                }`}>
                  <div className="font-semibold flex items-center gap-1.5">
                    {result === "correct" ? "✓ Chính xác!" : "✗ Chưa đúng"}
                  </div>
                  {result === "wrong" && (
                    <>
                      {showAnswer ? (
                        <div>
                          Đáp án:{" "}
                          <span className="font-semibold" lang="ko">{segment.text}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAnswer(true)}
                          className="text-xs underline opacity-80 hover:opacity-100"
                        >
                          Xem đáp án
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all disabled:opacity-40"
                >
                  {loading ? "Đang lấy…" : "Đoạn tiếp theo →"}
                </button>
              </div>
            </div>

            {/* Debug info */}
            <details className="text-xs text-slate-400 dark:text-slate-600">
              <summary className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-400">Debug info</summary>
              <pre className="mt-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-x-auto whitespace-pre-wrap break-all">
                {JSON.stringify(segment, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </main>
    </div>
  );
}
