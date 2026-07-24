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
  play: (text: string, id: string) => void;
  stop: () => void;
  volume: number;
  setVolume: (v: number) => void;
  rate: number;
  setRate: (r: number) => void;
}

const Ctx = createContext<AudioCtx | null>(null);

const SETTINGS_KEY = "ks-audio-settings";
const DEFAULT_VOLUME = 0.8;
const DEFAULT_RATE = 1.0;

function loadSettings() {
  if (typeof window === "undefined") return { volume: DEFAULT_VOLUME, rate: DEFAULT_RATE };
  try { return { volume: DEFAULT_VOLUME, rate: DEFAULT_RATE, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") }; }
  catch { return { volume: DEFAULT_VOLUME, rate: DEFAULT_RATE }; }
}

function saveSettings(s: { volume: number; rate: number }) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<CurrentAudio | null>(null);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [rate, setRateState] = useState(DEFAULT_RATE);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const lastRef = useRef<{ text: string; id: string } | null>(null);

  // Load settings từ localStorage
  useEffect(() => {
    const s = loadSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVolumeState(s.volume);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRateState(s.rate);
  }, []);

  // Tìm Korean voice — load async vì voices có thể chưa sẵn khi mount
  useEffect(() => {
    function pickVoice() {
      const voices = window.speechSynthesis?.getVoices() ?? [];
      voiceRef.current =
        voices.find((v) => v.lang === "ko-KR") ??
        voices.find((v) => v.lang.startsWith("ko")) ??
        null;
    }
    pickVoice();
    window.speechSynthesis?.addEventListener("voiceschanged", pickVoice);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", pickVoice);
  }, []);

  const speak = useCallback(
    (text: string, id: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ko-KR";
      utter.volume = volume;
      utter.rate = rate;
      if (voiceRef.current) utter.voice = voiceRef.current;

      setCurrent({ btnId: id, state: "loading" });
      lastRef.current = { text, id };

      utter.onstart = () => setCurrent({ btnId: id, state: "playing" });
      utter.onend = () => setCurrent(null);
      utter.onerror = () => setCurrent(null);

      window.speechSynthesis.speak(utter);
    },
    [volume, rate],
  );

  const play = useCallback(
    (text: string, id: string) => {
      // Click cùng button đang phát → stop
      if (current?.btnId === id) {
        window.speechSynthesis?.cancel();
        setCurrent(null);
        return;
      }
      speak(text, id);
    },
    [current, speak],
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setCurrent(null);
  }, []);

  // Space → replay
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (!lastRef.current) return;
      e.preventDefault();
      speak(lastRef.current.text, lastRef.current.id);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [speak]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    saveSettings({ volume: v, rate });
  }, [rate]);

  const setRate = useCallback((r: number) => {
    setRateState(r);
    saveSettings({ volume, rate: r });
  }, [volume]);

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
