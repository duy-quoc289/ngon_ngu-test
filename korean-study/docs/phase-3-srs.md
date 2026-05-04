# Phase 3 — Flashcard SRS (Leitner Box)

**Status:** ⏳ Planned · chưa implement.

Biến **160 vocab** (Phase 2) thành **active learning loop** qua Spaced Repetition System (SRS). Mỗi từ có "trạng thái nhớ", system tự sắp lịch ôn lại đúng lúc não sắp quên.

## Mục tiêu

- Học vocab **bền vững** thay vì xem 1 lần rồi quên
- Daily review queue → user chỉ học 5-15 phút/ngày là đủ duy trì
- Stats motivate (streak, accuracy) — gamification nhẹ
- Foundation cho Phase 4 (grammar cũng dùng cùng SRS pool)

## Stack lý thuyết: Leitner Box

5 boxes, mỗi box có interval review riêng:

| Box | Interval | Ý nghĩa |
|-----|----------|---------|
| **1** | 1 ngày | Mới hoặc vừa sai → ôn liền |
| **2** | 2 ngày | Đã đúng 1 lần |
| **3** | 4 ngày | Đã đúng 2 lần liên tiếp |
| **4** | 7 ngày | Vững dần |
| **5** | 14 ngày | Đã thuộc — chỉ refresh thi thoảng |

**Quy tắc:**
- Đúng → lên 1 box (max box 5)
- Sai → về box 1 (reset toàn bộ progress của thẻ đó)
- Thẻ chỉ xuất hiện khi `now >= lastReviewedAt + boxInterval`

So với SM-2 (Anki algorithm) thì Leitner đơn giản hơn nhiều, đủ tốt cho personal use, không cần lib bên ngoài.

## Sub-phases

### A — Core SRS engine + 1 study mode (~5-7h)

- Page mới `/flashcards`
- 1 mode duy nhất ở MVP: **한 → Vi** (hiện hangul, đoán nghĩa Việt)
- Card UI: front (한글 + audio), back (Vi + romanization)
- Rating: 2 nút **"Sai" (đỏ) / "Đúng" (xanh)**
- LocalStorage state per topic: `ks-srs-vocab`
- Daily review queue: chỉ thẻ đến hạn

**Data structure (LocalStorage):**
```ts
interface SrsState {
  cards: Record<string, CardState>;
  // key = audio id (vd: "vc_g_annyeong") để link với vocab data
}

interface CardState {
  box: 1 | 2 | 3 | 4 | 5;
  lastReviewedAt: number; // timestamp
  totalReviews: number;
  correctReviews: number;
}
```

### B — 3 study modes + nút Again/Hard/Good/Easy (~3-4h)

Nâng cấp MVP:

**3 modes:**
1. **한 → Vi** (recognition): Hiện 한글 → đoán Vi
2. **Vi → 한** (production): Hiện Vi → đoán 한글 (gõ hoặc nhớ trong đầu)
3. **Audio → Vi** (listening): Phát audio → đoán nghĩa (không hiện chữ trước)

User chọn mode đầu phiên hoặc mix random.

**4-button rating (như Anki):**
- **Again** — sai hoàn toàn → box 1 + show again trong session
- **Hard** — đúng nhưng khó → giữ nguyên box, nhân interval × 0.5
- **Good** — đúng bình thường → lên 1 box
- **Easy** — quá dễ → nhảy lên 2 box

Cho phép user fine-tune độ khó tốt hơn.

### C — Stats + dashboard (~2-3h)

Page `/flashcards/stats` hoặc widget trong homepage:

- **Streak** ngày liên tiếp ôn (xem ngày đầu tiên ôn → ngày gần nhất, không bỏ ngày nào)
- **Accuracy** tổng + theo box
- **Cards mature**: tổng box ≥ 3
- **Cards struggling**: rating sai ≥ 50% (top 10 từ khó)
- **Heatmap** hoạt động ôn — kiểu GitHub contribution graph
- **Box distribution** chart: pie/bar, % thẻ ở mỗi box

### D — Multi-pool (mở rộng sang grammar/dictation) (~1-2h)

Sau khi Phase 4 (Grammar) xong, SRS engine support thêm pool grammar.

- Mỗi pool có key độc lập trong LocalStorage (`ks-srs-vocab`, `ks-srs-grammar`, `ks-srs-dictation`)
- UI selector: "Hôm nay học pool nào?" (vocab / grammar / dictation / all)
- Stats riêng + chung

### E — Import/export progress (~1-2h)

Nice-to-have:
- Export SRS state ra JSON file (backup) → user save offline
- Import lại từ file → restore on new device
- Useful cho user multi-device (laptop + mobile)

## User flow

```
/flashcards (homepage)
├── Today's queue: "12 thẻ cần ôn hôm nay" + start button
├── Mode selector (한→Vi / Vi→한 / Audio→Vi / Mixed)
├── Stats summary: streak · accuracy · cards mature
└── [Bắt đầu ôn]

/flashcards/study (active session)
├── Card N/Total · progress bar
├── Front: 안녕              [▶ audio]
│   (tap to flip)
├── Back: Chào (thân mật) · an-nyeong
│   ↳ tag: greeting, informal
└── [Again] [Hard] [Good] [Easy]
    ↑ keyboard: 1/2/3/4 cũng OK

End of session:
└── Summary: 12 cards reviewed, 10 correct, 2 wrong, +1 streak day
    [Continue learning] [End]
```

## Critical implementation notes

### Leitner schedule logic
```ts
const INTERVALS = [null, 1, 2, 4, 7, 14]; // ngày, index = box

function isDue(card: CardState, now = Date.now()): boolean {
  const dayMs = 24 * 60 * 60 * 1000;
  const dueAt = card.lastReviewedAt + INTERVALS[card.box] * dayMs;
  return now >= dueAt;
}

function rate(card: CardState, rating: "again" | "hard" | "good" | "easy"): CardState {
  let newBox = card.box;
  switch (rating) {
    case "again": newBox = 1; break;
    case "hard":  newBox = card.box; break;        // stay
    case "good":  newBox = Math.min(card.box + 1, 5); break;
    case "easy":  newBox = Math.min(card.box + 2, 5); break;
  }
  return {
    box: newBox,
    lastReviewedAt: Date.now(),
    totalReviews: card.totalReviews + 1,
    correctReviews: card.correctReviews + (rating !== "again" ? 1 : 0),
  };
}
```

### Initial card creation (lazy)
- Khi user mở page lần đầu, KHÔNG init 160 cards luôn
- Mỗi từ chỉ tạo CardState khi nó được đưa vào session lần đầu
- Tránh LocalStorage phình to ngay từ đầu

### Daily review limit
- Nếu user vắng nhiều ngày → có thể có 50+ thẻ due
- Cap mỗi session ở **20 thẻ mới + 30 thẻ ôn = 50 max** để tránh burnout
- Setting toggleable

### Streak logic
- Lưu `lastStudyDate` (YYYY-MM-DD)
- Mỗi lần học xong ít nhất 1 thẻ → check date
- Cùng ngày: streak không đổi
- 1 ngày sau: streak + 1
- ≥ 2 ngày sau: streak reset về 1

### Audio-mode autoplay
- Khi mode = "Audio → Vi", tự động phát audio khi card load
- User bấm "Phát lại" để nghe lần 2/3
- Reuse AudioProvider sẵn có

### Keyboard shortcuts
- `Space` — flip card (xem đáp án)
- `1` / `2` / `3` / `4` — Again/Hard/Good/Easy
- `↓` — flip; `→` — next (sau khi rating)
- Đã có pattern trong app (LessonShell ←/→)

## File structure cần tạo

```
korean-study/
├── app/
│   └── flashcards/
│       ├── page.tsx           # Homepage SRS — queue + stats summary
│       └── study/page.tsx     # Active study session
├── components/
│   └── srs/
│       ├── FlashCard.tsx      # Card UI (front/back, flip)
│       ├── RatingButtons.tsx  # Again/Hard/Good/Easy
│       ├── ModeSelector.tsx
│       ├── SessionStats.tsx   # End-of-session summary
│       └── StatsHeatmap.tsx   # Sub-phase C
├── lib/
│   ├── srs.ts                 # Leitner logic + schedule + rating
│   └── srs-store.ts           # LocalStorage hook (read/write CardState)
└── docs/phase-3-srs.md        # ← file này
```

## Effort estimate

| Sub-phase | Effort | Cumulative |
|-----------|--------|------------|
| A — MVP (1 mode) | 5-7h | 5-7h |
| B — 3 modes + 4-btn rating | 3-4h | 8-11h |
| C — Stats dashboard | 2-3h | 10-14h |
| D — Multi-pool | 1-2h | 11-16h |
| E — Import/export | 1-2h | 12-18h |

**Khuyên start từ A**, ship + dùng 1-2 tuần để feel SRS rhythm trước khi đi B/C.

## Decision points

1. **Pool ban đầu**: chỉ vocab (160 từ) hay extend ngay sang exercise items của hangul/numbers/pronunciation (~30 items thêm)?
2. **Mode mặc định**: 한 → Vi (recognition, dễ hơn) hay mixed?
3. **Rating buttons**: 2-button (đơn giản) hay 4-button như Anki (chính xác hơn)?
4. **Daily limit**: 20 mới + 30 ôn = 50 max OK chưa? Hay user setable?
5. **Audio trong card**: tự động phát, hay click mới phát? Có ảnh hưởng concentration không?

## Out of scope (cho phase này)

- SM-2 algorithm (chỉ dùng Leitner đơn giản)
- AI-suggested cards (kiểu Duolingo Max)
- Multiplayer / social leaderboard
- Cloud sync (chỉ LocalStorage; export/import là alternative)
- Advanced FSRS algorithm
