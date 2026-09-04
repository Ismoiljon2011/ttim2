import { useEffect, useState } from 'react';
import { supabase, Program } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('programs').select('*').eq('is_published', true).order('sort_order').then(({ data }) => {
      if (data) setPrograms(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHero
        title="Ta'lim dasturlari"
        subtitle="Chuqurlashtirilgan fan dasturlari va zamonaviy ta'lim yo'nalishlari"
        image="https://images.pexels.com/photos/37811241/pexels-photo-37811241.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {loading ? <LoadingSpinner size="lg" /> : programs.length === 0 ? <EmptyState variant="programs" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {program.image_url ? (
                    <img src={program.image_url} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><BookOpen className="h-12 w-12" /></div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{program.title}</h3>
                  {program.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{program.description}</p>}
                  {program.teacher_name && <p className="mt-3 text-xs text-primary-700 dark:text-primary-400 font-medium">{program.teacher_name}</p>}
                  {program.additional_info && <p className="mt-1 text-xs text-slate-500">{program.additional_info}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
