"use client";

import { useAudioButtonState } from "@/components/audio/AudioButton";
import type { Tile, TileGridLesson as TileGridLessonType } from "@/lib/types";
import { PlayIcons } from "./PlayIcons";

interface Props {
  lesson: TileGridLessonType;
}

export function TileGridLesson({ lesson }: Props) {
  return (
    <div className="ks-tile-grid">
      {lesson.tiles.map((t, i) => (
        <TileButton key={i} tile={t} />
      ))}
    </div>
  );
}

function TileButton({ tile }: { tile: Tile }) {
  const audioPath = tile.audio ? `/audio/${tile.audio}.mp3` : undefined;
  const { isPlaying, isLoading, onClick } = useAudioButtonState(audioPath);
  const stateClass = isPlaying ? "is-playing" : isLoading ? "is-loading" : "";

  return (
    <button
      type="button"
      className={`ks-tile ${stateClass}`}
      data-audio={audioPath}
      aria-label={`Nghe ${tile.char}`}
      onClick={onClick}
    >
      <div className="ks-tile-char" lang="ko">
        {tile.char}
      </div>
      {tile.rom && <div className="ks-tile-rom">{tile.rom}</div>}
      {tile.vi && <div className="ks-tile-vi">{tile.vi}</div>}
      {tile.made && (
        <div className="ks-tile-made" lang="ko">
          {tile.made}
        </div>
      )}
      {tile.syllable && (
        <div className="ks-tile-syl">
          <span lang="ko">{tile.syllable}</span>
        </div>
      )}
      {audioPath && (
        <div className="ks-tile-play-hint">
          <PlayIcons />
        </div>
      )}
    </button>
  );
}
