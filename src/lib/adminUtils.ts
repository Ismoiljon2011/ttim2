import { supabase, AdminProfile } from './supabase';

export async function logActivity(action: string, resourceType?: string, resourceId?: string, details?: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;

  let username = 'unknown';
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('username')
    .eq('user_id', session.user.id)
    .maybeSingle();
  if (profile) username = (profile as AdminProfile).username;

  await supabase.from('activity_logs').insert({
    admin_id: session.user.id,
    admin_username: username,
    action,
    resource_type: resourceType || null,
    resource_id: resourceId || null,
    details: details || null,
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\u0400-\u04FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
