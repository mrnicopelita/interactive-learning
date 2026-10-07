-- Run this in the Supabase SQL editor for your project.
-- Creates the table that controls which quizzes are locked/unlocked for students.

create table if not exists public.quiz_settings (
  quiz_id text primary key,
  is_locked boolean not null default true
);

-- Seed all quizzes as locked by default
insert into public.quiz_settings (quiz_id, is_locked)
values
  ('cpu-monitor', true),
  ('berkom', true),
  ('keyboard', true),
  ('exam', true),
  ('exam-2', true),
  ('exam-3', true),
  ('exam-4', true),
  ('exam-5', true),
  ('exam-6', true),
  ('exam-smp', true),
  ('exam-smp-aug3', true),
  ('exam-smp-g8', true)
on conflict (quiz_id) do nothing;

alter table public.quiz_settings enable row level security;

create policy "Anyone can read quiz settings"
  on public.quiz_settings
  for select
  using (true);

create policy "Anyone can update quiz settings"
  on public.quiz_settings
  for update
  using (true)
  with check (true);

create policy "Anyone can insert quiz settings"
  on public.quiz_settings
  for insert
  with check (true);

-- Quiz categories table
create table if not exists public.quiz_categories (
  quiz_id text primary key,
  category_id text not null,
  updated_at timestamptz not null default now()
);

insert into public.quiz_categories (quiz_id, category_id)
values
  ('cpu-monitor', 'preschool'), ('berkom', 'preschool'), ('sinyal-lab', 'preschool'),
  ('keyboard', 'preschool'), ('typing', 'preschool'), ('artemis', 'primary'),
  ('artemis-g8', 'junior-high'), ('polisi-warna', 'preschool'), ('polisi-patroli', 'preschool'),
  ('polisi-lintasan-pov', 'preschool'), ('pesta-puzzle', 'preschool'), ('kantin-crisis', 'primary'),
  ('kelinci-lompat', 'preschool'), ('kelinci-berlari', 'preschool'), ('cyberquest', 'primary'),
  ('tik-quest', 'primary'), ('terminal-protocol', 'junior-high'), ('misi-roket-bintang', 'primary'),
  ('exam', 'quizzes'), ('exam-2', 'quizzes'), ('exam-3', 'quizzes'),
  ('exam-4', 'quizzes'), ('exam-5', 'quizzes'), ('exam-6', 'quizzes'),
  ('exam-7', 'quizzes'), ('exam-smp', 'quizzes'), ('exam-smp-aug3', 'quizzes'),
  ('exam-smp-g8', 'quizzes')
on conflict (quiz_id) do nothing;

alter table public.quiz_categories enable row level security;

create policy "Anyone can read quiz categories"
  on public.quiz_categories
  for select
  using (true);

create policy "Anyone can update quiz categories"
  on public.quiz_categories
  for update
  using (true)
  with check (true);

create policy "Anyone can insert quiz categories"
  on public.quiz_categories
  for insert
  with check (true);
