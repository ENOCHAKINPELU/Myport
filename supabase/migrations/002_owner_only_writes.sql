-- Run this in Supabase SQL Editor (after schema.sql and 001_comments_and_views.sql)
--
-- The original policies let ANY authenticated user create, edit and delete
-- posts, read drafts, manage images and delete comments. If email sign-ups are
-- enabled on the project, anyone could register and do the same. These
-- policies restrict all of that to the site owner's account.

-- Posts: drafts and writes are owner-only
drop policy if exists "Authenticated can read all posts" on posts;
drop policy if exists "Authenticated can insert posts" on posts;
drop policy if exists "Authenticated can update posts" on posts;
drop policy if exists "Authenticated can delete posts" on posts;

create policy "Owner can read all posts" on posts for select to authenticated
  using ((auth.jwt() ->> 'email') = 'ifeoluwaakinpelu05@gmail.com');
create policy "Owner can insert posts" on posts for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'ifeoluwaakinpelu05@gmail.com');
create policy "Owner can update posts" on posts for update to authenticated
  using ((auth.jwt() ->> 'email') = 'ifeoluwaakinpelu05@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'ifeoluwaakinpelu05@gmail.com');
create policy "Owner can delete posts" on posts for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'ifeoluwaakinpelu05@gmail.com');

-- Images: uploads and changes are owner-only (public reading is unchanged)
drop policy if exists "Authenticated can upload blog images" on storage.objects;
drop policy if exists "Authenticated can update blog images" on storage.objects;
drop policy if exists "Authenticated can delete blog images" on storage.objects;

create policy "Owner can upload blog images" on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-images' and (auth.jwt() ->> 'email') = 'ifeoluwaakinpelu05@gmail.com');
create policy "Owner can update blog images" on storage.objects for update to authenticated
  using (bucket_id = 'blog-images' and (auth.jwt() ->> 'email') = 'ifeoluwaakinpelu05@gmail.com');
create policy "Owner can delete blog images" on storage.objects for delete to authenticated
  using (bucket_id = 'blog-images' and (auth.jwt() ->> 'email') = 'ifeoluwaakinpelu05@gmail.com');

-- Comments: only the owner can delete them
drop policy if exists "Authenticated can delete comments" on comments;
create policy "Owner can delete comments" on comments for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'ifeoluwaakinpelu05@gmail.com');

-- Also recommended: Authentication -> Sign In / Providers -> Email ->
-- turn OFF "Allow new users to sign up", so no one else can create an account.
