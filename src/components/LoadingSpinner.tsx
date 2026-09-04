import { Loader2, CalendarX, ImageIcon, BookX, Trophy, Newspaper, FileX, Bell, Users, Megaphone, FolderOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className={`${sizes[size]} animate-spin text-primary-600`} />
    </div>
  );
}

type EmptyStateVariant =
  | 'default'
  | 'events'
  | 'gallery'
  | 'library'
  | 'achievements'
  | 'news'
  | 'documents'
  | 'announcements'
  | 'people'
  | 'recommendations'
  | 'spirituality'
  | 'programs';

const VARIANT_CONFIG: Record<EmptyStateVariant, { icon: LucideIcon; defaultTitle: string; defaultMessage: string; bg: string; fg: string }> = {
  default: { icon: FolderOpen, defaultTitle: "Hozircha ma'lumot yo'q", defaultMessage: "Tez orada yangi ma'lumotlar qo'shiladi.", bg: 'bg-slate-100 dark:bg-slate-800', fg: 'text-slate-400 dark:text-slate-500' },
  events: { icon: CalendarX, defaultTitle: "Tadbirlar hozircha yo'q", defaultMessage: "Yaqin orada yangi tadbirlar e'lon qilinadi.", bg: 'bg-blue-50 dark:bg-blue-900/20', fg: 'text-blue-400 dark:text-blue-500' },
  gallery: { icon: ImageIcon, defaultTitle: "Galereya bo'sh", defaultMessage: "Fotolar va videolar shu yerda paydo bo'ladi.", bg: 'bg-purple-50 dark:bg-purple-900/20', fg: 'text-purple-400 dark:text-purple-500' },
  library: { icon: BookX, defaultTitle: "Kitoblar topilmadi", defaultMessage: "Kutubxonaga tez orada yangi kitoblar qo'shiladi.", bg: 'bg-amber-50 dark:bg-amber-900/20', fg: 'text-amber-400 dark:text-amber-500' },
  achievements: { icon: Trophy, defaultTitle: "Yutuqlar yo'q", defaultMessage: "O'quvchilarimizning erishgan natijalari shu yerda ko'rsatiladi.", bg: 'bg-yellow-50 dark:bg-yellow-900/20', fg: 'text-yellow-400 dark:text-yellow-500' },
  news: { icon: Newspaper, defaultTitle: "Yangiliklar topilmadi", defaultMessage: "Maktab hayotidan so'nggi xabarlar shu yerda bo'ladi.", bg: 'bg-cyan-50 dark:bg-cyan-900/20', fg: 'text-cyan-400 dark:text-cyan-500' },
  documents: { icon: FileX, defaultTitle: "Hujjatlar yo'q", defaultMessage: "Hujjatlar shu bo'limda joylashtiriladi.", bg: 'bg-slate-100 dark:bg-slate-800', fg: 'text-slate-400 dark:text-slate-500' },
  announcements: { icon: Bell, defaultTitle: "E'lonlar yo'q", defaultMessage: "Yangi e'lonlar shu yerda ko'rsatiladi.", bg: 'bg-orange-50 dark:bg-orange-900/20', fg: 'text-orange-400 dark:text-orange-500' },
  people: { icon: Users, defaultTitle: "Ma'lumot yo'q", defaultMessage: "Ushbu bo'lim tez orada to'ldiriladi.", bg: 'bg-green-50 dark:bg-green-900/20', fg: 'text-green-400 dark:text-green-500' },
  recommendations: { icon: Megaphone, defaultTitle: "Tavsiyalar yo'q", defaultMessage: "Foydali resurslar shu yerda qo'shiladi.", bg: 'bg-teal-50 dark:bg-teal-900/20', fg: 'text-teal-400 dark:text-teal-500' },
  spirituality: { icon: BookX, defaultTitle: "Maqolalar yo'q", defaultMessage: "Ma'naviy-ma'rifiy maqolalar shu yerda bo'ladi.", bg: 'bg-indigo-50 dark:bg-indigo-900/20', fg: 'text-indigo-400 dark:text-indigo-500' },
  programs: { icon: BookX, defaultTitle: "Dasturlar yo'q", defaultMessage: "Ta'lim dasturlari shu yerda ko'rsatiladi.", bg: 'bg-emerald-50 dark:bg-emerald-900/20', fg: 'text-emerald-400 dark:text-emerald-500' },
};

interface EmptyStateProps {
  title?: string;
  message?: string;
  variant?: EmptyStateVariant;
}

export function EmptyState({ title, message, variant = 'default' }: EmptyStateProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl ${config.bg}`}>
        <Icon className={`h-10 w-10 ${config.fg}`} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {title || config.defaultTitle}
      </h3>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {message || config.defaultMessage}
      </p>
    </div>
  );
}
