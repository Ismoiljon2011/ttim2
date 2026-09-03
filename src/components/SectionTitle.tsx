import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
  children?: ReactNode;
}

export default function SectionTitle({ title, subtitle, linkTo, linkLabel, children }: SectionTitleProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {linkTo && linkLabel && (
          <Link
            to={linkTo}
            className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors whitespace-nowrap"
          >
            {linkLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
