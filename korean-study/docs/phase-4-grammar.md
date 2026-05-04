# Phase 4 — Grammar (10 ngữ pháp cốt lõi TOPIK 1)

**Status:** ⏳ Planned · chưa implement.

Bước cuối Stage 2 — đưa user vào ngữ pháp thực sự. **10 grammar points** đầu tiên đủ để **xây 80% câu cơ bản** trong giao tiếp tiếng Hàn.

## Mục tiêu

- Cover **10 grammar cốt lõi** (đuôi câu, particles, kính ngữ) đủ thi TOPIK 1
- Mỗi grammar có **lesson interactive**: formula + giải thích + ví dụ click-to-listen + mini exercise
- Auto enroll vào **SRS pool** (Phase 3) → ngữ pháp được ôn tập như vocab
- Bridge từ vocab passive (Phase 2) sang khả năng **tự ghép câu**

## 10 Grammar Points

| # | Grammar | Tên VN | Cấp | Tag |
|---|---------|--------|-----|-----|
| 1 | **이다 / 입니다** | "là" / "to be" | TOPIK 1A | copula |
| 2 | **있다 / 없다** | "có" / "không có" / "ở" | TOPIK 1A | existence |
| 3 | **-아/어요** | đuôi câu hiện tại lịch sự | TOPIK 1A | tense |
| 4 | **-았/었-** | thì quá khứ | TOPIK 1A | tense |
| 5 | **-(으)ㄹ 거예요** | thì tương lai | TOPIK 1A | tense |
| 6 | **-은/는 vs -이/가** | particles topic vs subject | TOPIK 1A | particle |
| 7 | **-을/를** | particle tân ngữ | TOPIK 1A | particle |
| 8 | **-에 / -에서** | particles địa điểm | TOPIK 1A | particle |
| 9 | **-와/과 / 하고** | "và" / "với" | TOPIK 1A | conjunction |
| 10 | **안 + V / V-지 않다** | phủ định | TOPIK 1A | negation |

> **Cover bonus** nếu còn effort: -고 (và rồi), -지만 (nhưng), -아/어서 (vì), -(으)니까 (bởi vì), -(으)면 (nếu)

## Sub-phases

### A — Data structure + 3 grammar đầu (~5-7h)

Thiết kế lesson type mới `grammar`, viết data cho 3 ngữ pháp đầu:
- 이다/입니다
- 있다/없다
- -아/어요

Đủ test design + UX. Sau đó nhân rộng cho 7 cái còn lại.

### B — 7 grammar còn lại (~5-7h)

Áp dụng cùng template, fill data cho:
- -았/었-, -(으)ㄹ 거예요
- -은/는, -이/가, -을/를
- -에/-에서
- -와/과, 하고
- 안, -지 않다

Generate audio cho ~50-100 example sentences (qua edge-tts).

### C — Interactive exercises mode (~3-5h)

Mỗi grammar có mini practice ở cuối lesson:

- **Fill-in-the-blank**: "저는 학생___" (chọn 입니다 / 이에요)
- **Multiple choice**: "Câu nào dùng -아/어요 đúng?" (4 options)
- **Conjugation drill**: cho động từ, user chia (vd: 가다 → 가요, 갔어요, 갈 거예요)
- Track score, link với SRS pool

### D — Tích hợp SRS (~1-2h)

- Mỗi grammar point → 1 SRS card
- Mỗi example sentence → tùy chọn (có thể thành card riêng)
- Pool key: `ks-srs-grammar`
- Tổng cards SRS: 160 vocab + 10 grammar + 50-80 sentences = ~250 cards

### E — Comparison page: -은/는 vs -이/가 (~2-3h)

Đây là điểm khó nhất với người mới — cần page so sánh chuyên sâu.

- Side-by-side: khi nào dùng cái nào
- Decision tree (flowchart)
- 10-15 ví dụ pairs (cùng câu, đổi particle → đổi nghĩa)

Có thể tách thành lesson `comparison-deep` riêng, hoặc gộp vào lesson "Particles" chung.

## Data schema

Tạo `data/grammar.json` theo schema mới hoặc reuse Topic existing.

**Option 1: Tạo lesson type `grammar` riêng**

```ts
// Extend Lesson union type trong lib/types.ts
interface GrammarLesson extends BaseLesson {
  type: "grammar";
  formula: string;             // vd: "Noun + 입니다 / Noun + 이에요/예요"
  meaning: string;              // "là, dùng để khẳng định"
  conjugation?: {              // bảng chia (cho động từ)
    headers: string[];          // ["Dictionary", "Present", "Past", "Future"]
    rows: { verb: string; forms: string[] }[];
  };
  rules: { label: string; rule: string; examples?: string[] }[];
  examples: GrammarExample[];   // câu ví dụ có audio
  exercise?: GrammarExercise[]; // optional mini practice
}

interface GrammarExample {
  ko: string;           // "저는 학생입니다."
  rom: string;          // "Jeo-neun hak-saeng-im-ni-da."
  vi: string;           // "Tôi là học sinh."
  audio: string;        // "gr_ida_001"
  highlight?: string;   // "입니다" — phần grammar đang dạy, để in đậm
}

interface GrammarExercise {
  type: "fill-blank" | "choice" | "conjugate";
  question: string;     // "저는 학생___"
  answer: string | string[];
  options?: string[];   // cho type "choice"
  hint?: string;
}
```

**Option 2: Reuse `rule` lesson type sẵn có**

Nhược: rule chưa có `conjugation`, `exercise` fields. Phải extend.

→ **Option 1 cleaner**, tạo type mới `grammar`.

## Sample data (lesson 1)

```json
{
  "id": "ida",
  "title": "이다 / 입니다 — Là (be)",
  "icon": "①",
  "type": "grammar",
  "formula": "Noun + **입니다** (formal) / Noun + **이에요/예요** (polite)",
  "meaning": "Đuôi câu khẳng định danh từ, tương đương 'là' trong tiếng Việt.",
  "rules": [
    {
      "label": "Quy tắc 이에요/예요",
      "rule": "Danh từ kết thúc bằng **phụ âm (받침)** → 이에요. Kết thúc bằng **nguyên âm** → 예요.",
      "examples": ["학생이에요 (학생 có 받침)", "친구예요 (친구 không 받침)"]
    },
    {
      "label": "Mức độ trang trọng",
      "rule": "**입니다** = formal (công sở, bài phát biểu). **이에요/예요** = polite (giao tiếp hằng ngày).",
      "examples": []
    }
  ],
  "examples": [
    { "ko": "저는 학생입니다.", "rom": "Jeo-neun hak-saeng-im-ni-da.", "vi": "Tôi là học sinh.", "audio": "gr_ida_01", "highlight": "입니다" },
    { "ko": "이것은 책이에요.", "rom": "I-geos-eun chaek-i-e-yo.", "vi": "Cái này là sách.", "audio": "gr_ida_02", "highlight": "이에요" },
    { "ko": "선생님이세요?", "rom": "Seon-saeng-nim-i-se-yo?", "vi": "Bạn là giáo viên à?", "audio": "gr_ida_03", "highlight": "이세요" }
  ],
  "exercise": [
    {
      "type": "fill-blank",
      "question": "저는 베트남 사람___ (formal)",
      "answer": "입니다",
      "hint": "Danh từ '사람' kết thúc bằng 받침 ㅁ"
    },
    {
      "type": "choice",
      "question": "이것은 가방___",
      "answer": "이에요",
      "options": ["입니다", "이에요", "예요", "이세요"]
    }
  ]
}
```

## User flow

```
/grammar (homepage)
├── Sidebar: 10 grammar lessons (giống pages/hangul.html)
├── Hero: title + meaning + formula
├── Body:
│   ├── Card "Công thức"      → formula với highlight
│   ├── Card "Cách dùng"       → rules với chips ví dụ
│   ├── Card "Bảng chia" (opt) → conjugation table cho động từ
│   ├── Card "Ví dụ"           → 5-10 sentences click-to-play (highlight grammar word)
│   └── Card "Luyện tập"       → mini exercises tương tác
└── Bottom: Prev/Next chuyển grammar
```

## Critical implementation notes

### Bảng chia (conjugation table)
Cho lesson 3 (-아/어요), lesson 4 (-았/었-), lesson 5 (-(으)ㄹ 거예요):

| Dictionary | Present | Past | Future | Negation |
|------------|---------|------|--------|----------|
| 가다 (đi) | 가요 | 갔어요 | 갈 거예요 | 안 가요 |
| 먹다 (ăn) | 먹어요 | 먹었어요 | 먹을 거예요 | 안 먹어요 |
| 하다 (làm) | 해요 | 했어요 | 할 거예요 | 안 해요 |

Dạng table với row hover, click → phát audio.

### Highlight grammar trong example
Trong example sentence, phần grammar đang dạy được **bôi đậm + màu accent** để user dễ nhận diện:

```jsx
// "저는 학생입니다." với highlight = "입니다"
const html = sentence.replace(highlight, `<mark class="grammar-highlight">${highlight}</mark>`);
```

CSS:
```css
.grammar-highlight {
  background: rgb(254 240 138);
  color: rgb(120 53 15);
  padding: 0 0.15em;
  border-radius: 3px;
  font-weight: 600;
}
```

### Audio strategy
- Generate 5-10 audio per grammar (×10 grammar = ~80 file mới)
- Cộng audio cho conjugation entries (~30 verbs ×3 forms = 90 file)
- **Tổng cần generate: ~150-200 audio mới**
- Effort generate: 5-10 phút
- Format ID: `gr_<grammar_slug>_<index>` (vd: `gr_ida_01`, `gr_ayoeoyo_03`)

### Exercise validation
- **Fill-blank**: exact match (sau normalize NFC, trim, lowercase)
- **Choice**: index match
- **Conjugate**: support nhiều answer đúng (vd: 가요 cũng có thể là 갑니다 trong context formal)

### Tích hợp SRS (Sub-phase D)
- Mỗi grammar entry → 1 card với:
  - Front: formula
  - Back: meaning + 1-2 example
- Mỗi example sentence → tùy chọn flag `inSrs: true` để add vào pool
- LocalStorage: `ks-srs-grammar` riêng biệt với vocab

## File structure cần tạo

```
korean-study/
├── app/
│   └── grammar/page.tsx       # Generic topic page (reuse TopicPage hoặc tạo mới)
├── components/
│   └── lessons/
│       └── GrammarLesson.tsx  # Lesson type mới — render formula + rules + examples + exercise
├── data/
│   └── grammar.json           # 10 grammar entries
├── public/audio/
│   └── gr_*.mp3               # ~150-200 file mới
└── docs/phase-4-grammar.md    # ← file này
```

## Effort estimate

| Sub-phase | Effort | Cumulative |
|-----------|--------|------------|
| A — Schema + 3 grammar đầu | 5-7h | 5-7h |
| B — 7 grammar còn lại + audio | 5-7h | 10-14h |
| C — Interactive exercises | 3-5h | 13-19h |
| D — SRS integration | 1-2h | 14-21h |
| E — Particles deep-dive (-은/는 vs -이/가) | 2-3h | 16-24h |

**Khuyên A → B → D → C → E** theo độ ưu tiên content vs polish.

## Decision points

1. **Lesson type mới `grammar` hay reuse `rule`?** Khuyên type mới (cleaner, support conjugation table + exercises).
2. **Conjugation table** có cần thiết cho mọi grammar không, hay chỉ áp dụng cho 3 thì (present/past/future)?
3. **Verbs để conjugate**: dùng top 20 verb phổ biến (가다, 오다, 먹다, 마시다, 보다, 사다, 하다, 읽다, 쓰다...) hay đa dạng theo từng lesson?
4. **Exercise mode**: fill-blank đơn giản, hay làm cả conjugate drill (nhập form chia) ngay từ đầu?
5. **Cấp độ ngữ pháp**: chỉ TOPIK 1 (10 grammar) hay extend tới TOPIK 2 (thêm 10-15 grammar)?
6. **Vi translation style**: dịch sát nghĩa hay tự nhiên? (vd: "저는 학생입니다" — "Tôi là học sinh" tự nhiên / "Về tôi, học sinh-thì" sát ngữ pháp)

## Out of scope (cho phase này)

- Conjugation rules dạy độc lập (irregular verbs, ㅂ-irregular, ㅡ-elision...) — quá nhiều cho TOPIK 1
- Honorifics phức tạp (시-form chi tiết, double honorifics) — TOPIK 2 trở lên
- Sentence structure deep dive (S-O-V vs O-S-V flexibility, topicalization) — academic
- Mood/aspect đầy đủ (-고 있다, -아/어 있다, -아/어 보다...) — bonus phases
- Counter words advanced — đã có ở Phase 1 (Numbers)
