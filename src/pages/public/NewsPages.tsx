import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase, NewsArticle, NewsCategory } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { Calendar, User, ArrowLeft, Eye, Tag, Share2 } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function NewsListPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 9;

  useEffect(() => {
    supabase.from('news_categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase.from('news_articles').select('*, category:news_categories(*)', { count: 'exact' }).eq('status', 'published');
      if (activeCategory) query = query.eq('category_id', activeCategory);
      if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
      query = query.order('published_at', { ascending: false }).range(page * pageSize, (page + 1) * pageSize - 1);
      const { data, count } = await query;
      if (data) setArticles(data as NewsArticle[]);
      if (count !== null) setTotal(count);
      setLoading(false);
    })();
  }, [activeCategory, search, page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <PageHero
        title="Yangiliklar"
        subtitle="Maktab hayotidan eng so'nggi xabarlar va voqealar"
        image="https://images.pexels.com/photos/8500353/pexels-photo-8500353.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Yangiliklarni qidirish..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setActiveCategory(null); setPage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!activeCategory ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
            >
              Barchasi
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setPage(0); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? <LoadingSpinner size="lg" /> : articles.length === 0 ? <EmptyState variant="news" /> : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} to={`/news/${article.slug}`} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                  <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {article.cover_image_url ? (
                      <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {article.category && <span className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-2">{article.category.name}</span>}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{article.title}</h3>
                    {article.excerpt && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{article.excerpt}</p>}
                    <div className="mt-auto pt-3 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(article.published_at)}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.view_count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`h-10 w-10 rounded-lg font-medium text-sm transition-colors ${page === i ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function NewsDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from('news_articles')
        .select('*, category:news_categories(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (data) {
        setArticle(data as NewsArticle);
        supabase.from('news_articles').update({ view_count: (data as NewsArticle).view_count + 1 }).eq('id', data.id);
        if ((data as NewsArticle).category_id) {
          const { data: rel } = await supabase
            .from('news_articles')
            .select('*, category:news_categories(*)')
            .eq('status', 'published')
            .eq('category_id', (data as NewsArticle).category_id)
            .neq('id', data.id)
            .order('published_at', { ascending: false })
            .limit(3);
          if (rel) setRelated(rel as NewsArticle[]);
        }
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <LoadingSpinner size="lg" />;
  if (!article) return <EmptyState variant="news" title="Yangilik topilmadi" message="Bu yangilik mavjud emas yoki o'chirilgan" />;

  const shareUrl = window.location.href;

  return (
    <div>
      {article.cover_image_url && (
        <div className="relative h-[400px] lg:h-[500px] overflow-hidden bg-slate-900">
          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-8">
            {article.category && <span className="inline-block px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold mb-3">{article.category.name}</span>}
            <h1 className="text-2xl lg:text-4xl font-bold text-white">{article.title}</h1>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {!article.cover_image_url && (
          <div className="mb-6">
            {article.category && <span className="inline-block px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold mb-3">{article.category.name}</span>}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">{article.title}</h1>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
          <span className="flex items-center gap-2"><User className="h-4 w-4" /> {article.author_name}</span>
          <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {formatDate(article.published_at)}</span>
          <span className="flex items-center gap-2"><Eye className="h-4 w-4" /> {article.view_count} marta o'qildi</span>
          <button
            onClick={() => { navigator.clipboard.writeText(shareUrl); }}
            className="flex items-center gap-2 text-primary-700 dark:text-primary-400 hover:underline"
          >
            <Share2 className="h-4 w-4" /> Ulashish
          </button>
        </div>
        {article.excerpt && <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 font-medium">{article.excerpt}</p>}
        <div className="article-content text-slate-700 dark:text-slate-300 whitespace-pre-line">{article.content}</div>
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <Tag className="h-3 w-3" /> {tag}
              </span>
            ))}
          </div>
        )}
        <button onClick={() => navigate('/news')} className="mt-8 inline-flex items-center gap-2 text-primary-700 dark:text-primary-400 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Yangiliklar ro'yxatiga qaytish
        </button>

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">O'xshash yangiliklar</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link key={rel.id} to={`/news/${rel.slug}`} className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                  <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                    {rel.cover_image_url && <img src={rel.cover_image_url} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{rel.title}</h4>
                    <span className="mt-2 block text-xs text-slate-400">{formatDate(rel.published_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
