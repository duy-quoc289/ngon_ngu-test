-- ── Dictation — schema ──────────────────────────────────────────────────────
-- Chạy trong: Supabase Dashboard → SQL Editor

create table if not exists dictation_videos (
  video_id   text primary key,
  title      text not null,
  channel    text,
  level      int default 1 check (level between 1 and 3),
  fetched_at timestamptz
);

create table if not exists dictation_segments (
  id         uuid default gen_random_uuid() primary key,
  video_id   text references dictation_videos(video_id) on delete cascade not null,
  start_sec  int  not null,
  end_sec    int  not null,
  text       text not null,
  char_count int  generated always as (length(text)) stored
);

-- Index cho random query nhanh
create index if not exists idx_dictation_segments_video on dictation_segments(video_id);

-- RLS: read-only cho mọi user (không cần login để làm bài dictation)
alter table dictation_videos  enable row level security;
alter table dictation_segments enable row level security;

create policy "public read dictation_videos"
  on dictation_videos for select using (true);

create policy "public read dictation_segments"
  on dictation_segments for select using (true);

-- Chỉ service role mới được insert/update (script admin)
