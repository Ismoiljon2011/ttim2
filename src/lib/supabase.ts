import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'ttim-auth-token',
    flowType: 'implicit',
  },
});

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'librarian' | 'moderator';

export interface AdminProfile {
  id: string;
  user_id: string;
  username: string;
  full_name: string | null;
  role: AdminRole;
  is_active: boolean;
}

export interface SiteSettings {
  id: string;
  school_name: string;
  school_short_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  working_hours: string | null;
  map_embed_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  og_image_url: string | null;
  announcement_bar_text: string | null;
  announcement_bar_link: string | null;
  announcement_bar_visible: boolean;
  announcement_start_date: string | null;
  announcement_end_date: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  telegram_url: string | null;
  youtube_url: string | null;
  footer_description: string | null;
  library_enabled: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface FooterLink {
  id: string;
  section: string;
  label: string;
  url: string;
  sort_order: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string | null;
  priority: string;
  link: string | null;
  is_published: boolean;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  primary_cta_label: string | null;
  primary_cta_link: string | null;
  secondary_cta_label: string | null;
  secondary_cta_link: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Statistic {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string | null;
  sort_order: number;
}

export interface AboutSection {
  id: string;
  section_key: string;
  title: string;
  content: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface Program {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  teacher_name: string | null;
  additional_info: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  excerpt: string | null;
  content: string;
  author_name: string;
  category_id: string | null;
  tags: string[] | null;
  status: string;
  view_count: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  category?: NewsCategory | null;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  category: string;
  album_date: string;
  is_published: boolean;
  sort_order: number;
}

export interface GalleryImage {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface SpiritualityArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  status: string;
  published_at: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  external_link: string | null;
  category: string;
  sort_order: number;
  is_published: boolean;
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  description: string | null;
  cover_image_url: string | null;
  file_url: string | null;
  published_date: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface Leadership {
  id: string;
  full_name: string;
  position: string;
  photo_url: string | null;
  biography: string | null;
  phone: string | null;
  email: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface Teacher {
  id: string;
  full_name: string;
  subject: string;
  position: string;
  photo_url: string | null;
  experience_years: number | null;
  biography: string | null;
  achievements: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  student_or_team: string | null;
  year: number | null;
  result: string | null;
  category: string;
  image_url: string | null;
  description: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  image_url: string | null;
  is_published: boolean;
}

export interface Document {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  file_url: string;
  document_date: string;
  sort_order: number;
  is_published: boolean;
}

export interface AdmissionInfo {
  id: string;
  section_key: string;
  title: string;
  content: string | null;
  sort_order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  admin_id: string | null;
  admin_username: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: string | null;
  created_at: string;
}
