import { ReactNode } from 'react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image?: string;
  breadcrumb?: ReactNode;
}

export default function PageHero({ title, subtitle, image, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative bg-slate-900 dark:bg-black overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-slate-900/50" />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {breadcrumb && <div className="mb-4 text-sm text-slate-300">{breadcrumb}</div>}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-slate-300 max-w-2xl">{subtitle}</p>}
      </div>
    </section>
  );
}
