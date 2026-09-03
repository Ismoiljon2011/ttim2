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

  const filteredNavItems = settings?.library_enabled === false
    ? navItems.filter((item) => item.url !== '/library')
    : navItems;

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
