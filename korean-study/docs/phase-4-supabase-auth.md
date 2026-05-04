# Phase 4 — Supabase Auth & User Management

## Mục tiêu

Thêm xác thực người dùng (Google OAuth) và đồng bộ dữ liệu học lên Supabase,
thay thế localStorage-only hiện tại. Người dùng đã đăng nhập sẽ giữ được tiến độ
khi đổi thiết bị hoặc xóa cache trình duyệt.

---

## Stack

| Layer | Thư viện |
|---|---|
| Auth | `next-auth@beta` (v5) + Google OAuth provider |
| DB Adapter | `@auth/supabase-adapter` |
| Database | Supabase (Postgres managed) |
| Client | `@supabase/supabase-js` + `@supabase/ssr` |
| Data layer | Next.js Server Actions (không dùng API routes riêng) |

---

## Cấu trúc file

```
korean-study/
├── .env.local                               ← biến môi trường (không commit)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                        ← createBrowserClient (dùng trong Client Component)
│   │   ├── server.ts                        ← createServerClient (dùng trong Server Component / Action)
│   │   └── schema.sql                       ← SQL tạo bảng + RLS policies
│   ├── auth.ts                              ← NextAuth config (providers, adapter, callbacks)
│   ├── srs-store.ts                         ← SỬA: thêm server sync khi đã login
│   └── progress.ts                          ← SỬA: thêm server sync khi đã login
│
├── app/
│   ├── layout.tsx                           ← SỬA: wrap SessionProvider
│   ├── auth/
│   │   ├── login/page.tsx                   ← trang đăng nhập (nút Google)
│   │   └── callback/route.ts                ← OAuth callback handler
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts      ← NextAuth route handler
│   └── profile/
│       └── page.tsx                         ← trang thống kê user
│
├── components/
│   ├── auth/
│   │   ├── LoginButton.tsx                  ← nút "Đăng nhập với Google"
│   │   └── UserMenu.tsx                     ← avatar + dropdown (profile, đăng xuất)
│   └── layout/
│       └── TopBar.tsx (trang chủ)           ← SỬA: thêm UserMenu góc phải
│
└── actions/                                 ← Server Actions
    ├── srs.ts                               ← submitRating, getQueue, getStats
    └── progress.ts                          ← markLessonDone, getProgress
```

---

## Supabase DB Schema

```sql
-- Tiến độ từng bài học
create table lesson_progress (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  topic      text not null,   -- 'hangul' | 'numbers' | 'pronunciation'
  lesson_idx int  not null,
  done       bool default false,
  updated_at timestamptz default now(),
  unique(user_id, topic, lesson_idx)
);

-- SRS Leitner cards
create table srs_cards (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  word_id     text not null,   -- = word.audio key
  box         int  default 1,
  next_review date default current_date,
  streak      int  default 0,
  total_reps  int  default 0,
  correct     int  default 0,
  updated_at  timestamptz default now(),
  unique(user_id, word_id)
);

-- Streak theo ngày
create table streak_log (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users(id) on delete cascade,
  date           date not null,
  cards_reviewed int  default 0,
  unique(user_id, date)
);

-- Row Level Security
alter table lesson_progress enable row level security;
alter table srs_cards        enable row level security;
alter table streak_log       enable row level security;

create policy "user sees own data" on lesson_progress for all using (auth.uid() = user_id);
create policy "user sees own data" on srs_cards        for all using (auth.uid() = user_id);
create policy "user sees own data" on streak_log       for all using (auth.uid() = user_id);
```

---

## Luồng dữ liệu

```
Chưa đăng nhập:
  localStorage ──► useSrsStore ──► StudyPage   (giống hiện tại)

Đã đăng nhập:
  Supabase DB ──► Server Action ──► useSrsStore ──► StudyPage
                         ▲
  submitRating() ────────┘ upsert srs_cards + streak_log
```

`localStorage` vẫn giữ làm **offline cache** — mất mạng vẫn học được,
sync lên server khi có kết nối lại.

---

## Trang `/profile`

- Avatar + tên Google
- Streak calendar (dạng GitHub contribution graph)
- Thống kê: tổng thẻ, thẻ vững (box 5), accuracy tổng
- Danh sách từ khó nhất (box 1 lâu nhất / đúng ít nhất)
- Nút export dữ liệu (JSON)

---

## Biến môi trường cần thiết (`.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # chỉ dùng server-side

# NextAuth
AUTH_SECRET=<random 32+ chars>     # openssl rand -base64 32
AUTH_URL=http://localhost:3000

# Google OAuth
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

---

## Thứ tự triển khai

### B1 — Chuẩn bị hạ tầng (ngoài code)
- [ ] Tạo Supabase project → lấy URL + anon key + service role key
- [ ] Tạo Google OAuth client tại Google Cloud Console
  - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- [ ] Chạy schema.sql trong Supabase SQL Editor

### B2 — Cài packages + cấu hình
- [ ] `npm install next-auth@beta @auth/supabase-adapter @supabase/supabase-js @supabase/ssr`
- [ ] Tạo `.env.local`
- [ ] Tạo `lib/supabase/client.ts` và `lib/supabase/server.ts`
- [ ] Tạo `lib/auth.ts`

### B3 — Auth UI
- [ ] `app/api/auth/[...nextauth]/route.ts`
- [ ] `app/auth/login/page.tsx` — trang đăng nhập đơn giản
- [ ] `components/auth/LoginButton.tsx`
- [ ] `components/auth/UserMenu.tsx` — avatar + dropdown
- [ ] Sửa `app/layout.tsx` — wrap `SessionProvider`
- [ ] Sửa `components/layout/TopBar.tsx` — thêm `UserMenu`

### B4 — Server Actions SRS
- [ ] `actions/srs.ts` — `getQueue()`, `submitRating()`, `getStats()`
- [ ] Sửa `lib/srs-store.ts` — khi có session: đọc/ghi server; khi không: localStorage

### B5 — Server Actions lesson progress
- [ ] `actions/progress.ts` — `getProgress()`, `markLessonDone()`
- [ ] Sửa `lib/progress.ts` — sync server khi đã login

### B6 — Trang profile
- [ ] `app/profile/page.tsx` — layout thống kê
- [ ] Streak calendar component
- [ ] API lấy streak_log data

### B7 — Offline sync (optional)
- [ ] Detect online/offline
- [ ] Queue các thay đổi khi offline, flush khi reconnect

---

## Rủi ro & lưu ý

| Vấn đề | Xử lý |
|---|---|
| User dùng localStorage rồi mới login | Khi login lần đầu: merge localStorage → server (lấy box cao hơn) |
| Supabase pause sau 7 ngày | App học hàng ngày → không bị; nếu bị chỉ chờ ~30s |
| Google OAuth cần HTTPS trên production | Dùng Vercel deploy hoặc `ngrok` khi test local |
| `SUPABASE_SERVICE_ROLE_KEY` bị lộ | Chỉ dùng server-side, không expose qua `NEXT_PUBLIC_` |
