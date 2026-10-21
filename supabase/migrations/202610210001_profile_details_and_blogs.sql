alter table public.profiles
  add column if not exists bio text check (bio is null or char_length(bio) <= 240),
  add column if not exists home_base text check (home_base is null or char_length(home_base) <= 80),
  add column if not exists travel_style text check (travel_style is null or char_length(travel_style) <= 80);

alter table public.posts
  drop constraint if exists posts_category_check;

alter table public.posts
  add constraint posts_category_check
  check (category in ('experience', 'destination', 'gear', 'photo', 'idea', 'blog'));
