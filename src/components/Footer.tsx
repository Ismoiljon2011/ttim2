import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, Facebook, Instagram, Send, Youtube, Clock } from 'lucide-react';
import { SiteSettings, FooterLink } from '@/lib/supabase';

interface FooterProps {
  settings: SiteSettings | null;
  footerLinks: FooterLink[];
}

export default function Footer({ settings, footerLinks }: FooterProps) {
  const sections = footerLinks.reduce((acc, link) => {
    if (!acc[link.section]) acc[link.section] = [];
    acc[link.section].push(link);
    return acc;
  }, {} as Record<string, FooterLink[]>);

  const sectionTitles: Record<string, string> = {
    main: 'Asosiy',
    resources: 'Foydali',
    school: 'Maktab',
  };

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{settings?.school_short_name || 'TTIM'}</div>
                <div className="text-xs text-slate-400">{settings?.school_name || ''}</div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-md">
              {settings?.footer_description || "To'raqo'rg'on tuman ixtisoslashtirilgan maktabi — bilim, ma'naviyat va taraqqiyot maskani."}
            </p>
            <div className="flex gap-3">
              {settings?.telegram_url && (
                <a href={settings.telegram_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-800 hover:bg-primary-600 transition-colors" aria-label="Telegram">
                  <Send className="h-5 w-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-800 hover:bg-primary-600 transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-800 hover:bg-primary-600 transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-slate-800 hover:bg-primary-600 transition-colors" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Link sections */}
          {Object.entries(sections).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {sectionTitles[key] || key}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Bog'lanish</h3>
            <ul className="space-y-3">
              {settings?.address && (
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Phone className="h-5 w-5 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-primary-400 transition-colors">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-3 text-sm text-slate-400">
                  <Mail className="h-5 w-5 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-primary-400 transition-colors">{settings.email}</a>
                </li>
              )}
              {settings?.working_hours && (
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <Clock className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{settings.working_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {settings?.school_name || 'TTIM'}. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  );
}
