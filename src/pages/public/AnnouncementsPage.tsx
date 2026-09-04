import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Announcement } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { AlertCircle, Info, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

const priorityConfig = {
  urgent: { icon: AlertTriangle, color: 'text-error-600 dark:text-error-400', bg: 'bg-error-50 dark:bg-error-900/20', border: 'border-error-200 dark:border-error-800', label: 'Shoshilinch' },
  important: { icon: AlertCircle, color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-50 dark:bg-warning-900/20', border: 'border-warning-200 dark:border-warning-800', label: 'Muhim' },
  normal: { icon: Info, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20', border: 'border-primary-200 dark:border-primary-800', label: 'Oddiy' },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('announcements').select('*').eq('is_published', true).order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setAnnouncements(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHero
        title="E'lonlar"
        subtitle="Maktabdan rasmiy e'lonlar va xabarlar"
        image="https://images.pexels.com/photos/8500353/pexels-photo-8500353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? <LoadingSpinner size="lg" /> : announcements.length === 0 ? <EmptyState variant="announcements" /> : (
          <div className="space-y-4">
            {announcements.map((ann) => {
              const config = priorityConfig[ann.priority as keyof typeof priorityConfig] || priorityConfig.normal;
              const Icon = config.icon;
              return (
                <div key={ann.id} className={`rounded-2xl border ${config.border} ${config.bg} p-6`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg} ${config.color} shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
                        <span className="text-xs text-slate-400">{formatDate(ann.start_date)}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{ann.title}</h3>
                      {ann.content && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{ann.content}</p>}
                      {ann.link && (
                        <Link to={ann.link} className="mt-3 inline-flex items-center gap-1 text-sm text-primary-700 dark:text-primary-400 hover:underline">
                          <LinkIcon className="h-3 w-3" /> Batafsil
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
