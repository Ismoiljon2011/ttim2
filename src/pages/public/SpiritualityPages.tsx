import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase, SpiritualityArticle } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { Calendar, ArrowLeft, Search } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function SpiritualityListPage() {
  const [articles, setArticles] = useState<SpiritualityArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('spirituality_articles').select('*').eq('status', 'published').order('published_at', { ascending: false }).then(({ data }) => {
      if (data) setArticles(data);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(articles.map((a) => a.category).filter(Boolean))] as string[];
  const filtered = articles.filter((a) => {
    if (activeCategory && a.category !== activeCategory) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHero
        title="Raqamli ma'naviyat"
        subtitle="Ma'naviy va axloqiy tarbiya bo'yicha materiallar"
        image="https://images.pexels.com/photos/10638075/pexels-photo-10638075.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />
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
        {loading ? <LoadingSpinner size="lg" /> : filtered.length === 0 ? <EmptyState title="Materiallar topilmadi" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => (
              <Link key={article.id} to={`/spirituality/${article.slug}`} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {article.cover_image_url ? (
                    <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  {article.category && <span className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-2">{article.category}</span>}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary-700 transition-colors">{article.title}</h3>
                  {article.excerpt && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{article.excerpt}</p>}
                  <span className="mt-auto pt-3 text-xs text-slate-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(article.published_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SpiritualityDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<SpiritualityArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase.from('spirituality_articles').select('*').eq('slug', slug).eq('status', 'published').maybeSingle().then(({ data }) => {
      if (data) setArticle(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!article) return <EmptyState title="Maqola topilmadi" />;

  return (
    <div>
      {article.cover_image_url && (
        <div className="relative h-[400px] overflow-hidden bg-slate-900">
          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-8">
            {article.category && <span className="inline-block px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold mb-3">{article.category}</span>}
            <h1 className="text-2xl lg:text-4xl font-bold text-white">{article.title}</h1>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {!article.cover_image_url && <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">{article.title}</h1>}
        {article.excerpt && <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">{article.excerpt}</p>}
        {article.video_url && (
          <div className="mb-8 aspect-video rounded-2xl overflow-hidden">
            <iframe src={article.video_url} className="w-full h-full" title={article.title} allowFullScreen />
          </div>
        )}
        <div className="article-content text-slate-700 dark:text-slate-300 whitespace-pre-line">{article.content}</div>
        <Link to="/spirituality" className="mt-8 inline-flex items-center gap-2 text-primary-700 dark:text-primary-400 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Ro'yxatga qaytish
        </Link>
      </div>
    </div>
  );
}
