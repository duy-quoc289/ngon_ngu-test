import type { FlatVocabWord, VocabCategory } from "@/lib/types";
import { Highlight } from "@/lib/highlight";
import { AudioButton } from "@/components/audio/AudioButton";

interface Props {
  word: FlatVocabWord;
  category?: VocabCategory;
  query: string;
}

export function VocabCard({ word, category, query }: Props) {
  const audioPath = word.audio ? `/audio/${word.audio}.mp3` : "";

  return (
    <article className="ks-vocab-card">
      <div className="ks-vocab-card-main">
        <div className="ks-vocab-ko" lang="ko">
          <Highlight text={word.ko} query={query} />
        </div>
        <div className="ks-vocab-meta">
          <span className="ks-vocab-rom">
            <Highlight text={word.rom} query={query} />
          </span>
          <span className="ks-vocab-sep">·</span>
          <span className="ks-vocab-vi">
            <Highlight text={word.vi} query={query} />
          </span>
          {word.viExtra && <span className="ks-vocab-vi-extra">{word.viExtra}</span>}
        </div>
        <div className="ks-vocab-tags">
          {category && (
            <span className={`ks-vocab-cat-pill ks-cat-${category.color}`}>
              {category.icon} {category.title}
            </span>
          )}
          {(word.tags || []).map((t) => (
            <span key={t} className="ks-vocab-tag">
              {t}
            </span>
          ))}
        </div>
        {word.example && (
          <div className="ks-vocab-example">
            <div className="ks-vocab-example-ko" lang="ko">
              {word.example.ko}
            </div>
            {word.example.rom && (
              <div className="ks-vocab-example-rom">{word.example.rom}</div>
            )}
            <div className="ks-vocab-example-vi">{word.example.vi}</div>
          </div>
        )}
        {word.note && <div className="ks-vocab-note">{word.note}</div>}
      </div>
      {audioPath && (
        <AudioButton
          src={audioPath}
          label={`Nghe ${word.ko}`}
          className="ks-vocab-play"
        />
      )}
    </article>
  );
}
