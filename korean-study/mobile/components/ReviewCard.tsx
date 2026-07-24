"use client";

import { useRef, useState } from "react";
import { AudioButton } from "@/components/audio/AudioButton";
import type { VocabWord } from "@/lib/types";
import type { SrsRating } from "@/lib/srs";

interface Props {
  word: VocabWord;
  onRate: (r: SrsRating) => void;
}

const SWIPE_THRESHOLD = 90;
const FLY_OUT_X = 560;
const FLY_OUT_MS = 220;

/**
 * Màn ôn tập redesign cho mobile: chạm để lật (giống bản web), nhưng sau khi
 * lật, thẻ có thể vuốt trái/phải như 1 gesture thật (pointer events, không
 * cần lib ngoài) cho 2 rating quyết đoán nhất (sai/dễ). 4 nút rating vẫn giữ
 * nguyên bên dưới làm fallback chắc chắn — vuốt không che mất lựa chọn nào.
 *
 * Vật lý: đang kéo tay = không transition (bám ngón tay tức thời); thả tay
 * ra = transition spring (overshoot nhẹ) đưa thẻ về giữa, hoặc bay hẳn ra
 * ngoài màn hình nếu vượt threshold — không snap cứng.
 */
export function ReviewCard({ word, onRate }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flyingOut, setFlyingOut] = useState<SrsRating | null>(null);
  const startX = useRef(0);
  const pointerActive = useRef(false);

  function flip() {
    if (!flipped) setFlipped(true);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!flipped || flyingOut) return;
    pointerActive.current = true;
    setIsDragging(true);
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pointerActive.current) return;
    setDragX(e.clientX - startX.current);
  }

  function endDrag() {
    if (!pointerActive.current) return;
    pointerActive.current = false;
    setIsDragging(false);

    if (dragX > SWIPE_THRESHOLD) commitSwipe("easy");
    else if (dragX < -SWIPE_THRESHOLD) commitSwipe("again");
    else setDragX(0); // spring back về giữa (transition xử lý qua CSS)
  }

  function commitSwipe(rating: SrsRating) {
    setFlyingOut(rating);
    setDragX(rating === "easy" ? FLY_OUT_X : -FLY_OUT_X);
    window.setTimeout(() => onRate(rating), FLY_OUT_MS);
  }

  const rotate = dragX / 18;
  const hintOpacity = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);

  return (
    <div className="ks-review-stage">
      <div
        className={[
          "ks-review-card",
          "ks-surface",
          flipped ? "is-flipped" : "",
          isDragging ? "is-dragging" : "",
          flyingOut ? "is-flying" : "",
        ].join(" ").trim()}
        style={flipped ? { transform: `translateX(${dragX}px) rotate(${rotate}deg)` } : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={flip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } }}
        aria-label={flipped ? undefined : "Chạm để xem đáp án"}
      >
        {flipped && dragX !== 0 && (
          <span className={`ks-swipe-hint ${dragX > 0 ? "is-easy" : "is-again"}`} style={{ opacity: hintOpacity }}>
            {dragX > 0 ? "DỄ" : "SAI"}
          </span>
        )}

        {!flipped ? (
          <div className="ks-review-front">
            <p className="font-hand text-5xl font-bold text-ink mb-3">{word.ko}</p>
            <div className="flex justify-center mt-4" onClick={(e) => e.stopPropagation()}>
              <AudioButton text={word.ko} label={`Phát âm ${word.ko}`} />
            </div>
            <p className="mt-6 text-sm text-ink/45">Chạm để xem đáp án</p>
          </div>
        ) : (
          <div className="ks-review-back">
            <p className="font-hand text-5xl font-bold text-ink mb-1">{word.ko}</p>
            <p className="text-base text-ink/55 mb-5">{word.rom}</p>
            <div className="border-t-2 border-dashed border-ink/15 pt-5">
              <p className="text-2xl font-semibold text-ink">
                {word.vi}
                {word.viExtra && <span className="ml-2 text-base font-normal text-ink/55">{word.viExtra}</span>}
              </p>
            </div>
            <div className="flex justify-center mt-5" onClick={(e) => e.stopPropagation()}>
              <AudioButton text={word.ko} label={`Phát âm ${word.ko}`} />
            </div>
          </div>
        )}
      </div>

      {flipped && (
        <>
          <div className="ks-review-actions">
            <button type="button" className="ks-rate-btn is-again" onClick={() => commitSwipe("again")}>Sai</button>
            <button type="button" className="ks-rate-btn is-hard" onClick={() => onRate("hard")}>Khó</button>
            <button type="button" className="ks-rate-btn is-good" onClick={() => onRate("good")}>Được</button>
            <button type="button" className="ks-rate-btn is-easy" onClick={() => commitSwipe("easy")}>Dễ</button>
          </div>
          <p className="ks-swipe-tip">Vuốt thẻ trái = Sai · phải = Dễ — hoặc chạm nút</p>
        </>
      )}
    </div>
  );
}
