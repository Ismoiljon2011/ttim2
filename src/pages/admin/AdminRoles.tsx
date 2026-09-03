import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { hasPermission, ALL_PERMISSIONS, ROLE_LABELS, PermissionAction } from '@/lib/permissions';
import { AdminRole } from '@/lib/supabase';
import { Shield, Check, X } from 'lucide-react';

const ROLES: AdminRole[] = ['super_admin', 'admin', 'editor', 'librarian', 'moderator'];

export default function AdminRoles() {
  const { profile } = useAuth();
  const [activeRole, setActiveRole] = useState<AdminRole>('super_admin');

  if (!hasPermission(profile?.role, 'manage_roles')) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Shield className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">Sizda bu sahifaga kirish huquqi yo'q</p>
        </div>
      </div>
    );
  }

  const groupedPermissions = ALL_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.group]) acc[perm.group] = [];
    acc[perm.group].push(perm);
    return acc;
  }, {} as Record<string, typeof ALL_PERMISSIONS>);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Rollar va huquqlar</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Har bir rolning huquqlarini ko'rish uchun rol tugmasini bosing. Super Admin barcha huquqlarga ega.
      </p>

      {/* Role selector tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeRole === role
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {ROLE_LABELS[role]}
          </button>
        ))}
      </div>

      {/* Active role permissions summary */}
      <div className="mb-6 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
        <p className="text-sm text-primary-800 dark:text-primary-300">
          <span className="font-semibold">{ROLE_LABELS[activeRole]}</span> — {hasPermission(activeRole, 'manage_admins') ? "to'liq huquqlar" : 'cheklangan huquqlar'}
        </p>
      </div>

      {/* Permission matrix table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Huquq</th>
              {ROLES.map((role) => (
                <th
                  key={role}
                  className={`text-center px-3 py-3 font-semibold whitespace-nowrap ${
                    activeRole === role
                      ? 'text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {Object.entries(groupedPermissions).flatMap(([group, perms]) => [
              <tr key={`${group}-header`} className="bg-slate-50 dark:bg-slate-900/30">
                <td colSpan={ROLES.length + 1} className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {group}
                </td>
              </tr>,
              ...perms.map((perm) => (
                <tr key={perm.action} className="hover:bg-slate-50 dark:hover:bg-slate-900/20">
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{perm.label}</td>
                  {ROLES.map((role) => (
                    <td
                      key={role}
                      className={`text-center px-3 py-3 ${
                        activeRole === role ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                      }`}
                    >
                      {hasPermission(role, perm.action as PermissionAction) ? (
                        <Check className="h-5 w-5 text-success-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-slate-300 dark:text-slate-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              )),
            ])}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Huquqlar ma'lumotlar bazasida server tomonidan tekshiriladi. Frontend orqali huquqlarni chetlab o'tish mumkin emas.
      </p>
    </div>
  );
}
