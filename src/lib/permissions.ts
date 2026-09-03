import { AdminRole } from './supabase';

export type PermissionAction =
  | 'view_dashboard'
  | 'manage_news'
  | 'manage_categories'
  | 'manage_announcements'
  | 'manage_events'
  | 'manage_spirituality'
  | 'manage_recommendations'
  | 'manage_leadership'
  | 'manage_teachers'
  | 'manage_gallery'
  | 'manage_library'
  | 'manage_documents'
  | 'manage_programs'
  | 'manage_achievements'
  | 'manage_admission'
  | 'manage_messages'
  | 'manage_settings'
  | 'manage_hero'
  | 'manage_statistics'
  | 'manage_navigation'
  | 'manage_about'
  | 'manage_admins'
  | 'manage_logs'
  | 'manage_roles';

const PERMISSION_MATRIX: Record<AdminRole, PermissionAction[]> = {
  super_admin: [
    'view_dashboard', 'manage_news', 'manage_categories', 'manage_announcements',
    'manage_events', 'manage_spirituality', 'manage_recommendations', 'manage_leadership',
    'manage_teachers', 'manage_gallery', 'manage_library', 'manage_documents',
    'manage_programs', 'manage_achievements', 'manage_admission', 'manage_messages',
    'manage_settings', 'manage_hero', 'manage_statistics', 'manage_navigation',
    'manage_about', 'manage_admins', 'manage_logs', 'manage_roles',
  ],
  admin: [
    'view_dashboard', 'manage_news', 'manage_categories', 'manage_announcements',
    'manage_events', 'manage_spirituality', 'manage_recommendations', 'manage_leadership',
    'manage_teachers', 'manage_gallery', 'manage_library', 'manage_documents',
    'manage_programs', 'manage_achievements', 'manage_admission', 'manage_messages',
    'manage_settings', 'manage_hero', 'manage_statistics', 'manage_navigation',
    'manage_about',
  ],
  editor: [
    'view_dashboard', 'manage_news', 'manage_categories', 'manage_announcements',
    'manage_events', 'manage_spirituality', 'manage_recommendations', 'manage_leadership',
    'manage_teachers', 'manage_gallery', 'manage_documents', 'manage_programs',
    'manage_achievements', 'manage_admission', 'manage_hero', 'manage_statistics',
    'manage_about',
  ],
  librarian: [
    'view_dashboard', 'manage_library',
  ],
  moderator: [
    'view_dashboard', 'manage_news', 'manage_announcements', 'manage_events',
    'manage_gallery', 'manage_messages', 'manage_documents',
  ],
};

export function hasPermission(role: AdminRole | undefined, action: PermissionAction): boolean {
  if (!role) return false;
  return PERMISSION_MATRIX[role]?.includes(action) ?? false;
}

export function getPermissions(role: AdminRole): PermissionAction[] {
  return PERMISSION_MATRIX[role] ?? [];
}

export const ALL_PERMISSIONS: { action: PermissionAction; label: string; group: string }[] = [
  { action: 'view_dashboard', label: 'Dashboard', group: 'Umumiy' },
  { action: 'manage_news', label: 'Yangiliklar', group: 'Kontent' },
  { action: 'manage_categories', label: 'Kategoriyalar', group: 'Kontent' },
  { action: 'manage_announcements', label: 'E\'lonlar', group: 'Kontent' },
  { action: 'manage_events', label: 'Tadbirlar', group: 'Kontent' },
  { action: 'manage_spirituality', label: 'Raqamli ma\'naviyat', group: 'Kontent' },
  { action: 'manage_recommendations', label: 'Tavsiyalar', group: 'Kontent' },
  { action: 'manage_leadership', label: 'Rahbariyat', group: 'Odamlar' },
  { action: 'manage_teachers', label: 'O\'qituvchilar', group: 'Odamlar' },
  { action: 'manage_gallery', label: 'Galereya', group: 'Media' },
  { action: 'manage_library', label: 'Kutubxona', group: 'Media' },
  { action: 'manage_documents', label: 'Hujjatlar', group: 'Media' },
  { action: 'manage_programs', label: 'Dasturlar', group: 'Maktab' },
  { action: 'manage_achievements', label: 'Yutuqlar', group: 'Maktab' },
  { action: 'manage_admission', label: 'Qabul', group: 'Maktab' },
  { action: 'manage_messages', label: 'Xabarlar', group: 'Muloqot' },
  { action: 'manage_settings', label: 'Sayt sozlamalari', group: 'Sozlamalar' },
  { action: 'manage_hero', label: 'Hero slaydlar', group: 'Sozlamalar' },
  { action: 'manage_statistics', label: 'Statistika', group: 'Sozlamalar' },
  { action: 'manage_navigation', label: 'Navigatsiya', group: 'Sozlamalar' },
  { action: 'manage_about', label: 'Maktab haqida', group: 'Sozlamalar' },
  { action: 'manage_admins', label: 'Administratorlar', group: 'Xavfsizlik' },
  { action: 'manage_logs', label: 'Faoliyat jurnali', group: 'Xavfsizlik' },
  { action: 'manage_roles', label: 'Rollar va huquqlar', group: 'Xavfsizlik' },
];

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
  librarian: 'Librarian',
  moderator: 'Moderator',
};
