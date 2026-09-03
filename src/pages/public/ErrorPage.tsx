import { Link } from 'react-router-dom';
import { Home, AlertCircle, Ban, ServerCrash } from 'lucide-react';

interface ErrorPageProps {
  code: 404 | 403 | 500;
  title?: string;
  message?: string;
}

const defaults = {
  404: { title: 'Sahifa topilmadi', message: 'Kechirasiz, siz qidirgan sahifa mavjud emas yoki ko\'chirilgan.' },
  403: { title: 'Ruxsat yo\'q', message: 'Sizda ushbu sahifaga kirish huquqi yo\'q.' },
  500: { title: 'Server xatosi', message: 'Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.' },
};

const icons = { 404: AlertCircle, 403: Ban, 500: ServerCrash };

export default function ErrorPage({ code, title, message }: ErrorPageProps) {
  const config = defaults[code];
  const Icon = icons[code];

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
          <Icon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="text-6xl font-bold text-slate-300 dark:text-slate-700">{code}</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{title || config.title}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md mx-auto">{message || config.message}</p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
          <Home className="h-4 w-4" /> Bosh sahifaga qaytish
        </Link>
      </div>
    </div>
  );
}
