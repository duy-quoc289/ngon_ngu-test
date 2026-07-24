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

// Import động — module này chạm `window` ngay ở top-level (xem dist/index.js
// "Warm up" block), làm vỡ prerender static export (chạy trong Node, không
// có window). Chỉ load khi thực sự cần, trong browser/WebView.
async function getTextToSpeech() {
  const { TextToSpeech } = await import("@capacitor-community/text-to-speech");
  return TextToSpeech;
}

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

/**
 * Dùng plugin native @capacitor-community/text-to-speech thay vì
 * window.speechSynthesis trực tiếp — trên Android nó gọi thẳng
 * android.speech.tts.TextToSpeech (native), không đi qua WebView.
 * Lý do đổi: speechSynthesis trong WebView nhúng (khác Chrome tab thật)
 * có nhiều report im lặng không phát/không bắn event gì — khiến nút bị
 * kẹt "loading" mãi. Native plugin đảm bảo onDone/onError luôn bắn
 * (xem android/.../TextToSpeech.java: UtteranceProgressListener), nên
 * Promise chắc chắn settle dù máy thiếu gói giọng đọc Hàn hay không.
 * Trên web (pnpm dev) plugin tự fallback dùng chính speechSynthesis
 * trình duyệt (implementation .web.ts của plugin) — không cần code riêng.
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<CurrentAudio | null>(null);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const [rate, setRateState] = useState(DEFAULT_RATE);
  const lastRef = useRef<{ text: string; id: string } | null>(null);
  const tokenRef = useRef(0); // bỏ qua kết quả của lần speak() cũ nếu đã bị stop/thay bởi lần mới

  useEffect(() => {
    const s = loadSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVolumeState(s.volume);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRateState(s.rate);
  }, []);

  const speak = useCallback(
    (text: string, id: string) => {
      const token = ++tokenRef.current;
      lastRef.current = { text, id };
      setCurrent({ btnId: id, state: "playing" });

      getTextToSpeech()
        .then((TextToSpeech) =>
          TextToSpeech.speak({ text, lang: "ko-KR", rate, volume, category: "ambient" }),
        )
        .catch((err) => console.error("TTS error:", err))
        .finally(() => {
          // chỉ clear nếu vẫn là lần play này — tránh xoá state của lần play mới hơn
          if (tokenRef.current === token) setCurrent(null);
        });
    },
    [volume, rate],
  );

  const play = useCallback(
    (text: string, id: string) => {
      // Chạm cùng nút đang phát → stop
      if (current?.btnId === id) {
        tokenRef.current++; // vô hiệu hoá callback của lần speak() đang chờ
        getTextToSpeech().then((TextToSpeech) => TextToSpeech.stop());
        setCurrent(null);
        return;
      }
      speak(text, id);
    },
    [current, speak],
  );

  const stop = useCallback(() => {
    tokenRef.current++;
    getTextToSpeech().then((TextToSpeech) => TextToSpeech.stop());
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
