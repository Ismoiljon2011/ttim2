import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Leadership } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { Phone, Mail } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<Leadership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('leadership').select('*').eq('is_published', true).order('sort_order').then(({ data }) => {
      if (data) setLeaders(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHero
        title="Rahbariyat"
        subtitle="Maktabimiz rahbariyati jamoasi"
        image="https://images.pexels.com/photos/35314982/pexels-photo-35314982.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? <LoadingSpinner size="lg" /> : leaders.length === 0 ? <EmptyState title="Rahbariyat ma'lumotlari yo'q" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((leader) => (
              <div key={leader.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {leader.photo_url ? (
                    <img src={leader.photo_url} alt={leader.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl font-bold">{leader.full_name.charAt(0)}</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{leader.full_name}</h3>
                  <p className="mt-1 text-sm text-primary-700 dark:text-primary-400 font-medium">{leader.position}</p>
                  {leader.biography && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{leader.biography}</p>}
                  <div className="mt-4 space-y-1.5">
                    {leader.phone && <a href={`tel:${leader.phone}`} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-primary-700"><Phone className="h-3 w-3" /> {leader.phone}</a>}
                    {leader.email && <a href={`mailto:${leader.email}`} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-primary-700"><Mail className="h-3 w-3" /> {leader.email}</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
