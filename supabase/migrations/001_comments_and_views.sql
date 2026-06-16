-- Run this in Supabase SQL Editor (after schema.sql)

-- 1. Add view counter to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS views bigint NOT NULL DEFAULT 0;

-- 2. Atomic view increment function (prevents race conditions)
CREATE OR REPLACE FUNCTION increment_post_views(post_slug text)
RETURNS void AS $$
  UPDATE posts SET views = views + 1 WHERE slug = post_slug AND status = 'published';
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. Comments table
CREATE TABLE IF NOT EXISTS comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug   text NOT NULL REFERENCES posts(slug) ON DELETE CASCADE,
  author_name text NOT NULL,
  content     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 4. RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Public can read comments"
  ON comments FOR SELECT USING (true);

-- Anyone can post a comment
CREATE POLICY "Anyone can post a comment"
  ON comments FOR INSERT WITH CHECK (true);

-- Only authenticated admin can delete comments
CREATE POLICY "Authenticated can delete comments"
  ON comments FOR DELETE TO authenticated USING (true);

-- 5. Index for fast comment lookups per post
CREATE INDEX IF NOT EXISTS comments_post_slug_idx ON comments(post_slug);
