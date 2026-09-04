/*
# Storage bucket, section visibility toggles, and boolean column defaults

## 1. Storage
- Create a public `media` storage bucket for images and videos uploaded from the Admin Panel.
- Add storage policies: authenticated admins can upload/update/delete; anyone can read (public bucket).
- File size limit: 50MB to accommodate videos.

## 2. Section Visibility Toggles
- Add boolean columns to `site_settings` to control public visibility of secondary website sections.
- Core sections (Home, News, About, Contact, Search) are always visible and NOT toggled.
- Secondary sections: achievements, events, recommendations, spirituality, announcements, gallery, documents, leadership, teachers, programs, admission.
- All default to `true` so existing sections remain visible after migration.
- `library_enabled` already exists from migration 003.

## 3. Boolean Column Defaults
- Set `DEFAULT false` on all `is_published` and `is_active` columns that currently have no default.
- This ensures new rows always have a concrete boolean value instead of NULL.
- Existing NULL values are updated to `false` for consistency.

## 4. Security
- Storage policies restrict writes to authenticated users only.
- Public reads are allowed via the bucket being public + SELECT policy.
- No changes to existing table RLS policies.
*/

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/ogg',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ============ STORAGE POLICIES ============
-- Public can read (view) objects in the media bucket
DROP POLICY IF EXISTS "media_public_read" ON storage.objects;
CREATE POLICY "media_public_read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');

-- Authenticated users can upload to the media bucket
DROP POLICY IF EXISTS "media_authenticated_insert" ON storage.objects;
CREATE POLICY "media_authenticated_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Authenticated users can update/replace objects in the media bucket
DROP POLICY IF EXISTS "media_authenticated_update" ON storage.objects;
CREATE POLICY "media_authenticated_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');

-- Authenticated users can delete objects in the media bucket
DROP POLICY IF EXISTS "media_authenticated_delete" ON storage.objects;
CREATE POLICY "media_authenticated_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- ============ SECTION VISIBILITY TOGGLES ============
-- Add visibility columns to site_settings for secondary sections
-- All default to true so existing sections stay visible
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'achievements_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN achievements_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'events_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN events_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'recommendations_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN recommendations_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'spirituality_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN spirituality_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'announcements_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN announcements_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'gallery_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN gallery_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'documents_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN documents_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'leadership_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN leadership_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'teachers_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN teachers_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'programs_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN programs_enabled boolean NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'admission_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN admission_enabled boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- ============ BOOLEAN COLUMN DEFAULTS ============
-- Set DEFAULT false on is_published / is_active columns that lack a default
-- This ensures new rows get a concrete boolean instead of NULL

DO $$
BEGIN
  -- hero_slides.is_active
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_slides' AND column_name = 'is_active' AND column_default IS NOT NULL) THEN
    ALTER TABLE hero_slides ALTER COLUMN is_active SET DEFAULT false;
  END IF;

  -- programs.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'programs' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE programs ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- news_articles.is_featured
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'news_articles' AND column_name = 'is_featured' AND column_default IS NOT NULL) THEN
    ALTER TABLE news_articles ALTER COLUMN is_featured SET DEFAULT false;
  END IF;

  -- gallery_albums.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_albums' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE gallery_albums ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- spirituality_articles (no is_published, uses status)
  -- recommendations.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE recommendations ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- library_items.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'library_items' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE library_items ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- leadership.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leadership' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE leadership ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- teachers.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE teachers ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- achievements.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'achievements' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE achievements ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- events.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE events ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- documents.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE documents ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- announcements.is_published
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'announcements' AND column_name = 'is_published' AND column_default IS NOT NULL) THEN
    ALTER TABLE announcements ALTER COLUMN is_published SET DEFAULT false;
  END IF;

  -- navigation_items.is_active
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'navigation_items' AND column_name = 'is_active' AND column_default IS NOT NULL) THEN
    ALTER TABLE navigation_items ALTER COLUMN is_active SET DEFAULT false;
  END IF;

  -- admin_profiles.is_active
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_profiles' AND column_name = 'is_active' AND column_default IS NOT NULL) THEN
    ALTER TABLE admin_profiles ALTER COLUMN is_active SET DEFAULT true;
  END IF;

  -- contact_messages.is_read
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'is_read' AND column_default IS NOT NULL) THEN
    ALTER TABLE contact_messages ALTER COLUMN is_read SET DEFAULT false;
  END IF;

  -- site_settings.announcement_bar_visible
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'announcement_bar_visible' AND column_default IS NOT NULL) THEN
    ALTER TABLE site_settings ALTER COLUMN announcement_bar_visible SET DEFAULT true;
  END IF;
END $$;

-- Backfill any existing NULL boolean values to false
UPDATE hero_slides SET is_active = false WHERE is_active IS NULL;
UPDATE programs SET is_published = false WHERE is_published IS NULL;
UPDATE news_articles SET is_featured = false WHERE is_featured IS NULL;
UPDATE gallery_albums SET is_published = false WHERE is_published IS NULL;
UPDATE recommendations SET is_published = false WHERE is_published IS NULL;
UPDATE library_items SET is_published = false WHERE is_published IS NULL;
UPDATE leadership SET is_published = false WHERE is_published IS NULL;
UPDATE teachers SET is_published = false WHERE is_published IS NULL;
UPDATE achievements SET is_published = false WHERE is_published IS NULL;
UPDATE events SET is_published = false WHERE is_published IS NULL;
UPDATE documents SET is_published = false WHERE is_published IS NULL;
UPDATE announcements SET is_published = false WHERE is_published IS NULL;
UPDATE navigation_items SET is_active = false WHERE is_active IS NULL;
UPDATE contact_messages SET is_read = false WHERE is_read IS NULL;
