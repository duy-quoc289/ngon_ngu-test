"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AudioState = "loading" | "playing";

interface CurrentAudio {
  btnId: string;
  state: AudioState;
}

interface AudioCtx {
  current: CurrentAudio | null;
  play: (src: string, btnId: string) => void;
  stop: () => void;
  volume: number;
  setVolume: (v: number) => void;
  rate: number;
  setRate: (r: number) => void;
}

const Ctx = createContext<AudioCtx | null>(null);

const SETTINGS_KEY = "ks-audio-settings";
const DEFAULT_VOLUME = 0.7;
const DEFAULT_RATE = 1.0;

interface PersistedSettings {
  volume?: number;
  rate?: number;
}

function loadSettings(): PersistedSettings {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveSettings(s: PersistedSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    // ignore quota error
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<CurrentAudio | null>(null);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [rate, setRateState] = useState(DEFAULT_RATE);

  // Init audio element + load settings (chỉ ở client).
  // setState trong effect là pattern chuẩn để hydrate từ localStorage.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) audioRef.current = new Audio();
    const s = loadSettings();
    /* eslint-disable react-hooks/set-state-in-effect */
    if (typeof s.volume === "number") setVolumeState(s.volume);
    if (typeof s.rate === "number") setRateState(s.rate);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Keep audio in sync với volume/rate
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
  }, [rate]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    setCurrent(null);
  }, []);

  const play = useCallback(
    (src: string, btnId: string) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Click cùng button đang phát → pause
      if (current?.btnId === btnId && current.state === "playing") {
        audio.pause();
        setCurrent(null);
        return;
      }

      setCurrent({ btnId, state: "loading" });
      audio.src = src;
      audio.volume = volume;
      audio.playbackRate = rate;

      audio
        .play()
        .then(() => setCurrent({ btnId, state: "playing" }))
        .catch(() => setCurrent(null));
    },
    [current, volume, rate],
  );

  // Handle audio events: ended/error → clear current
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setCurrent(null);
    const handleError = () => setCurrent(null);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Keyboard: Space → replay last clicked
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (!current) return;
      e.preventDefault();
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [current]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    saveSettings({ ...loadSettings(), volume: v });
  }, []);

  const setRate = useCallback((r: number) => {
    setRateState(r);
    saveSettings({ ...loadSettings(), rate: r });
  }, []);

  const ctxValue = useMemo<AudioCtx>(
    () => ({ current, play, stop, volume, setVolume, rate, setRate }),
    [current, play, stop, volume, setVolume, rate, setRate],
  );

  return <Ctx.Provider value={ctxValue}>{children}</Ctx.Provider>;
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be inside <AudioProvider>");
  return ctx;
}
