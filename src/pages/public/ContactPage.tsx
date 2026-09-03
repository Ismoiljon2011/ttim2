import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { SiteSettings } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function ContactPage() {
  const { settings } = useOutletContext<{ settings: SiteSettings }>();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { setLoading(false); }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Ism kiriting';
    if (!form.email.trim()) e.email = 'Email kiriting';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'To\'g\'ri email kiriting';
    if (!form.message.trim()) e.message = 'Xabar matnini kiriting';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <PageHero
        title="Bog'lanish"
        subtitle="Savollaringiz bormi? Biz bilan bog'laning"
        image="https://images.pexels.com/photos/35314982/pexels-photo-35314982.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
        breadcrumb={<Link to="/" className="hover:text-white">Bosh sahifa</Link>}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Aloqa ma'lumotlari</h2>
            <div className="space-y-4">
              {settings?.address && (
                <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shrink-0"><MapPin className="h-5 w-5" /></div>
                  <div><div className="text-sm font-semibold text-slate-900 dark:text-white">Manzil</div><div className="text-sm text-slate-600 dark:text-slate-400">{settings.address}</div></div>
                </div>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shrink-0"><Phone className="h-5 w-5" /></div>
                  <div><div className="text-sm font-semibold text-slate-900 dark:text-white">Telefon</div><div className="text-sm text-slate-600 dark:text-slate-400">{settings.phone}</div></div>
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shrink-0"><Mail className="h-5 w-5" /></div>
                  <div><div className="text-sm font-semibold text-slate-900 dark:text-white">Email</div><div className="text-sm text-slate-600 dark:text-slate-400">{settings.email}</div></div>
                </a>
              )}
              {settings?.working_hours && (
                <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 shrink-0"><Clock className="h-5 w-5" /></div>
                  <div><div className="text-sm font-semibold text-slate-900 dark:text-white">Ish vaqti</div><div className="text-sm text-slate-600 dark:text-slate-400">{settings.working_hours}</div></div>
                </div>
              )}
            </div>

            {/* Social */}
            <div className="mt-8 flex gap-3">
              {settings?.telegram_url && <a href={settings.telegram_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-600 hover:text-white transition-colors" aria-label="Telegram"><Send className="h-5 w-5" /></a>}
              {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-600 hover:text-white transition-colors" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>}
              {settings?.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-600 hover:text-white transition-colors" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>}
              {settings?.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-600 hover:text-white transition-colors" aria-label="YouTube"><Youtube className="h-5 w-5" /></a>}
            </div>

            {/* Map */}
            {settings?.map_embed_url && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <iframe src={settings.map_embed_url} className="w-full h-[300px]" title="Map" loading="lazy" />
              </div>
            )}
          </div>

          {/* Contact form */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Xabar yuborish</h2>
            {status === 'success' && (
              <div className="mb-6 p-4 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 text-success-700 dark:text-success-400 text-sm">
                Xabaringiz yuborildi! Tez orada javob beramiz.
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 p-4 rounded-xl bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 text-error-700 dark:text-error-400 text-sm">
                Xatolik yuz berdi. Qaytadan urinib ko'ring.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Ism <span className="text-error-500">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border ${errors.name ? 'border-error-500' : 'border-transparent focus:border-primary-500'} focus:outline-none`} />
                {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email <span className="text-error-500">*</span></label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border ${errors.email ? 'border-error-500' : 'border-transparent focus:border-primary-500'} focus:outline-none`} />
                {errors.email && <p className="mt-1 text-xs text-error-500">{errors.email}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefon</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Mavzu</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Xabar <span className="text-error-500">*</span></label>
                <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border ${errors.message ? 'border-error-500' : 'border-transparent focus:border-primary-500'} focus:outline-none resize-none`} />
                {errors.message && <p className="mt-1 text-xs text-error-500">{errors.message}</p>}
              </div>
              <button type="submit" disabled={status === 'submitting'} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50">
                {status === 'submitting' ? 'Yuborilmoqda...' : 'Xabar yuborish'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
