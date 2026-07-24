-- Credentialing Tracker — Supabase schema (multi-practice version)
-- Run this once in your Supabase project's SQL Editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
-- One row per team member, auto-created on signup. role = 'admin' | 'member'.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'member' check (role in ('admin','member')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are viewable by any authenticated user"
  on profiles for select
  using (auth.role() = 'authenticated');

create policy "users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- app_settings ----------
-- Single row holding tracker-wide branding, e.g. the app name shown in the header.
-- Only admins can change it.
create table if not exists app_settings (
  id int primary key default 1 check (id = 1),
  app_name text not null default 'Credentialing Tracker',
  updated_at timestamptz not null default now()
);

insert into app_settings (id, app_name) values (1, 'Credentialing Tracker')
  on conflict (id) do nothing;

alter table app_settings enable row level security;

create policy "app settings are viewable by any authenticated user"
  on app_settings for select
  using (auth.role() = 'authenticated');

create policy "only admins can change app settings"
  on app_settings for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ---------- practices ----------
-- Each practice/client group you manage credentialing for.
create table if not exists practices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  npi text,
  tax_id text,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

alter table practices enable row level security;

create policy "team can read practices"
  on practices for select
  using (auth.role() = 'authenticated');

create policy "team can add practices"
  on practices for insert
  with check (auth.role() = 'authenticated');

create policy "team can update practices"
  on practices for update
  using (auth.role() = 'authenticated');

create policy "only admins can delete practices"
  on practices for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ---------- entries (payor applications) ----------
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references practices(id) on delete cascade,
  payor text not null,
  provider_name text not null default 'Group',
  status text not null default 'Not Started' check (status in ('Not Started','Submitted','In Review','Approved','Denied')),
  last_update date,
  follow_up date,
  phone text,
  note text,
  created_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);

create index if not exists entries_practice_idx on entries(practice_id);

alter table entries enable row level security;

create policy "team can read entries"
  on entries for select
  using (auth.role() = 'authenticated');

create policy "team can insert entries"
  on entries for insert
  with check (auth.role() = 'authenticated');

create policy "team can update entries"
  on entries for update
  using (auth.role() = 'authenticated');

create policy "only admins can delete entries"
  on entries for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists entries_touch_updated_at on entries;
create trigger entries_touch_updated_at
  before update on entries
  for each row execute procedure public.touch_updated_at();

-- ---------- documents (licenses / expirations) ----------
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  practice_id uuid not null references practices(id) on delete cascade,
  name text not null,
  provider_name text not null default 'Group',
  expiration date,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists documents_practice_idx on documents(practice_id);

alter table documents enable row level security;

create policy "team can read documents"
  on documents for select
  using (auth.role() = 'authenticated');

create policy "team can insert documents"
  on documents for insert
  with check (auth.role() = 'authenticated');

create policy "team can update documents"
  on documents for update
  using (auth.role() = 'authenticated');

create policy "only admins can delete documents"
  on documents for delete
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ---------- realtime ----------
alter publication supabase_realtime add table entries;
alter publication supabase_realtime add table documents;
alter publication supabase_realtime add table practices;
alter publication supabase_realtime add table app_settings;
