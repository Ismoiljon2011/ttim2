import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, AdmissionInfo } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { useOutletContext } from 'react-router-dom';
import { SiteSettings } from '@/lib/supabase';
import { FileText, CheckCircle, Calendar, HelpCircle, Phone, Info } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

const iconMap: Record<string, typeof Info> = {
  info: Info,
  requirements: CheckCircle,
  documents: FileText,
  dates: Calendar,
  faq: HelpCircle,
  contact: Phone,
};

export default function AdmissionPage() {
  const { settings } = useOutletContext<{ settings: SiteSettings }>();
  const [sections, setSections] = useState<AdmissionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('admission_info').select('*').order('sort_order').then(({ data }) => {
      if (data) setSections(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHero
        title="Qabul"
        subtitle="Ixtisoslashtirilgan maktabga qabul haqida ma'lumot"
        image="https://images.pexels.com/photos/8617515/pexels-photo-8617515.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? <LoadingSpinner size="lg" /> : sections.length === 0 ? <EmptyState title="Qabul ma'lumotlari yo'q" /> : (
          <div className="space-y-8">
            {sections.map((section) => {
              const Icon = iconMap[section.section_key] || Info;
              return (
                <div key={section.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
              );
            })}
            {settings && (
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 lg:p-8 text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Savollaringiz bormi?</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Biz bilan bog'laning: {settings.phone} • {settings.email}</p>
                <Link to="/contact" className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
                  Bog'lanish
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
