import { useEffect, useState, useCallback } from 'react';
import { supabase, AdminProfile } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { Shield, Plus, Trash2, KeyRound, X, Loader2 } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '@/components/LoadingSpinner';

export default function AdminAdmins() {
  const { profile: currentUser, refreshProfile } = useAuth();
  const [admins, setAdmins] = useState<(AdminProfile & { email?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [newFullName, setNewFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [creating, setCreating] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  const canManageAdmins = hasPermission(currentUser?.role, 'manage_admins');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_profiles').select('*').order('created_at', { ascending: false });
    if (data) setAdmins(data as (AdminProfile & { email?: string })[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const validateForm = (): string | null => {
    if (!newEmail.trim()) return 'Email kiritilishi shart';
    if (!newEmail.includes('@')) return 'Email noto\'g\'ri formatda';
    if (!newUsername.trim()) return 'Username kiritilishi shart';
    if (newUsername.trim().length < 3) return 'Username kamida 3 ta belgidan iborat bo\'lishi kerak';
    if (!newPassword) return 'Parol kiritilishi shart';
    if (newPassword.length < 6) return 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak';
    return null;
  };

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setCreating(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create`;
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session?.access_token}`,
        },
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newPassword,
          username: newUsername.trim(),
          full_name: newFullName.trim() || null,
          role: newRole,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Administrator yaratishda xatolik yuz berdi');
        setCreating(false);
        return;
      }

      setSuccess('Administrator muvaffaqiyatli yaratildi!');
      setShowForm(false);
      setNewEmail(''); setNewPassword(''); setNewUsername(''); setNewFullName(''); setNewRole('editor');
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Tarmoq xatoligi. Qaytadan urinib ko\'ring.');
    }
    setCreating(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) { setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak'); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setError(error.message); return; }
    setSuccess('Parol o\'zgartirildi!');
    setShowPasswordForm(false);
    setNewPassword('');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async (id: string, userId: string) => {
    if (currentUser?.user_id === userId) { setError('O\'zingizni o\'chira olmaysiz'); return; }
    if (!confirm('Administrator o\'chirilsinmi? Bu amalni qaytarib bo\'lmaydi.')) return;
    const { error } = await supabase.from('admin_profiles').delete().eq('id', id);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess('Administrator o\'chirildi');
    load();
    setTimeout(() => setSuccess(''), 3000);
  };

  const updateRole = async (id: string, role: string) => {
    setUpdatingRole(id);
    const { error } = await supabase.from('admin_profiles').update({ role }).eq('id', id);
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Rol yangilandi');
      setTimeout(() => setSuccess(''), 3000);
    }
    load();
    if (currentUser?.id === id) refreshProfile();
    setUpdatingRole(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Administratorlar</h1>
        {canManageAdmins && (
          <div className="flex gap-2">
            <button onClick={() => setShowPasswordForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
              <KeyRound className="h-4 w-4" /> Parolni o'zgartirish
            </button>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
              <Plus className="h-4 w-4" /> Yangi admin
            </button>
          </div>
        )}
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 rounded-lg bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 text-sm">{success}</div>}

      {loading ? <LoadingSpinner /> : admins.length === 0 ? <EmptyState title="Administratorlar yo'q" /> : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Username</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">F.I.O</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Rol</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Holat</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{admin.username}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{admin.full_name || '—'}</td>
                  <td className="px-4 py-3">
                    {canManageAdmins ? (
                      <select
                        value={admin.role}
                        onChange={(e) => updateRole(admin.id, e.target.value)}
                        disabled={updatingRole === admin.id}
                        className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-xs border border-transparent focus:border-primary-500 focus:outline-none disabled:opacity-50"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="librarian">Librarian</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    ) : (
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{admin.role}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{admin.is_active ? <span className="text-xs text-success-600">Faol</span> : <span className="text-xs text-slate-400">Nofaol</span>}</td>
                  <td className="px-4 py-3 text-right">
                    {canManageAdmins && currentUser?.user_id !== admin.user_id && (
                      <button onClick={() => handleDelete(admin.id, admin.user_id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/30 transition-colors" title="O'chirish">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create admin form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => !creating && setShowForm(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Yangi administrator</h2>
              <button onClick={() => setShowForm(false)} disabled={creating} className="text-slate-400 hover:text-slate-600 disabled:opacity-50"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={createAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email <span className="text-error-500">*</span></label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required disabled={creating} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username <span className="text-error-500">*</span></label>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required minLength={3} disabled={creating} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">F.I.O</label>
                <input type="text" value={newFullName} onChange={(e) => setNewFullName(e.target.value)} disabled={creating} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Parol <span className="text-error-500">*</span></label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} disabled={creating} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none disabled:opacity-50" />
                <p className="mt-1 text-xs text-slate-400">Kamida 6 ta belgi</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Rol <span className="text-error-500">*</span></label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} disabled={creating} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none disabled:opacity-50">
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="librarian">Librarian</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              {error && <div className="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm">{error}</div>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} disabled={creating} className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium disabled:opacity-50">Bekor qilish</button>
                <button type="submit" disabled={creating} className="px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2">
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {creating ? 'Yaratilmoqda...' : 'Yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change password form */}
      {showPasswordForm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setShowPasswordForm(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Parolni o'zgartirish</h2>
              <button onClick={() => setShowPasswordForm(false)} className="text-slate-400"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={changePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Yangi parol <span className="text-error-500">*</span></label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none" />
                <p className="mt-1 text-xs text-slate-400">Kamida 6 ta belgi</p>
              </div>
              {error && <div className="p-3 rounded-lg bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-400 text-sm">{error}</div>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium">Bekor qilish</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">O'zgartirish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
