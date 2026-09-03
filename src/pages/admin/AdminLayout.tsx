import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { hasPermission, PermissionAction } from '@/lib/permissions';
import { ROLE_LABELS } from '@/lib/permissions';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FileText, Newspaper, Tag, Bell, Calendar,
  Users, GraduationCap, Image, BookOpen, File, Trophy, Award,
  Mail, Settings, Shield, LogOut, Menu, X, ChevronDown, Lock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  permission: PermissionAction;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Dashboard',
    items: [{ label: 'Dashboard', path: '/manage', icon: LayoutDashboard, permission: 'view_dashboard' }],
  },
  {
    label: 'Kontent',
    items: [
      { label: 'Yangiliklar', path: '/manage/news', icon: Newspaper, permission: 'manage_news' },
      { label: 'Kategoriyalar', path: '/manage/categories', icon: Tag, permission: 'manage_categories' },
      { label: 'E\'lonlar', path: '/manage/announcements', icon: Bell, permission: 'manage_announcements' },
      { label: 'Tadbirlar', path: '/manage/events', icon: Calendar, permission: 'manage_events' },
    ],
  },
  {
    label: 'Odamlar',
    items: [
      { label: 'Rahbariyat', path: '/manage/leadership', icon: Users, permission: 'manage_leadership' },
      { label: 'O\'qituvchilar', path: '/manage/teachers', icon: GraduationCap, permission: 'manage_teachers' },
    ],
  },
  {
    label: 'Media',
    items: [
      { label: 'Galereya', path: '/manage/gallery', icon: Image, permission: 'manage_gallery' },
      { label: 'Kutubxona', path: '/manage/library', icon: BookOpen, permission: 'manage_library' },
      { label: 'Hujjatlar', path: '/manage/documents', icon: File, permission: 'manage_documents' },
    ],
  },
  {
    label: 'Maktab',
    items: [
      { label: 'Dasturlar', path: '/manage/programs', icon: GraduationCap, permission: 'manage_programs' },
      { label: 'Yutuqlar', path: '/manage/achievements', icon: Trophy, permission: 'manage_achievements' },
      { label: 'Qabul', path: '/manage/admission', icon: Award, permission: 'manage_admission' },
    ],
  },
  {
    label: 'Muloqot',
    items: [{ label: 'Xabarlar', path: '/manage/messages', icon: Mail, permission: 'manage_messages' }],
  },
  {
    label: 'Sozlamalar',
    items: [
      { label: 'Asosiy', path: '/manage/settings', icon: Settings, permission: 'manage_settings' },
      { label: 'Hero', path: '/manage/hero', icon: Image, permission: 'manage_hero' },
      { label: 'Statistika', path: '/manage/statistics', icon: LayoutDashboard, permission: 'manage_statistics' },
      { label: 'Navigatsiya', path: '/manage/navigation', icon: Menu, permission: 'manage_navigation' },
      { label: 'Raqamli ma\'naviyat', path: '/manage/spirituality', icon: FileText, permission: 'manage_spirituality' },
      { label: 'Tavsiyalar', path: '/manage/recommendations', icon: BookOpen, permission: 'manage_recommendations' },
      { label: 'Maktab haqida', path: '/manage/about', icon: FileText, permission: 'manage_about' },
    ],
  },
  {
    label: 'Xavfsizlik',
    items: [
      { label: 'Administratorlar', path: '/manage/admins', icon: Shield, permission: 'manage_admins' },
      { label: 'Rollar va huquqlar', path: '/manage/roles', icon: Lock, permission: 'manage_roles' },
      { label: 'Faoliyat jurnali', path: '/manage/logs', icon: FileText, permission: 'manage_logs' },
    ],
  },
];

function PermissionGuard({ children, permission }: { children: React.ReactNode; permission: PermissionAction }) {
  const { profile } = useAuth();
  if (!hasPermission(profile?.role, permission)) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Lock className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">Sizda bu sahifaga kirish huquqi yo'q</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export { PermissionGuard };

export default function AdminLayout() {
  const { session, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate('/manage/login');
      return;
    }
    if (!profile) {
      const timer = setTimeout(() => {
        navigate('/manage/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [session, profile, loading, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading || (session && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-700 animate-spin" />
          <p className="text-sm text-slate-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!session || !profile) return null;

  const isActive = (path: string) => path === '/manage' ? location.pathname === '/manage' : location.pathname.startsWith(path);

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(profile.role, item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <Link to="/manage" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-white">TTIM Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="overflow-y-auto h-[calc(100%-4rem)] py-4 px-3 space-y-6">
          {visibleGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{group.label}</div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive(item.path)
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 dark:text-slate-300">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
              Saytni ko'rish
            </Link>
            <div className="relative">
              <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{profile.full_name || profile.username}</div>
                  <div className="text-xs text-slate-500">{ROLE_LABELS[profile.role]}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {userMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-20">
                    <button
                      onClick={async () => { await signOut(); navigate('/manage/login'); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <LogOut className="h-4 w-4" /> Chiqish
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
