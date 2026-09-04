import { useEffect, useState } from 'react';
import { supabase, SiteSettings } from '@/lib/supabase';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';

export default function AdminSettingsForm() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('site_settings').select('*').limit(1).maybeSingle().then(({ data }) => {
      if (data) setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const { id, ...updateData } = settings;
    const { error } = await supabase.from('site_settings').update({ ...updateData, updated_at: new Date().toISOString() }).eq('id', id as string);
    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const update = (key: keyof SiteSettings, value: string | boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;

  const fields: { key: keyof SiteSettings; label: string; type?: 'text' | 'textarea' | 'boolean' | 'media'; full?: boolean }[] = [
    { key: 'school_name', label: 'Maktab nomi', full: true },
    { key: 'school_short_name', label: 'Qisqa nom' },
    { key: 'logo_url', label: 'Logo', type: 'media', full: true },
    { key: 'favicon_url', label: 'Favicon URL' },
    { key: 'description', label: 'Tavsif', type: 'textarea', full: true },
    { key: 'address', label: 'Manzil', full: true },
    { key: 'phone', label: 'Telefon' },
    { key: 'email', label: 'Email' },
    { key: 'working_hours', label: 'Ish vaqti' },
    { key: 'map_embed_url', label: 'Xarita embed URL', full: true },
    { key: 'announcement_bar_text', label: 'E\'lon bar matni', full: true },
    { key: 'announcement_bar_link', label: 'E\'lon bar havolasi' },
    { key: 'announcement_bar_visible', label: 'E\'lon bar ko\'rinadi', type: 'boolean', full: true },
    { key: 'facebook_url', label: 'Facebook URL' },
    { key: 'instagram_url', label: 'Instagram URL' },
    { key: 'telegram_url', label: 'Telegram URL' },
    { key: 'youtube_url', label: 'YouTube URL' },
    { key: 'footer_description', label: 'Footer tavsif', type: 'textarea', full: true },
    { key: 'seo_title', label: 'SEO sarlavha', full: true },
    { key: 'seo_description', label: 'SEO tavsif', type: 'textarea', full: true },
    { key: 'seo_keywords', label: 'SEO kalit so\'zlar', full: true },
    { key: 'og_image_url', label: 'OG rasm', type: 'media', full: true },
    { key: 'library_enabled', label: 'Kutubxona sahifasini yoqish', type: 'boolean', full: true },
    { key: 'achievements_enabled', label: 'Yutuqlar sahifasini yoqish', type: 'boolean', full: true },
    { key: 'events_enabled', label: 'Tadbirlar sahifasini yoqish', type: 'boolean', full: true },
    { key: 'recommendations_enabled', label: 'Tavsiyalar sahifasini yoqish', type: 'boolean', full: true },
    { key: 'spirituality_enabled', label: 'Raqamli ma\'naviyat sahifasini yoqish', type: 'boolean', full: true },
    { key: 'announcements_enabled', label: 'E\'lonlar sahifasini yoqish', type: 'boolean', full: true },
    { key: 'gallery_enabled', label: 'Galereya sahifasini yoqish', type: 'boolean', full: true },
    { key: 'documents_enabled', label: 'Hujjatlar sahifasini yoqish', type: 'boolean', full: true },
    { key: 'leadership_enabled', label: 'Rahbariyat sahifasini yoqish', type: 'boolean', full: true },
    { key: 'teachers_enabled', label: 'O\'qituvchilar sahifasini yoqish', type: 'boolean', full: true },
    { key: 'programs_enabled', label: 'Ta\'lim dasturlari sahifasini yoqish', type: 'boolean', full: true },
    { key: 'admission_enabled', label: 'Qabul sahifasini yoqish', type: 'boolean', full: true },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Sayt sozlamalari</h1>
      {error && <div className="mb-4 p-3 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm">{error}</div>}
      {saved && <div className="mb-4 p-3 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Sozlamalar saqlandi!</div>}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
              {field.type === 'media' ? (
                <MediaUpload value={(settings[field.key] as string) || null} onChange={(value) => update(field.key, value || '')} accept="image" label={field.label} />
              ) : field.type === 'textarea' ? (
                <textarea rows={3} value={String(settings[field.key] || '')} onChange={(e) => update(field.key, e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none resize-none" />
              ) : field.type === 'boolean' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(settings[field.key])} onChange={(e) => update(field.key, e.target.checked)} className="h-5 w-5 rounded text-primary-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Faol</span>
                </label>
              ) : (
                <input type="text" value={String(settings[field.key] || '')} onChange={(e) => update(field.key, e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </form>
    </div>
  );
}
