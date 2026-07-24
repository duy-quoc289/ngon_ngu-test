"use client";

import { AudioButton } from "@/components/audio/AudioButton";
import type { FlatVocabWord, VocabCategory } from "@/lib/types";

interface Props {
  word: FlatVocabWord;
  category?: VocabCategory;
  expanded: boolean;
  onToggle: () => void;
}

/**
 * Row gọn kiểu Quizlet: term + nghĩa trên 1 dòng, tap để mở rộng ví dụ/ghi
 * chú (accordion) thay vì luôn hiện đầy đủ như card desktop — tiết kiệm
 * không gian màn hình dọc, đúng pattern list-study của app từ vựng mobile.
 */
export function VocabRow({ word, category, expanded, onToggle }: Props) {
  return (
    <li className={`ks-vrow${expanded ? " is-expanded" : ""}`}>
      <button type="button" className="ks-vrow-main" onClick={onToggle} aria-expanded={expanded}>
        <div className="ks-vrow-text">
          <span className="ks-vrow-ko" lang="ko">{word.ko}</span>
          <span className="ks-vrow-sub">
            {word.rom} <span className="ks-vrow-sep">·</span> {word.vi}
          </span>
        </div>
        {category && <span className={`ks-vrow-dot ks-cat-${category.color}`} aria-hidden />}
      </button>

      <div className="ks-vrow-actions" onClick={(e) => e.stopPropagation()}>
        <AudioButton text={word.ko} label={`Nghe ${word.ko}`} />
      </div>

      {expanded && (
        <div className="ks-vrow-detail">
          {word.example && (
            <div className="ks-vrow-example">
              <p lang="ko">{word.example.ko}</p>
              {word.example.rom && <p className="ks-vrow-example-rom">{word.example.rom}</p>}
              <p className="ks-vrow-example-vi">{word.example.vi}</p>
            </div>
          )}
          {word.note && <p className="ks-vrow-note">💡 {word.note}</p>}
          {word.tags && word.tags.length > 0 && (
            <div className="ks-vrow-tags">
              {word.tags.map((t) => <span key={t} className="ks-vocab-tag">{t}</span>)}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
