import { useEffect, useState } from 'react';
import { supabase, SiteSettings, NavItem, FooterLink } from './supabase';

export function useSiteData() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [settingsRes, navRes, footerRes] = await Promise.all([
        supabase.from('site_settings').select('*').limit(1).maybeSingle(),
        supabase.from('navigation_items').select('*').order('sort_order'),
        supabase.from('footer_links').select('*').order('sort_order'),
      ]);

      if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
      if (navRes.data) setNavItems(navRes.data as NavItem[]);
      if (footerRes.data) setFooterLinks(footerRes.data as FooterLink[]);
      setLoading(false);
    }
    load();
  }, []);

  return { settings, navItems, footerLinks, loading };
}
