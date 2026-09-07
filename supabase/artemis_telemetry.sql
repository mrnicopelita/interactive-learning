-- Run this in the Supabase SQL editor for your project.
-- Enables real-time cross-device sync for the Operation Artemis mission store,
-- so Mission Control updates live as engineers submit telemetry.

create table if not exists public.artemis_telemetry (
  game_key text primary key,
  store jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.artemis_telemetry enable row level security;

create policy "Anyone can read artemis telemetry"
  on public.artemis_telemetry
  for select
  using (true);

create policy "Anyone can insert artemis telemetry"
  on public.artemis_telemetry
  for insert
  with check (true);

create policy "Anyone can update artemis telemetry"
  on public.artemis_telemetry
  for update
  using (true)
  with check (true);

-- Enable Supabase Realtime for this table (idempotent).
do $$
begin
  alter publication supabase_realtime add table public.artemis_telemetry;
exception when duplicate_object then
  null;
end $$;