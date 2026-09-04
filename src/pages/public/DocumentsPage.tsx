import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Document } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { FileText, Download, Calendar } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('documents').select('*').eq('is_published', true).order('sort_order').then(({ data }) => {
      if (data) setDocs(data);
      setLoading(false);
    });
  }, []);

  const categories = [...new Set(docs.map((d) => d.category).filter(Boolean))] as string[];
  const filtered = activeCategory ? docs.filter((d) => d.category === activeCategory) : docs;

  return (
    <div>
      <PageHero
        title="Hujjatlar"
        subtitle="Rasmiy hujjatlar va me'yoriy hujjatlar"
        image="https://images.pexels.com/photos/8045884/pexels-photo-8045884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setActiveCategory(null)} className={`px-4 py-2 rounded-lg text-sm font-medium ${!activeCategory ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>Barchasi</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeCategory === cat ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{cat}</button>
            ))}
          </div>
        )}
        {loading ? <LoadingSpinner size="lg" /> : filtered.length === 0 ? <EmptyState variant="documents" /> : (
          <div className="space-y-3">
            {filtered.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  {doc.category && <span className="text-xs font-semibold text-primary-700 dark:text-primary-400">{doc.category}</span>}
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">{doc.title}</h3>
                  {doc.description && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{doc.description}</p>}
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-1"><Calendar className="h-3 w-3" /> {formatDate(doc.document_date)}</span>
                </div>
                {doc.file_url && doc.file_url !== '#' && (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shrink-0">
                    <Download className="h-4 w-4" /> Yuklab olish
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
