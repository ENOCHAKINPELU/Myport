-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query)

-- 1. Posts table
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

-- Keep updated_at current on every change
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on posts;
create trigger posts_set_updated_at
  before update on posts
  for each row
  execute function set_updated_at();

-- 2. Row Level Security
alter table posts enable row level security;

-- Public can read only published posts
create policy "Public can read published posts"
  on posts for select
  using (status = 'published');

-- Authenticated (owner) can read everything, including drafts
create policy "Authenticated can read all posts"
  on posts for select
  to authenticated
  using (true);

-- Authenticated (owner) can create, update, delete posts
create policy "Authenticated can insert posts"
  on posts for insert
  to authenticated
  with check (true);

create policy "Authenticated can update posts"
  on posts for update
  to authenticated
  using (true);

create policy "Authenticated can delete posts"
  on posts for delete
  to authenticated
  using (true);

-- 3. Storage bucket for cover images
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Anyone can view images in the public bucket
create policy "Public can read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- Only authenticated (owner) can upload/replace/delete images
create policy "Authenticated can upload blog images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

create policy "Authenticated can update blog images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images');

create policy "Authenticated can delete blog images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');

-- 4. Create your admin login user:
-- Go to Authentication -> Users -> Add user, and create an email/password
-- account for yourself. That account is the only one that can log into
-- blog/admin.html and manage posts.
