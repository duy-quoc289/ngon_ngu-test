-- ============================================================
-- Korean Study App — Supabase Schema
-- Chạy trong: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Tiến độ từng bài học ────────────────────────────────────
create table if not exists lesson_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  topic       text not null,   -- 'hangul' | 'numbers' | 'pronunciation'
  lesson_id   text not null,   -- string ID của lesson (vd: 'vowels-basic')
  done        bool default true,
  updated_at  timestamptz default now(),
  unique(user_id, topic, lesson_id)
);

-- ── SRS Leitner cards ───────────────────────────────────────
create table if not exists srs_cards (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  word_id          text not null,        -- = word.audio key (e.g. "annyeong")
  box              int  default 1,       -- Leitner box 1-5
  last_reviewed_at bigint default 0,     -- ms timestamp (khớp với CardState.lastReviewedAt)
  total_reviews    int  default 0,
  correct_reviews  int  default 0,
  updated_at       timestamptz default now(),
  unique(user_id, word_id)
);

-- ── Streak log theo ngày ────────────────────────────────────
create table if not exists streak_log (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users(id) on delete cascade not null,
  date           date not null,          -- 'YYYY-MM-DD'
  cards_reviewed int  default 0,
  unique(user_id, date)
);

-- ── Row Level Security ──────────────────────────────────────
alter table lesson_progress enable row level security;
alter table srs_cards        enable row level security;
alter table streak_log       enable row level security;

-- Mỗi user chỉ thấy/sửa dữ liệu của chính mình
drop policy if exists "user_own_lesson_progress" on lesson_progress;
create policy "user_own_lesson_progress" on lesson_progress
  for all using (auth.uid() = user_id);

drop policy if exists "user_own_srs_cards" on srs_cards;
create policy "user_own_srs_cards" on srs_cards
  for all using (auth.uid() = user_id);

drop policy if exists "user_own_streak_log" on streak_log;
create policy "user_own_streak_log" on streak_log
  for all using (auth.uid() = user_id);

-- ── Function: upsert streak + increment count ───────────────
create or replace function upsert_streak_log(p_user_id uuid, p_date date)
returns void language plpgsql security definer as $$
begin
  insert into streak_log (user_id, date, cards_reviewed)
  values (p_user_id, p_date, 1)
  on conflict (user_id, date)
  do update set cards_reviewed = streak_log.cards_reviewed + 1;
end;
$$;
