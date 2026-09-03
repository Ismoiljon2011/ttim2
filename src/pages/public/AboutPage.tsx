import { useEffect, useState } from 'react';
import { supabase, AboutSection } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { Link } from 'react-router-dom';
import { Check, Target, Eye, Heart, BookOpen, Building2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const iconMap: Record<string, typeof Target> = {
  mission: Target,
  vision: Eye,
  values: Heart,
  philosophy: BookOpen,
  facilities: Building2,
  history: BookOpen,
};

export default function AboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('about_sections').select('*').order('sort_order').then(({ data }) => {
      if (data) setSections(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <PageHero
        title="Maktab haqida"
        subtitle="To'raqo'rg'on tuman ixtisoslashtirilgan maktabi — bilim, ma'naviyat va taraqqiyot maskani"
        image="https://images.pexels.com/photos/2982449/pexels-photo-2982449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {sections.map((section, i) => {
            const Icon = iconMap[section.section_key] || BookOpen;
            const isEven = i % 2 === 0;
            return (
              <div key={section.id} className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                <div className={isEven ? '' : 'lg:order-2'}>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider mb-3">
                    <Icon className="h-5 w-5" />
                    {section.title}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4">{section.title}</h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
                {section.image_url && (
                  <div className={isEven ? '' : 'lg:order-1'}>
                    <img src={section.image_url} alt={section.title} className="rounded-2xl shadow-xl w-full h-[350px] object-cover" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
