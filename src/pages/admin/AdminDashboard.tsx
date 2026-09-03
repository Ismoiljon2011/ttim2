import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Newspaper, Users, Image, BookOpen, File, Calendar, Mail, Trophy, TrendingUp, FileText } from 'lucide-react';

interface Stat {
  label: string;
  value: number;
  icon: typeof Newspaper;
  link: string;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentNews, setRecentNews] = useState<{ id: string; title: string; created_at: string; status: string }[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [recentLogs, setRecentLogs] = useState<{ id: string; action: string; admin_username: string | null; created_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const [news, teachers, albums, library, docs, events, achievements, messages, logs, recentN] = await Promise.all([
        supabase.from('news_articles').select('id', { count: 'exact', head: true }),
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_albums').select('id', { count: 'exact', head: true }),
        supabase.from('library_items').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('achievements').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('activity_logs').select('id, action, admin_username, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('news_articles').select('id, title, created_at, status').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats([
        { label: 'Yangiliklar', value: news.count || 0, icon: Newspaper, link: '/manage/news', color: 'bg-primary-500' },
        { label: 'O\'qituvchilar', value: teachers.count || 0, icon: Users, link: '/manage/teachers', color: 'bg-success-500' },
        { label: 'Galereya', value: albums.count || 0, icon: Image, link: '/manage/gallery', color: 'bg-accent-500' },
        { label: 'Kutubxona', value: library.count || 0, icon: BookOpen, link: '/manage/library', color: 'bg-warning-500' },
        { label: 'Hujjatlar', value: docs.count || 0, icon: File, link: '/manage/documents', color: 'bg-error-500' },
        { label: 'Tadbirlar', value: events.count || 0, icon: Calendar, link: '/manage/events', color: 'bg-primary-600' },
        { label: 'Yutuqlar', value: achievements.count || 0, icon: Trophy, link: '/manage/achievements', color: 'bg-accent-600' },
        { label: 'O\'qilmagan xabarlar', value: messages.count || 0, icon: Mail, link: '/manage/messages', color: 'bg-error-600' },
      ]);

      setUnreadMessages(messages.count || 0);
      if (logs.data) setRecentLogs(logs.data as typeof recentLogs);
      if (recentN.data) setRecentNews(recentN.data as typeof recentNews);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} to={stat.link} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-slate-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent news */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">So'nggi yangiliklar</h2>
          <div className="space-y-3">
            {recentNews.map((n) => (
              <div key={n.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-900 dark:text-white truncate block">{n.title}</span>
                  <span className="text-xs text-slate-400">{new Date(n.created_at).toLocaleDateString('uz-UZ')}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${n.status === 'published' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>{n.status}</span>
              </div>
            ))}
            {recentNews.length === 0 && <p className="text-sm text-slate-400">Yangiliklar yo'q</p>}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">So'nggi faoliyat</h2>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-900 dark:text-white">{log.action}</span>
                  <span className="text-xs text-slate-400 block">{log.admin_username} • {new Date(log.created_at).toLocaleDateString('uz-UZ')}</span>
                </div>
              </div>
            ))}
            {recentLogs.length === 0 && <p className="text-sm text-slate-400">Faoliyat yo'q</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
