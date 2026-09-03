import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Teacher } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { Search, Award } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('teachers').select('*').eq('is_published', true).order('sort_order').then(({ data }) => {
      if (data) setTeachers(data);
      setLoading(false);
    });
  }, []);

  const subjects = [...new Set(teachers.map((t) => t.subject))].sort();
  const filtered = teachers.filter((t) => {
    if (activeSubject && t.subject !== activeSubject) return false;
    if (search && !t.full_name.toLowerCase().includes(search.toLowerCase()) && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHero
        title="O'qituvchilar"
        subtitle="Tajribali va malakali pedagoglar jamoasi"
        image="https://images.pexels.com/photos/37811241/pexels-photo-37811241.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input type="text" placeholder="O'qituvchi qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />
          </div>
          {subjects.length > 0 && (
            <select value={activeSubject || ''} onChange={(e) => setActiveSubject(e.target.value || null)} className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none">
              <option value="">Barcha fanlar</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>
        {loading ? <LoadingSpinner size="lg" /> : filtered.length === 0 ? <EmptyState title="O'qituvchilar topilmadi" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((teacher) => (
              <div key={teacher.id} className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all">
                <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {teacher.photo_url ? (
                    <img src={teacher.photo_url} alt={teacher.full_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-5xl font-bold">{teacher.full_name.charAt(0)}</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 dark:text-white">{teacher.full_name}</h3>
                  <p className="mt-1 text-sm text-primary-700 dark:text-primary-400 font-medium">{teacher.subject}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{teacher.position}</p>
                  {teacher.experience_years !== null && <p className="mt-2 text-xs text-slate-400">{teacher.experience_years} yillik tajriba</p>}
                  {teacher.achievements && (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
                      <Award className="h-3 w-3 mt-0.5 shrink-0 text-accent-500" /> {teacher.achievements}
                    </p>
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
