import { useEffect, useState } from 'react';
import { supabase, ActivityLog } from '@/lib/supabase';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).range(page * pageSize, (page + 1) * pageSize - 1);
      if (data) setLogs(data);
      setLoading(false);
    })();
  }, [page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Faoliyat jurnali</h1>

      {loading ? <LoadingSpinner /> : logs.length === 0 ? <EmptyState title="Jurnal yozuvlari yo'q" /> : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Admin</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Amal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Resurs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{log.admin_username || '—'}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{log.action}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{log.resource_type || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{formatDate(log.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-center gap-2">
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm disabled:opacity-50">← Oldingi</button>
        <span className="px-4 py-2 text-sm text-slate-500">Sahifa {page + 1}</span>
        <button onClick={() => setPage(page + 1)} disabled={logs.length < pageSize} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm disabled:opacity-50">Keyingi →</button>
      </div>
    </div>
  );
}
