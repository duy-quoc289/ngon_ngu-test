"use client";

import { useAudio } from "./AudioProvider";

interface Props {
  text: string; // Korean text to speak
  label: string;
  className?: string;
}

export function AudioButton({ text, label, className }: Props) {
  const { current, play } = useAudio();
  const isCurrent = current?.btnId === text;
  const stateClass = isCurrent
    ? current.state === "playing" ? "is-playing" : "is-loading"
    : "";

  return (
    <button
      type="button"
      className={`ks-play ${stateClass} ${className ?? ""}`}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        play(text, text);
      }}
    >
      <svg viewBox="0 0 24 24" className="ks-icon ks-icon-play" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
      <svg viewBox="0 0 24 24" className="ks-icon ks-icon-pause" fill="currentColor">
        <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
      </svg>
      <svg viewBox="0 0 24 24" className="ks-icon ks-icon-loading" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="9" strokeDasharray="40" strokeLinecap="round" />
      </svg>
    </button>
  );
}

export function useAudioButtonState(text: string | undefined) {
  const { current, play } = useAudio();
  const isCurrent = !!text && current?.btnId === text;
  return {
    isPlaying: isCurrent && current?.state === "playing",
    isLoading: isCurrent && current?.state === "loading",
    onClick: () => text && play(text, text),
  };
}
