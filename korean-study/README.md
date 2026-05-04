# Học tiếng Hàn — reference cá nhân

Static reference site cho người mới học tiếng Hàn — Hangul, số đếm, quy tắc nối âm, và 160 từ vựng cơ bản (chào hỏi, gia đình, ăn uống, mua sắm).

Built với **Next.js 16 (App Router) + TypeScript + Tailwind v4 + static export**.

## Stack

| | |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom CSS (`app/globals.css`) |
| Output | Static HTML (`output: 'export'` → `out/`) |
| Audio | 265 mp3 files (Edge-TTS, giọng `ko-KR-SunHiNeural`) |
| Dependencies | React 19 + Next.js (no other npm packages) |

## Cấu trúc

```
app/
├── layout.tsx               # Root: fonts, AudioProvider, FOUC dark mode script
├── page.tsx                 # Homepage
├── globals.css              # Tailwind + custom CSS (~1600 dòng)
├── hangul/page.tsx          # 7 lessons
├── numbers/page.tsx         # 9 lessons
├── pronunciation/page.tsx   # 8 lessons (rule type)
├── summary/page.tsx         # 6 lessons (lộ trình)
└── vocab/page.tsx           # 160 từ vựng

components/
├── audio/                   # AudioProvider, AudioButton, AudioControlPanel
├── layout/                  # TopBar, Hero, LessonShell, LessonSidebar, LessonNav
├── lessons/                 # 5 lesson type components + LessonViewer + TopicPage
└── vocab/                   # VocabPage, CategoryChips, SearchBox, VocabCard

lib/
├── types.ts                 # TypeScript types cho lesson + vocab
├── theme.ts                 # FOUC dark mode init script
├── progress.ts              # useProgress hook (LocalStorage)
├── debounce.ts              # useDebouncedValue hook
└── highlight.tsx            # <Highlight> component cho search

data/                        # JSON data (imported tại build time)
public/audio/                # 265 mp3 files
```

## Phát triển

```bash
npm install
npm run dev
# Mở http://localhost:3000
```

## Build static

```bash
npm run build
# Output → out/ (deploy được Netlify, GitHub Pages, S3, Cloudflare Pages...)
npx serve out  # smoke test local
```

## Deploy Netlify

1. Push lên GitHub (private repo OK)
2. Netlify → "Add new site" → Connect repo
3. Build command: `npm run build`
4. Publish directory: `out`
5. Done — auto-deploy mỗi lần push

## Audio

265 mp3 files trong `public/audio/`. Đặt tên theo namespace:

- `hh_*` — số Hán-Hàn (영, 일, 이...)
- `th_*` — số thuần Hàn (하나, 둘...)
- `vowel_*` / `cons_*` — chữ cái Hangul (아, 가, 나...)
- `r1_*` ... `r7_*` — ví dụ 7 quy tắc nối âm
- `ex_*` — câu ví dụ (안녕, 감사합니다...)
- `vc_g_*` — vocab chào hỏi (greetings)
- `vc_f_*` — vocab gia đình (family)
- `vc_e_*` — vocab ăn uống (eating)
- `vc_s_*` — vocab mua sắm (shopping)

Để regenerate audio: dùng Edge-TTS (xem `korean-study-legacy/generate_lesson_audio.py` cho reference Python script — có thể port sang Node sau).

## Roadmap

- ✅ **Phase 1** — Foundation: Hangul / Số đếm / Nối âm / Lộ trình
- ✅ **Phase 2** — Vocabulary: 160 từ × 4 chủ đề
- 📋 **Phase 3** — Flashcard SRS (Leitner box) — see [docs/phase-3-srs.md](docs/phase-3-srs.md)
- 📋 **Phase 4** — Grammar (10 ngữ pháp cốt lõi TOPIK 1) — see [docs/phase-4-grammar.md](docs/phase-4-grammar.md)
- 📋 **Phase Dictation** — Nghe chép chính tả từ voice + video (받아쓰기) — see [docs/dictation-phase.md](docs/dictation-phase.md)

## Notes

- Dark mode tự động theo system preference (`prefers-color-scheme`); FOUC fix qua inline script ở `<head>`.
- Progress tracking độc lập per-topic qua LocalStorage (`ks-progress-{topic}`).
- Audio settings (volume + playback rate) lưu LocalStorage (`ks-audio-settings`).
- Phím tắt: `←/→` chuyển bài (lesson pages), `/` focus search (vocab), `Space` replay audio.
