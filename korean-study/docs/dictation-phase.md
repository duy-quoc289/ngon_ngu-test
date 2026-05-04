# Phase Dictation — 받아쓰기 (Nghe chép chính tả)

**Status:** 📋 Planning · chưa implement.

Bài tập **dictation** là cách luyện listening + spelling Hàn cùng lúc — học sinh nghe audio/video → gõ lại Hangul → so với đáp án. Đây là phương pháp được TOPIK và các giáo trình chính thống dùng nhiều.

## Mục tiêu

- Tận dụng **265 audio sẵn có** + cho phép thêm video clip → nguồn bài tập phong phú không cần tạo content mới.
- Luyện **nghe nhanh + viết Hangul đúng chính tả** (gồm cả 받침 dễ nhầm).
- Track tiến độ — link với SRS để bài sai hiện lại nhiều hơn.

## Sub-phases (đề xuất build từng bước)

### A — Voice dictation MVP (~6-8h)

Cốt lõi nhất, dùng audio đã có.

- Page mới `/dictation` với danh sách bài tập (filter theo source/level/category)
- Mỗi exercise: phát audio + ô input Hangul + nút "Kiểm tra"
- So sánh exact match (trim spaces, case-insensitive)
- Hiện đáp án + romanization + nghĩa Việt sau khi kiểm tra
- Đếm correct/incorrect, lưu kết quả LocalStorage

**Data source:** Reuse từ `vocab.json` (160 từ) + `numbers.json` + `pronunciation.json` (rule examples) + exercise items trong `hangul.json`/`summary.json`. Tổng ~250 entries có `audio` + `ko` text.

**File mới:**
- `data/dictation.json` — generate tự động từ các JSON khác (script `scripts/build-dictation.ts`)
- `app/dictation/page.tsx` + `components/dictation/`

### B — Visual diff + hint (~3-4h)

Khi sai, hiện diff giữa user input vs đáp án.

- Char-level diff: `안녕하세요` vs `안녀하세요` → highlight ký tự sai
- Syllable decomposition: split mỗi syllable thành **jamo** (sơ-trung-chung) để chỉ ra cụ thể sai ở phụ âm cuối, nguyên âm, etc.
- Helper Hangul library: dùng `hangul-js` hoặc tự viết (Hangul có thuật toán composition rõ ràng)
- Hint mode: cho user 1 lần "show first character" hoặc "show romanization" trước khi nhập

### C — On-screen Hangul keyboard (~4-5h)

Nhiều user (đặc biệt mobile) chưa cài Hangul IME.

- Bàn phím ảo có **jamo layout** (consonants trái, vowels phải) — đúng layout Dubeolsik chuẩn của KR
- Auto-compose syllables khi user gõ jamo (ví dụ: ㄱ + ㅏ + ㄴ → 간)
- Toggle on/off (user có IME thật thì ẩn)
- Mobile-optimized: cảm ứng to, có haptic feedback

### D — Video dictation (~6-8h)

Phức tạp nhất, mở rộng nguồn content sang video.

**Approach 1: YouTube embed** (recommend)
- Pre-curated list: chọn ~30-50 clip ngắn từ TTMIK podcast, drama scenes, etc.
- Mỗi exercise có `videoUrl` + `videoStart` + `videoEnd` (seconds)
- Dùng YouTube IFrame API: load video, chỉ play đoạn `start..end`, có loop
- Đáp án transcript được cung cấp bởi mình (manual curation)

**Approach 2: User-uploaded video** (advanced)
- User paste YouTube URL + start/end timestamps + transcript
- Lưu vào LocalStorage (chỉ local cá nhân, không share)
- Pro: unlimited content. Con: user phải tự tìm + nhập transcript

**Approach 3: Self-hosted clips** 
- Bundle short mp4/webm trong `public/clips/` (~10-30s mỗi clip)
- Pro: control tuyệt đối, không phụ thuộc YouTube. Con: bản quyền (chỉ dùng được Creative Commons clips), repo phình to.

→ Khuyên Approach 1 + 2 song song: site có sẵn 30 clip curated; user advanced tự thêm.

### E — SRS integration (~2-3h)

Liên kết với Phase 3 (Flashcard SRS) khi đã có.

- Mỗi entry dictation có `score` (Leitner box 1-5)
- Sai → giảm box. Đúng → tăng box.
- Mode "Today's review" — chỉ hiện entries cần ôn hôm nay
- Stats overview: tổng correct/incorrect, streak ngày, top 10 từ sai nhiều nhất

## User flow (Sub-phase A)

```
/dictation (homepage)
├── Filter chips: source (vocab/numbers/pronunciation), level, category
├── Stats bar: streak · accuracy · today's count
└── Exercise list (lazy/paginate ~20 mỗi trang)
    └── Click "Bắt đầu" → /dictation/run

/dictation/run
├── [▶ Play audio]              ← phát nhanh / chậm (tận dụng AudioControlPanel)
├── [Input box Hangul]          ← user gõ
├── [✓ Kiểm tra]                ← Enter để submit
├── Result feedback:
│   ├── ✓ Correct! → next + 1 streak
│   └── ✗ Wrong: hiện diff + đáp án + Vi
└── [Skip] [Next]
```

## Data schema

```ts
// data/dictation.json
interface DictationData {
  topic: 'dictation';
  title: string;
  exercises: DictationExercise[];
}

interface DictationExercise {
  id: string;                    // dict-001
  source: 'vocab' | 'lesson' | 'video' | 'user';
  audio?: string;                // namespace path tới mp3 (vc_g_annyeong)
  videoUrl?: string;             // YouTube embed URL hoặc /clips/x.mp4
  videoStart?: number;           // seconds
  videoEnd?: number;
  answer: string;                // 안녕하세요
  rom?: string;
  vi?: string;
  level: 1 | 2 | 3 | 4;
  tags?: string[];               // greeting, food, polite...
  hint?: string;                 // optional context hint
}
```

## Critical implementation notes

### Hangul comparison logic
- Trim Unicode whitespace (vd `　` trong Hàn cũng là space)
- Normalize NFC vs NFD (Hangul có 2 dạng compose) — dùng `string.normalize('NFC')` cả 2 sides
- Optional: ignore punctuation (`?` `.` `!`) cho user-friendly checking
- Strict mode + lenient mode option

### Hangul jamo decomposition
```js
// 안 → [ㅇ, ㅏ, ㄴ]
function decompose(syllable) {
  const code = syllable.charCodeAt(0) - 0xAC00;
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  return [INITIAL[cho], MEDIAL[jung], FINAL[jong]];
}
```
Tự viết được, không cần npm package.

### Korean text input UX
- `<input type="text" lang="ko" inputmode="text" autocomplete="off" autocorrect="off" spellcheck="false">`
- Submit on Enter
- Auto-focus sau mỗi exercise
- Clear input button

### Video segmenting (Sub-phase D)
- YouTube IFrame API: `loadVideoById({videoId, startSeconds, endSeconds})`
- Hook `onPlayerStateChange` → khi đến `endSeconds` thì pause
- Loop button: replay đoạn segment

## Effort estimate

| Sub-phase | Effort | Cumulative |
|-----------|--------|------------|
| A — Voice MVP | 6-8h | 6-8h |
| B — Diff + hint | 3-4h | 9-12h |
| C — Hangul keyboard | 4-5h | 13-17h |
| D — Video integration | 6-8h | 19-25h |
| E — SRS integration | 2-3h | 21-28h |

**Khuyên build A + B trước** (đủ practical đã, ~10h work) → ship + dùng → sau đó cân nhắc C/D/E theo nhu cầu thực tế.

## Decision points (cần align trước khi start)

1. **Phase number?** Đề xuất gắn vào lộ trình hiện tại:
   - Option 1: Phase 5 (sau Grammar) — fit phần "practice" sau khi học xong grammar
   - Option 2: Phase 3 (trước Flashcard SRS) — vì leverage vocab đã có (Phase 2)
   - Option 3: Standalone (không gắn vào lộ trình tuần tự, dùng song song với mọi phase)
2. **Khởi đầu từ Sub-phase nào?** A (MVP) là natural; nhưng nếu user thấy keyboard khó, có thể start C trước.
3. **Video source**: chỉ A (YouTube curated)? Cho phép B (user paste URL)? Cả 2?
4. **Hangul keyboard ngay từ đầu** hay sau khi A xong rồi mới thêm?
5. **Style**: tách riêng `/dictation` page độc lập, hay gắn vào mỗi vocab card có nút "Practice dictation" cho từ đó?

## Out of scope (cho phase này)

- Speech-to-text (user nói tiếng Hàn, máy chấm pronunciation) — phức tạp, cần cloud API
- Handwriting recognition (vẽ Hangul bằng tay) — niche
- Multi-user / leaderboard / social — over-engineered cho personal site
- Chấm điểm intonation / accent — không khả thi với TTS audio (vốn không có cảm xúc)
