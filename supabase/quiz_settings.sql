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
  ('exam', true),
  ('exam-3', true),
  ('exam-4', true),
  ('exam-5', true),
  ('exam-6', true),
  ('exam-smp', true)
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
