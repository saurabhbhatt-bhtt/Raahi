create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_no_self_follow check (follower_id <> following_id)
);

create index if not exists follows_following_id_idx
  on public.follows (following_id);

alter table public.follows enable row level security;
grant select on public.follows to anon, authenticated;
grant insert, delete on public.follows to authenticated;

create policy "Follows are publicly readable"
  on public.follows for select
  using (true);

create policy "Users can follow as themselves"
  on public.follows for insert to authenticated
  with check (follower_id = (select auth.uid()));

create policy "Users can unfollow as themselves"
  on public.follows for delete to authenticated
  using (follower_id = (select auth.uid()));

create table if not exists public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (reason in ('spam', 'unsafe', 'harassment', 'misleading', 'other')),
  details text check (details is null or char_length(details) <= 500),
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

alter table public.post_reports enable row level security;
revoke all on public.post_reports from anon, authenticated;
grant insert on public.post_reports to authenticated;

create policy "Users can report posts as themselves"
  on public.post_reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));
