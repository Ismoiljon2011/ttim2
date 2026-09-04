import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import { useSiteData } from '@/lib/useSiteData';

export default function PublicLayout() {
  const { settings, navItems, footerLinks, loading } = useSiteData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-700 animate-spin" />
      </div>
    );
  }

  const sectionToggleMap: Record<string, keyof typeof settings | undefined> = {
    '/library': 'library_enabled',
    '/achievements': 'achievements_enabled',
    '/events': 'events_enabled',
    '/recommendations': 'recommendations_enabled',
    '/spirituality': 'spirituality_enabled',
    '/announcements': 'announcements_enabled',
    '/gallery': 'gallery_enabled',
    '/documents': 'documents_enabled',
    '/leadership': 'leadership_enabled',
    '/teachers': 'teachers_enabled',
    '/programs': 'programs_enabled',
    '/admission': 'admission_enabled',
  };
  const filteredNavItems = navItems.filter((item) => {
    const toggleKey = sectionToggleMap[item.url];
    if (toggleKey && settings?.[toggleKey] === false) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <AnnouncementBar settings={settings} />
      <Header settings={settings} navItems={filteredNavItems} />
      <main className="flex-1">
        <Outlet context={{ settings, navItems: filteredNavItems, footerLinks }} />
      </main>
      <Footer settings={settings} footerLinks={footerLinks} />
    </div>
  );
}
