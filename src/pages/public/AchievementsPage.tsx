import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Achievement } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { Trophy, Award, Medal } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

const categoryIcons: Record<string, typeof Trophy> = {
  Olympiads: Trophy,
  Competitions: Award,
  Sports: Medal,
  International: Award,
  National: Trophy,
  Academic: Trophy,
};

export default function AchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('achievements').select('*').eq('is_published', true).order('sort_order').then(({ data }) => {
      if (data) setItems(data);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(items.map((i) => i.category))];
  const filtered = activeCategory ? items.filter((i) => i.category === activeCategory) : items;

  return (
    <div>
      <PageHero
        title="Yutuqlar"
        subtitle="O'quvchilarimizning respublika va xalqaro natijalari"
        image="https://images.pexels.com/photos/10435675/pexels-photo-10435675.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
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
        {loading ? <LoadingSpinner size="lg" /> : filtered.length === 0 ? <EmptyState title="Yutuqlar yo'q" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ach) => {
              const Icon = categoryIcons[ach.category] || Trophy;
              return (
                <div key={ach.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                  {ach.image_url && (
                    <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                      <img src={ach.image_url} alt={ach.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-primary-700 dark:text-primary-400">{ach.category}</span>
                        <h3 className="font-bold text-slate-900 dark:text-white">{ach.title}</h3>
                      </div>
                    </div>
                    {ach.result && <p className="text-lg font-bold text-primary-700 dark:text-primary-400">{ach.result}</p>}
                    {ach.student_or_team && <p className="text-sm text-slate-600 dark:text-slate-400">{ach.student_or_team}</p>}
                    {ach.year && <p className="text-xs text-slate-400 mt-1">{ach.year}-yil</p>}
                    {ach.description && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{ach.description}</p>}
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
