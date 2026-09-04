import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Recommendation } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { ExternalLink, BookOpen, Globe, Wrench, Video } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

const categoryIcons: Record<string, typeof BookOpen> = {
  Books: BookOpen,
  'Educational Websites': Globe,
  'Learning Resources': BookOpen,
  'Video Lessons': Video,
  'Useful Tools': Wrench,
};

export default function RecommendationsPage() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('recommendations').select('*').eq('is_published', true).order('sort_order').then(({ data }) => {
      if (data) setItems(data);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(items.map((i) => i.category))];
  const filtered = activeCategory ? items.filter((i) => i.category === activeCategory) : items;

  return (
    <div>
      <PageHero
        title="Tavsiyalar"
        subtitle="O'quvchilar va tashrif buyuruvchilar uchun foydali resurslar"
        image="https://images.pexels.com/photos/8045884/pexels-photo-8045884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-lg text-sm font-medium ${!activeCategory ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>Barchasi</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{cat}</button>
            ))}
          </div>
        )}
        {loading ? <LoadingSpinner size="lg" /> : filtered.length === 0 ? <EmptyState variant="recommendations" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const Icon = categoryIcons[item.category] || BookOpen;
              return (
                <a
                  key={item.id}
                  href={item.external_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                  <span className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-1">{item.category}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-700 transition-colors">{item.title}</h3>
                  {item.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{item.description}</p>}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
