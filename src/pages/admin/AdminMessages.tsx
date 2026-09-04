import { useEffect, useState, useCallback } from 'react';
import { supabase, ContactMessage } from '@/lib/supabase';
import { Mail, CheckCircle, Trash2, X } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ConfirmDialog';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', deleteId);
    if (error) {
      setError('O\'chirishda xatolik yuz berdi');
      setTimeout(() => setError(''), 3000);
    } else {
      setSelected(null);
      load();
    }
    setDeleteId(null);
  };

  const openMessage = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) markRead(msg.id);
  };

  const [error, setError] = useState('');
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Xabarlar</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{unreadCount} ta o'qilmagan xabar</p>

      {loading ? <LoadingSpinner /> : messages.length === 0 ? <EmptyState title="Xabarlar yo'q" /> : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Yuboruvchi</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Mavzu</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Sana</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Holat</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {messages.map((msg) => (
                <tr key={msg.id} className={`hover:bg-slate-50 dark:hover:bg-slate-900/30 cursor-pointer ${!msg.is_read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`} onClick={() => openMessage(msg)}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 dark:text-white">{msg.name}</div>
                    <div className="text-xs text-slate-400">{msg.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">{msg.subject || msg.message}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{formatDate(msg.created_at)}</td>
                  <td className="px-4 py-3">
                    {msg.is_read ? <span className="text-xs text-slate-400">O'qilgan</span> : <span className="text-xs font-semibold text-primary-600">Yangi</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(msg.id); }} className="p-1.5 rounded-lg text-slate-500 hover:bg-error-50 hover:text-error-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Xabarni o'chirish"
        message="Ushbu xabarni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary-600" /><h2 className="text-lg font-bold text-slate-900 dark:text-white">Xabar</h2></div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><div className="text-xs text-slate-400">Yuboruvchi</div><div className="font-medium text-slate-900 dark:text-white">{selected.name}</div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><div className="text-xs text-slate-400">Email</div><div className="text-sm text-slate-700 dark:text-slate-300">{selected.email}</div></div>
                <div><div className="text-xs text-slate-400">Telefon</div><div className="text-sm text-slate-700 dark:text-slate-300">{selected.phone || '—'}</div></div>
              </div>
              {selected.subject && <div><div className="text-xs text-slate-400">Mavzu</div><div className="text-sm text-slate-700 dark:text-slate-300">{selected.subject}</div></div>}
              <div><div className="text-xs text-slate-400">Xabar</div><div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line rounded-lg bg-slate-100 dark:bg-slate-900 p-4">{selected.message}</div></div>
              <div className="text-xs text-slate-400">{formatDate(selected.created_at)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
