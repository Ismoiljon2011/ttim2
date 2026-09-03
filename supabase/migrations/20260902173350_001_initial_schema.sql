/*
# TTIM.UZ — Initial Schema

## Overview
Creates the complete database schema for the To'raqo'rg'on District Specialized School platform.
Public users need no accounts. Only admin users authenticate via Supabase Auth.
Public content is readable by anon; writes require authenticated admin.

## Tables
site_settings, navigation_items, footer_links, announcements, hero_slides,
statistics, about_sections, programs, news_categories, news_articles,
gallery_albums, gallery_images, spirituality_articles, recommendations,
library_items, leadership, teachers, achievements, events, documents,
admission_info, contact_messages, admin_profiles, activity_logs, pages

## Security
- Content tables: SELECT open to anon+authenticated; writes authenticated only
- contact_messages: INSERT open to anon (public form); SELECT/UPDATE/DELETE authenticated only
- admin_profiles, activity_logs: authenticated only
- RLS enabled on every table
*/

-- ============ SITE SETTINGS ============
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL DEFAULT 'To''raqo''rg''on tuman ixtisoslashtirilgan maktabi',
  school_short_name text NOT NULL DEFAULT 'TTIM',
  logo_url text,
  favicon_url text,
  description text DEFAULT 'To''raqo''rg''on tuman ixtisoslashtirilgan maktabi — bilim, ma''naviyat va taraqqiyot maskani.',
  address text DEFAULT 'To''raqo''rg''on tumani, Samarqand viloyati, O''zbekiston',
  phone text DEFAULT '+998 00 000 00 00',
  email text DEFAULT 'info@ttim.uz',
  working_hours text DEFAULT 'Dushanba–Shanba, 08:00–17:00',
  map_embed_url text,
  seo_title text DEFAULT 'TTIM — Ixtisoslashtirilgan Maktab',
  seo_description text DEFAULT 'To''raqo''rg''on tuman ixtisoslashtirilgan maktabining rasmiy web sayti.',
  seo_keywords text DEFAULT 'maktab, ixtisoslashtirilgan, ttim, toraqorgon, samarqand',
  og_image_url text,
  announcement_bar_text text,
  announcement_bar_link text,
  announcement_bar_visible boolean DEFAULT true,
  announcement_start_date date,
  announcement_end_date date,
  facebook_url text,
  instagram_url text,
  telegram_url text,
  youtube_url text,
  footer_description text DEFAULT 'To''raqo''rg''on tuman ixtisoslashtirilgan maktabi — bilim, ma''naviyat va taraqqiyot maskani.',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_site_settings" ON site_settings;
CREATE POLICY "admin_write_site_settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_site_settings" ON site_settings;
CREATE POLICY "admin_delete_site_settings" ON site_settings FOR DELETE TO authenticated USING (true);

-- ============ NAVIGATION ITEMS ============
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  parent_id uuid REFERENCES navigation_items(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_nav" ON navigation_items;
CREATE POLICY "public_read_nav" ON navigation_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_nav" ON navigation_items;
CREATE POLICY "admin_insert_nav" ON navigation_items FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_nav" ON navigation_items;
CREATE POLICY "admin_update_nav" ON navigation_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_nav" ON navigation_items;
CREATE POLICY "admin_delete_nav" ON navigation_items FOR DELETE TO authenticated USING (true);

-- ============ FOOTER LINKS ============
CREATE TABLE IF NOT EXISTS footer_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL DEFAULT 'main',
  label text NOT NULL,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_footer" ON footer_links;
CREATE POLICY "public_read_footer" ON footer_links FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_footer" ON footer_links;
CREATE POLICY "admin_insert_footer" ON footer_links FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_footer" ON footer_links;
CREATE POLICY "admin_update_footer" ON footer_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_footer" ON footer_links;
CREATE POLICY "admin_delete_footer" ON footer_links FOR DELETE TO authenticated USING (true);

-- ============ ANNOUNCEMENTS ============
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  priority text NOT NULL DEFAULT 'normal',
  link text,
  is_published boolean DEFAULT true,
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_announcements" ON announcements;
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_announcements" ON announcements;
CREATE POLICY "admin_insert_announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_announcements" ON announcements;
CREATE POLICY "admin_update_announcements" ON announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_announcements" ON announcements;
CREATE POLICY "admin_delete_announcements" ON announcements FOR DELETE TO authenticated USING (true);

-- ============ HERO SLIDES ============
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text NOT NULL,
  primary_cta_label text,
  primary_cta_link text,
  secondary_cta_label text,
  secondary_cta_link text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_hero" ON hero_slides;
CREATE POLICY "public_read_hero" ON hero_slides FOR SELECT TO anon, authenticated USING (is_active = true);
DROP POLICY IF EXISTS "admin_insert_hero" ON hero_slides;
CREATE POLICY "admin_insert_hero" ON hero_slides FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_hero" ON hero_slides;
CREATE POLICY "admin_update_hero" ON hero_slides FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_hero" ON hero_slides;
CREATE POLICY "admin_delete_hero" ON hero_slides FOR DELETE TO authenticated USING (true);

-- ============ STATISTICS ============
CREATE TABLE IF NOT EXISTS statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value int NOT NULL DEFAULT 0,
  suffix text DEFAULT '+',
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_stats" ON statistics;
CREATE POLICY "public_read_stats" ON statistics FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_stats" ON statistics;
CREATE POLICY "admin_insert_stats" ON statistics FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_stats" ON statistics;
CREATE POLICY "admin_update_stats" ON statistics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_stats" ON statistics;
CREATE POLICY "admin_delete_stats" ON statistics FOR DELETE TO authenticated USING (true);

-- ============ ABOUT SECTIONS ============
CREATE TABLE IF NOT EXISTS about_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text NOT NULL,
  content text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_about" ON about_sections;
CREATE POLICY "public_read_about" ON about_sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_about" ON about_sections;
CREATE POLICY "admin_insert_about" ON about_sections FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_about" ON about_sections;
CREATE POLICY "admin_update_about" ON about_sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_about" ON about_sections;
CREATE POLICY "admin_delete_about" ON about_sections FOR DELETE TO authenticated USING (true);

-- ============ PROGRAMS ============
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  teacher_name text,
  additional_info text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_programs" ON programs;
CREATE POLICY "public_read_programs" ON programs FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_programs" ON programs;
CREATE POLICY "admin_insert_programs" ON programs FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_programs" ON programs;
CREATE POLICY "admin_update_programs" ON programs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_programs" ON programs;
CREATE POLICY "admin_delete_programs" ON programs FOR DELETE TO authenticated USING (true);

-- ============ NEWS CATEGORIES ============
CREATE TABLE IF NOT EXISTS news_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_news_cat" ON news_categories;
CREATE POLICY "public_read_news_cat" ON news_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_news_cat" ON news_categories;
CREATE POLICY "admin_insert_news_cat" ON news_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_news_cat" ON news_categories;
CREATE POLICY "admin_update_news_cat" ON news_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_news_cat" ON news_categories;
CREATE POLICY "admin_delete_news_cat" ON news_categories FOR DELETE TO authenticated USING (true);

-- ============ NEWS ARTICLES ============
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  cover_image_url text,
  excerpt text,
  content text NOT NULL,
  author_name text DEFAULT 'TTIM',
  category_id uuid REFERENCES news_categories(id) ON DELETE SET NULL,
  tags text[],
  status text NOT NULL DEFAULT 'published',
  view_count int NOT NULL DEFAULT 0,
  is_featured boolean DEFAULT false,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_news" ON news_articles;
CREATE POLICY "public_read_news" ON news_articles FOR SELECT TO anon, authenticated USING (status = 'published' AND published_at <= now());
DROP POLICY IF EXISTS "admin_read_all_news" ON news_articles;
CREATE POLICY "admin_read_all_news" ON news_articles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_news" ON news_articles;
CREATE POLICY "admin_insert_news" ON news_articles FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_news" ON news_articles;
CREATE POLICY "admin_update_news" ON news_articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_news" ON news_articles;
CREATE POLICY "admin_delete_news" ON news_articles FOR DELETE TO authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news_articles(is_featured) WHERE is_featured = true;

-- ============ GALLERY ALBUMS ============
CREATE TABLE IF NOT EXISTS gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_image_url text,
  category text DEFAULT 'School Life',
  album_date date DEFAULT CURRENT_DATE,
  is_published boolean DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_albums" ON gallery_albums;
CREATE POLICY "public_read_albums" ON gallery_albums FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_albums" ON gallery_albums;
CREATE POLICY "admin_insert_albums" ON gallery_albums FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_albums" ON gallery_albums;
CREATE POLICY "admin_update_albums" ON gallery_albums FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_albums" ON gallery_albums;
CREATE POLICY "admin_delete_albums" ON gallery_albums FOR DELETE TO authenticated USING (true);

-- ============ GALLERY IMAGES ============
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_gallery_img" ON gallery_images;
CREATE POLICY "public_read_gallery_img" ON gallery_images FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_gallery_img" ON gallery_images;
CREATE POLICY "admin_insert_gallery_img" ON gallery_images FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_gallery_img" ON gallery_images;
CREATE POLICY "admin_update_gallery_img" ON gallery_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_gallery_img" ON gallery_images;
CREATE POLICY "admin_delete_gallery_img" ON gallery_images FOR DELETE TO authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_gallery_images_album ON gallery_images(album_id, sort_order);

-- ============ SPIRITUALITY ARTICLES ============
CREATE TABLE IF NOT EXISTS spirituality_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  category text,
  cover_image_url text,
  video_url text,
  status text NOT NULL DEFAULT 'published',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE spirituality_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_spirituality" ON spirituality_articles;
CREATE POLICY "public_read_spirituality" ON spirituality_articles FOR SELECT TO anon, authenticated USING (status = 'published' AND published_at <= now());
DROP POLICY IF EXISTS "admin_read_all_spirituality" ON spirituality_articles;
CREATE POLICY "admin_read_all_spirituality" ON spirituality_articles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_spirituality" ON spirituality_articles;
CREATE POLICY "admin_insert_spirituality" ON spirituality_articles FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_spirituality" ON spirituality_articles;
CREATE POLICY "admin_update_spirituality" ON spirituality_articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_spirituality" ON spirituality_articles;
CREATE POLICY "admin_delete_spirituality" ON spirituality_articles FOR DELETE TO authenticated USING (true);

-- ============ RECOMMENDATIONS ============
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  external_link text,
  category text NOT NULL DEFAULT 'Books',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_recs" ON recommendations;
CREATE POLICY "public_read_recs" ON recommendations FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_recs" ON recommendations;
CREATE POLICY "admin_insert_recs" ON recommendations FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_recs" ON recommendations;
CREATE POLICY "admin_update_recs" ON recommendations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_recs" ON recommendations;
CREATE POLICY "admin_delete_recs" ON recommendations FOR DELETE TO authenticated USING (true);

-- ============ LIBRARY ITEMS ============
CREATE TABLE IF NOT EXISTS library_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text,
  category text,
  description text,
  cover_image_url text,
  file_url text,
  published_date date,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_library" ON library_items;
CREATE POLICY "public_read_library" ON library_items FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_library" ON library_items;
CREATE POLICY "admin_insert_library" ON library_items FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_library" ON library_items;
CREATE POLICY "admin_update_library" ON library_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_library" ON library_items;
CREATE POLICY "admin_delete_library" ON library_items FOR DELETE TO authenticated USING (true);

-- ============ LEADERSHIP ============
CREATE TABLE IF NOT EXISTS leadership (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  position text NOT NULL,
  photo_url text,
  biography text,
  phone text,
  email text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_leadership" ON leadership;
CREATE POLICY "public_read_leadership" ON leadership FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_leadership" ON leadership;
CREATE POLICY "admin_insert_leadership" ON leadership FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_leadership" ON leadership;
CREATE POLICY "admin_update_leadership" ON leadership FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_leadership" ON leadership;
CREATE POLICY "admin_delete_leadership" ON leadership FOR DELETE TO authenticated USING (true);

-- ============ TEACHERS ============
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  subject text NOT NULL,
  position text DEFAULT 'O''qituvchi',
  photo_url text,
  experience_years int,
  biography text,
  achievements text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_teachers" ON teachers;
CREATE POLICY "public_read_teachers" ON teachers FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_teachers" ON teachers;
CREATE POLICY "admin_insert_teachers" ON teachers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_teachers" ON teachers;
CREATE POLICY "admin_update_teachers" ON teachers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_teachers" ON teachers;
CREATE POLICY "admin_delete_teachers" ON teachers FOR DELETE TO authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_teachers_subject ON teachers(subject);

-- ============ ACHIEVEMENTS ============
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  student_or_team text,
  year int,
  result text,
  category text NOT NULL DEFAULT 'Academic',
  image_url text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_achievements" ON achievements;
CREATE POLICY "public_read_achievements" ON achievements FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_achievements" ON achievements;
CREATE POLICY "admin_insert_achievements" ON achievements FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_achievements" ON achievements;
CREATE POLICY "admin_update_achievements" ON achievements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_achievements" ON achievements;
CREATE POLICY "admin_delete_achievements" ON achievements FOR DELETE TO authenticated USING (true);

-- ============ EVENTS ============
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL DEFAULT CURRENT_DATE,
  event_time text,
  location text,
  image_url text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_events" ON events;
CREATE POLICY "public_read_events" ON events FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_events" ON events;
CREATE POLICY "admin_insert_events" ON events FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_events" ON events;
CREATE POLICY "admin_update_events" ON events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_events" ON events;
CREATE POLICY "admin_delete_events" ON events FOR DELETE TO authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- ============ DOCUMENTS ============
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,
  description text,
  file_url text NOT NULL,
  document_date date DEFAULT CURRENT_DATE,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_documents" ON documents;
CREATE POLICY "public_read_documents" ON documents FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_documents" ON documents;
CREATE POLICY "admin_insert_documents" ON documents FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_documents" ON documents;
CREATE POLICY "admin_update_documents" ON documents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_documents" ON documents;
CREATE POLICY "admin_delete_documents" ON documents FOR DELETE TO authenticated USING (true);

-- ============ ADMISSION INFO ============
CREATE TABLE IF NOT EXISTS admission_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text NOT NULL,
  content text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE admission_info ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_admission" ON admission_info;
CREATE POLICY "public_read_admission" ON admission_info FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_admission" ON admission_info;
CREATE POLICY "admin_insert_admission" ON admission_info FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_admission" ON admission_info;
CREATE POLICY "admin_update_admission" ON admission_info FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_admission" ON admission_info;
CREATE POLICY "admin_delete_admission" ON admission_info FOR DELETE TO authenticated USING (true);

-- ============ CONTACT MESSAGES ============
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_insert_contact" ON contact_messages;
CREATE POLICY "public_insert_contact" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_read_contact" ON contact_messages;
CREATE POLICY "admin_read_contact" ON contact_messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_update_contact" ON contact_messages;
CREATE POLICY "admin_update_contact" ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_contact" ON contact_messages;
CREATE POLICY "admin_delete_contact" ON contact_messages FOR DELETE TO authenticated USING (true);

-- ============ ADMIN PROFILES ============
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  full_name text,
  role text NOT NULL DEFAULT 'editor',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_read_profiles" ON admin_profiles;
CREATE POLICY "admin_read_profiles" ON admin_profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_profiles" ON admin_profiles;
CREATE POLICY "admin_insert_profiles" ON admin_profiles FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_profiles" ON admin_profiles;
CREATE POLICY "admin_update_profiles" ON admin_profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_profiles" ON admin_profiles;
CREATE POLICY "admin_delete_profiles" ON admin_profiles FOR DELETE TO authenticated USING (true);

-- ============ ACTIVITY LOGS ============
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_username text,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  details text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_read_logs" ON activity_logs;
CREATE POLICY "admin_read_logs" ON activity_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_logs" ON activity_logs;
CREATE POLICY "admin_insert_logs" ON activity_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_logs_created ON activity_logs(created_at DESC);

-- ============ PAGES ============
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  seo_title text,
  seo_description text,
  og_image_url text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_pages" ON pages;
CREATE POLICY "public_read_pages" ON pages FOR SELECT TO anon, authenticated USING (is_published = true);
DROP POLICY IF EXISTS "admin_insert_pages" ON pages;
CREATE POLICY "admin_insert_pages" ON pages FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_update_pages" ON pages;
CREATE POLICY "admin_update_pages" ON pages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_pages" ON pages;
CREATE POLICY "admin_delete_pages" ON pages FOR DELETE TO authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_nav_sort ON navigation_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_footer_sort ON footer_links(sort_order);
CREATE INDEX IF NOT EXISTS idx_stats_sort ON statistics(sort_order);
CREATE INDEX IF NOT EXISTS idx_programs_sort ON programs(sort_order);
CREATE INDEX IF NOT EXISTS idx_albums_sort ON gallery_albums(sort_order);
CREATE INDEX IF NOT EXISTS idx_recs_sort ON recommendations(sort_order);
CREATE INDEX IF NOT EXISTS idx_library_sort ON library_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_leadership_sort ON leadership(sort_order);
CREATE INDEX IF NOT EXISTS idx_teachers_sort ON teachers(sort_order);
CREATE INDEX IF NOT EXISTS idx_achievements_sort ON achievements(sort_order);
CREATE INDEX IF NOT EXISTS idx_documents_sort ON documents(sort_order);
