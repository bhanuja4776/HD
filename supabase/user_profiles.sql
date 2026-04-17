create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  age integer not null,
  monthly_income numeric not null,
  occupation text not null,
  membership_status text not null default 'free' check (membership_status in ('free', 'premium')),
  created_at timestamptz not null default now()
);

alter table public.user_profiles
  add column if not exists membership_status text not null default 'free';

create unique index if not exists user_profiles_user_id_idx
  on public.user_profiles (user_id);

alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
  on public.user_profiles
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
