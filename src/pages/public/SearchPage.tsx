import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Search, FileText, User, BookOpen, Calendar, Newspaper, Trophy, GraduationCap } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

interface SearchResult {
  type: string;
  title: string;
  link: string;
  description?: string;
  image?: string;
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) return;
    (async () => {
      setLoading(true);
      const q = query.toLowerCase();
      const results: SearchResult[] = [];

      const [news, teachers, library, events, docs, programs, achievements, spirituality] = await Promise.all([
        supabase.from('news_articles').select('*').eq('status', 'published').or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`).limit(10),
        supabase.from('teachers').select('*').eq('is_published', true).or(`full_name.ilike.%${q}%,subject.ilike.%${q}%,biography.ilike.%${q}%`).limit(10),
        supabase.from('library_items').select('*').eq('is_published', true).or(`title.ilike.%${q}%,author.ilike.%${q}%,description.ilike.%${q}%`).limit(10),
        supabase.from('events').select('*').eq('is_published', true).or(`title.ilike.%${q}%,description.ilike.%${q}%`).limit(10),
        supabase.from('documents').select('*').eq('is_published', true).or(`title.ilike.%${q}%,description.ilike.%${q}%`).limit(10),
        supabase.from('programs').select('*').eq('is_published', true).or(`title.ilike.%${q}%,description.ilike.%${q}%`).limit(10),
        supabase.from('achievements').select('*').eq('is_published', true).or(`title.ilike.%${q}%,description.ilike.%${q}%`).limit(10),
        supabase.from('spirituality_articles').select('*').eq('status', 'published').or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`).limit(10),
      ]);

      if (news.data) news.data.forEach((n) => results.push({ type: 'Yangiliklar', title: n.title, link: `/news/${n.slug}`, description: n.excerpt || '', image: n.cover_image_url }));
      if (teachers.data) teachers.data.forEach((t) => results.push({ type: 'O\'qituvchilar', title: t.full_name, link: '/teachers', description: `${t.subject} — ${t.position}` }));
      if (library.data) library.data.forEach((l) => results.push({ type: 'Kutubxona', title: l.title, link: '/library', description: l.author || '' }));
      if (events.data) events.data.forEach((e) => results.push({ type: 'Tadbirlar', title: e.title, link: '/events', description: e.description || '' }));
      if (docs.data) docs.data.forEach((d) => results.push({ type: 'Hujjatlar', title: d.title, link: '/documents', description: d.description || '' }));
      if (programs.data) programs.data.forEach((p) => results.push({ type: 'Dasturlar', title: p.title, link: '/programs', description: p.description || '' }));
      if (achievements.data) achievements.data.forEach((a) => results.push({ type: 'Yutuqlar', title: a.title, link: '/achievements', description: a.result || '' }));
      if (spirituality.data) spirituality.data.forEach((s) => results.push({ type: 'Raqamli ma\'naviyat', title: s.title, link: `/spirituality/${s.slug}`, description: s.excerpt || '' }));

      setResults(results);
      setLoading(false);
    })();
  }, [query]);

  const typeIcons: Record<string, typeof FileText> = {
    'Yangiliklar': Newspaper,
    'O\'qituvchilar': User,
    'Kutubxona': BookOpen,
    'Tadbirlar': Calendar,
    'Hujjatlar': FileText,
    'Dasturlar': GraduationCap,
    'Yutuqlar': Trophy,
    'Raqamli ma\'naviyat': FileText,
  };

  const types = [...new Set(results.map((r) => r.type))];
  const filtered = activeFilter ? results.filter((r) => r.type === activeFilter) : results;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Search className="h-7 w-7 text-primary-600" />
          Qidiruv natijasi
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">"{query}" bo'yicha {results.length} ta natija</p>
      </div>

      {types.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveFilter(null)} className={`px-4 py-2 rounded-lg text-sm font-medium ${!activeFilter ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>Barchasi ({results.length})</button>
          {types.map((type) => (
            <button key={type} onClick={() => setActiveFilter(type)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === type ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{type} ({results.filter((r) => r.type === type).length})</button>
          ))}
        </div>
      )}

      {loading ? <LoadingSpinner size="lg" /> : filtered.length === 0 ? <EmptyState title="Natija topilmadi" message="Boshqa kalit so'z bilan urinib ko'ring" /> : (
        <div className="space-y-3">
          {filtered.map((result, i) => {
            const Icon = typeIcons[result.type] || FileText;
            return (
              <Link key={i} to={result.link} className="group flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                {result.image ? (
                  <img src={result.image} alt="" className="h-16 w-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shrink-0">
                    <Icon className="h-7 w-7" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-primary-700 dark:text-primary-400">{result.type}</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-700 transition-colors line-clamp-1">{result.title}</h3>
                  {result.description && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{result.description}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
