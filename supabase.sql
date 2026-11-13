-- Run this once in Supabase: SQL Editor > New query > paste > Run.
-- BEFORE running, replace YOUR_EMAIL@example.com (appears twice) with the email you will log in with.

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  domain text not null,
  tools text,
  link text not null,
  description text,
  image text,
  featured boolean default true,
  created_at timestamptz default now()
);

alter table projects enable row level security;

-- Everyone (your visitors) can only READ projects
create policy "public can read projects"
  on projects for select
  using (true);

-- Only you (logged in with your email) can add, edit and delete
create policy "owner can write projects"
  on projects for all
  to authenticated
  using ((auth.jwt() ->> 'email') = 'nupur.choure1@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'nupur.choure1@gmail.com');
