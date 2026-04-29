"""Generate audio cho các tile/exercise trong data/*.json.

Đọc tất cả JSON, lấy danh sách audio cần có, generate qua edge-tts.
Đã có sẵn → skip. Chưa có → tạo mp3.

Chạy: python3 generate_lesson_audio.py
"""
import asyncio
import json
import os
from pathlib import Path

import edge_tts

VOICE = "ko-KR-SunHiNeural"
VOLUME = "-50%"
RATE = "+0%"
OUT_DIR = "audio"
DATA_DIR = "data"


def collect_audio_items(data: dict) -> dict:
    """Walk JSON, return {audio_id: korean_text} dict."""
    items = {}

    def add(audio_id, text):
        if audio_id and text:
            items[audio_id] = text

    for lesson in data.get("lessons", []):
        # tile-grid lesson
        for t in lesson.get("tiles", []):
            add(t.get("audio"), t.get("syllable") or t.get("char"))
        # comparison lesson
        for g in lesson.get("groups", []):
            for it in g.get("items", []):
                add(it.get("audio"), it.get("syllable") or it.get("char"))
        # exercise lesson
        for it in lesson.get("items", []):
            add(it.get("audio"), it.get("ko"))
        # rule lesson examples — TTS dùng cách "written" (viết) để giữ chân thực;
        # JS sẽ phát đúng cách phát âm vì người nói bản xứ tự áp quy tắc.
        for ex in lesson.get("examples", []):
            add(ex.get("audio"), ex.get("written"))

    # Vocab structure: categories[].words[]
    for cat in data.get("categories", []):
        for w in cat.get("words", []):
            add(w.get("audio"), w.get("ko"))
    return items


async def gen_one(audio_id: str, text: str):
    out_path = os.path.join(OUT_DIR, f"{audio_id}.mp3")
    if os.path.exists(out_path):
        return False  # skipped
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, volume=VOLUME)
    await communicate.save(out_path)
    return True


async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    all_items = {}

    for json_file in Path(DATA_DIR).glob("*.json"):
        with open(json_file, encoding="utf-8") as f:
            data = json.load(f)
        items = collect_audio_items(data)
        print(f"{json_file.name}: {len(items)} audio items")
        all_items.update(items)

    print(f"\nTotal unique audio: {len(all_items)}")
    new_count = 0
    for audio_id, text in all_items.items():
        created = await gen_one(audio_id, text)
        if created:
            new_count += 1
            print(f"  [+] {audio_id}.mp3 ← {text}")
    print(f"\nDone. Created {new_count} new files (skipped {len(all_items) - new_count}).")


if __name__ == "__main__":
    asyncio.run(main())
