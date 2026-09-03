import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase, SiteSettings, Announcement } from '@/lib/supabase';
import { Megaphone, X } from 'lucide-react';

export default function AnnouncementBar({ settings }: { settings: SiteSettings | null }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_published', true)
        .or(`start_date.is.null,start_date.lte.${today}`)
        .or(`end_date.is.null,end_date.gte.${today}`)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setAnnouncements(data as Announcement[]);
    }
    load();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (dismissed || announcements.length === 0) return null;

  const current = announcements[currentIdx];
  const priorityColor =
    current.priority === 'urgent'
      ? 'bg-error-600'
      : current.priority === 'important'
      ? 'bg-primary-700'
      : 'bg-slate-800';

  return (
    <div className={`${priorityColor} text-white text-sm relative z-[60]`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-2 gap-3">
          <Megaphone className="h-4 w-4 shrink-0" />
          <div className="flex-1 text-center truncate">
            {current.link ? (
              <Link to={current.link} className="hover:underline font-medium">
                {current.title}
              </Link>
            ) : (
              <span className="font-medium">{current.title}</span>
            )}
          </div>
          {announcements.length > 1 && (
            <div className="hidden sm:flex gap-1.5 shrink-0">
              {announcements.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Announcement ${i + 1}`}
                />
              ))}
            </div>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors shrink-0"
            aria-label="Close announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
