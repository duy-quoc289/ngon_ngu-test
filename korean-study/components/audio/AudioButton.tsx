"use client";

import { useAudio } from "./AudioProvider";

interface Props {
  src: string; // path tới mp3 (vd: "/audio/hh_1.mp3")
  label: string;
  className?: string;
}

/** Round play/pause button — variant `.ks-play` từ legacy. */
export function AudioButton({ src, label, className }: Props) {
  const { current, play } = useAudio();
  const isCurrent = current?.btnId === src;
  const stateClass = isCurrent
    ? current.state === "playing"
      ? "is-playing"
      : "is-loading"
    : "";

  return (
    <button
      type="button"
      className={`ks-play ${stateClass} ${className ?? ""}`}
      data-audio={src}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        play(src, src);
      }}
    >
      <svg viewBox="0 0 24 24" className="ks-icon ks-icon-play" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
      <svg viewBox="0 0 24 24" className="ks-icon ks-icon-pause" fill="currentColor">
        <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="ks-icon ks-icon-loading"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="12" cy="12" r="9" strokeDasharray="40" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/**
 * Hook xác định state cho component button-like (như tile, card, vocab item)
 * vốn dùng cùng `[data-audio]` để bật audio.
 */
export function useAudioButtonState(audioSrc: string | undefined) {
  const { current, play } = useAudio();
  const isCurrent = !!audioSrc && current?.btnId === audioSrc;
  return {
    isPlaying: isCurrent && current?.state === "playing",
    isLoading: isCurrent && current?.state === "loading",
    onClick: () => audioSrc && play(audioSrc, audioSrc),
  };
}
