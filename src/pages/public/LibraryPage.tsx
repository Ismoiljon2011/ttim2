import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, LibraryItem } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { Search, BookOpen, Download, Calendar, User } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('library_items').select('*').eq('is_published', true).order('sort_order').then(({ data }) => {
      if (data) setItems(data);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))] as string[];
  const filtered = items.filter((i) => {
    if (activeCategory && i.category !== activeCategory) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !(i.author || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHero
        title="Raqamli kutubxona"
        subtitle="Elektron kitoblar va o'quv materiallari"
        image="https://images.pexels.com/photos/5225982/pexels-photo-5225982.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Kitob qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />
          </div>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-lg text-sm font-medium ${!activeCategory ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>Barchasi</button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{cat}</button>
              ))}
            </div>
          )}
        </div>
        {loading ? <LoadingSpinner size="lg" /> : filtered.length === 0 ? <EmptyState variant="library" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all flex flex-col">
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {item.cover_image_url ? (
                    <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><BookOpen className="h-16 w-16" /></div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  {item.category && <span className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-1">{item.category}</span>}
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2">{item.title}</h3>
                  {item.author && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><User className="h-3 w-3" /> {item.author}</p>}
                  {item.published_date && <p className="mt-1 text-xs text-slate-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(item.published_date).getFullYear()}</p>}
                  {item.file_url && item.file_url !== '#' && (
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-primary-700 dark:text-primary-400 font-medium hover:underline">
                      <Download className="h-3 w-3" /> Yuklab olish
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
