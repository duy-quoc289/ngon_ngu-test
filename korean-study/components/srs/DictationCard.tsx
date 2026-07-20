"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/components/audio/AudioProvider";
import { AudioButton } from "@/components/audio/AudioButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { VocabWord } from "@/lib/types";

interface Props {
  word: VocabWord;
  onResult: (correct: boolean) => void;
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/-/g, "").replace(/\s+/g, "");
}

/** Chính tả: tự động phát audio → user gõ tiếng Hàn hoặc phiên âm La-tinh → auto-check. */
export function DictationCard({ word, onResult }: Props) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { play } = useAudio();
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPlayed = useRef(false);

  // Autoplay khi card mount
  useEffect(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    setTimeout(() => play(word.ko, word.ko), 250);
    setTimeout(() => inputRef.current?.focus(), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit() {
    if (submitted || !input.trim()) return;
    const ans = normalize(input);
    const correct =
      ans === normalize(word.ko) ||
      (word.rom ? ans === normalize(word.rom) : false);
    setIsCorrect(correct);
    setSubmitted(true);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Audio card */}
      <div className="ks-surface p-8 text-center mb-4">
        <p className="text-xs font-semibold text-ink/45 uppercase tracking-widest mb-5">
          Nghe và gõ lại
        </p>
        <div className="flex justify-center mb-3">
          <AudioButton text={word.ko} label="Phát lại" />
        </div>
        <p className="text-xs text-ink/45">
          Gõ tiếng Hàn <span className="opacity-50">hoặc romanization</span>
        </p>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <Input
          ref={inputRef}
          type="text"
          variant={submitted ? (isCorrect ? "success" : "error") : "default"}
          value={input}
          onChange={(e) => { if (!submitted) setInput(e.target.value); }}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="안녕하세요 · hoặc an-nyeong-ha-se-yo"
          className="text-center"
          disabled={submitted}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        {submitted ? (
          <div
            className={`rounded-xl p-4 text-center border-2 ${
              isCorrect
                ? "bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800"
                : "bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800"
            }`}
          >
            <p className="font-hand font-semibold text-ink mb-1">
              {isCorrect ? "✅ Đúng rồi!" : "❌ Sai rồi"}
            </p>
            {!isCorrect && (
              <p className="text-sm text-ink/70 mb-1">
                Đáp án:{" "}
                <span className="font-bold text-ink">{word.ko}</span>{" "}
                <span className="text-ink/50">({word.rom})</span>
              </p>
            )}
            <Button variant="primary" size="sm" onClick={() => onResult(isCorrect)} className="mt-3">
              Tiếp theo →
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={submit}
            disabled={!input.trim()}
            className="w-full"
          >
            Kiểm tra <span className="opacity-60 text-sm">(Enter)</span>
          </Button>
        )}
      </div>
    </div>
  );
}
