import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';
import IconPicker from '@/components/IconPicker';
import MediaUpload from '@/components/MediaUpload';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (item: Record<string, unknown>) => React.ReactNode;
}

interface CrudPageProps {
  table: string;
  title: string;
  columns: Column[];
  formFields: FormField[];
  defaultValues: Record<string, unknown>;
  searchFields?: string[];
  orderBy?: string;
  orderAscending?: boolean;
  extraSelect?: string;
  withImage?: boolean;
}

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'date' | 'tags' | 'icon' | 'media';
  options?: { value: string; label: string }[];
  required?: boolean;
  full?: boolean;
  accept?: 'image' | 'video' | 'file' | 'any';
}

export default function CrudPage({
  table, title, columns, formFields, defaultValues, searchFields, orderBy = 'created_at', orderAscending = false, extraSelect = '',
}: CrudPageProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(defaultValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    let query = supabase.from(table).select(extraSelect || '*');
    if (search && searchFields) {
      const safeSearch = search.replace(/[%_,]/g, '');
      const orClause = searchFields.map((field) => `${field}.ilike.%${safeSearch}%`).join(',');
      query = query.or(orClause);
    }
    query = query.order(orderBy, { ascending: orderAscending });
    const { data, error: loadError } = await query;
    if (loadError) {
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
    } else {
      setItems((data || []) as unknown as Record<string, unknown>[]);
    }
    setLoading(false);
  }, [table, extraSelect, orderBy, orderAscending, search, searchFields]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const openCreate = () => {
    setForm({ ...defaultValues });
    setEditing(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (item: Record<string, unknown>) => {
    const editableValues: Record<string, unknown> = {};
    formFields.forEach((field) => { editableValues[field.key] = item[field.key] ?? defaultValues[field.key] ?? ''; });
    setForm(editableValues);
    setEditing(item);
    setError('');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const data: Record<string, unknown> = {};
    formFields.forEach((field) => {
      const value = form[field.key];
      data[field.key] = value === '' && (field.type === 'date' || field.type === 'text' || field.type === 'textarea' || field.type === 'media') ? null : value;
    });

    const result = editing
      ? await supabase.from(table).update(data).eq('id', editing.id as string)
      : await supabase.from(table).insert(data);

    if (result.error) {
      setError('Saqlashda xatolik yuz berdi. Ma\'lumotlarni tekshirib qayta urinib ko\'ring.');
      setSaving(false);
      return;
    }

    setShowForm(false);
    setSaving(false);
    await loadItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error: deleteError } = await supabase.from(table).delete().eq('id', deleteId);
    if (deleteError) {
      setError('O\'chirishda xatolik yuz berdi.');
    } else {
      await loadItems();
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="h-4 w-4" /> Qo'shish
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm">{error}</div>}

      {searchFields && (
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:border-primary-500 focus:outline-none" />
        </div>
      )}

      {loading ? <LoadingSpinner /> : items.length === 0 ? <EmptyState /> : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {columns.map((col) => <th key={col.key} className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{col.label}</th>)}
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {items.map((item) => (
                <tr key={item.id as string} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-slate-500 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30" title="Tahrirlash">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(item.id as string)} className="p-1.5 rounded-lg text-slate-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/30" title="O'chirish">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        message={`Ushbu ma'lumotni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.`}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => !saving && setShowForm(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editing ? 'Tahrirlash' : 'Yangi qo\'shish'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {error && <div className="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm">{error}</div>}
              <div className="grid sm:grid-cols-2 gap-4">
                {formFields.map((field) => (
                  <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                    {field.type !== 'media' && (
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {field.label}{field.required && <span className="text-error-500"> *</span>}
                      </label>
                    )}
                    {field.type === 'text' && <input type="text" value={String(form[field.key] ?? '')} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} required={field.required} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />}
                    {field.type === 'textarea' && <textarea rows={4} value={String(form[field.key] ?? '')} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} required={field.required} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none resize-none" />}
                    {field.type === 'number' && <input type="number" value={String(form[field.key] ?? '')} onChange={(e) => setForm({ ...form, [field.key]: e.target.value === '' ? null : Number(e.target.value) })} required={field.required} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />}
                    {field.type === 'date' && <input type="date" value={String(form[field.key] ?? '')} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} required={field.required} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />}
                    {field.type === 'boolean' && <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={Boolean(form[field.key])} onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })} className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500" /><span className="text-sm text-slate-700 dark:text-slate-300">Faol</span></label>}
                    {field.type === 'select' && <select value={String(form[field.key] ?? field.options?.[0]?.value ?? '')} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} required={field.required} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none">{field.options?.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select>}
                    {field.type === 'tags' && <input type="text" value={Array.isArray(form[field.key]) ? (form[field.key] as string[]).join(', ') : ''} onChange={(e) => setForm({ ...form, [field.key]: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} placeholder="vergul bilan ajrating" className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />}
                    {field.type === 'icon' && <IconPicker value={(form[field.key] as string) || null} onChange={(iconName) => setForm({ ...form, [field.key]: iconName })} />}
                    {field.type === 'media' && <MediaUpload value={(form[field.key] as string) || null} onChange={(value) => setForm({ ...form, [field.key]: value })} accept={field.accept || 'any'} label={field.label} required={field.required} />}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium">Bekor qilish</button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
