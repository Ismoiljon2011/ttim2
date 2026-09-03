/*
# Add library_enabled setting and RBAC enforcement

## Overview
This migration adds:
1. A `library_enabled` boolean column to `site_settings` so admins can toggle the public Library page.
2. A SECURITY DEFINER function `is_authorized(action text)` that checks whether the current
   authenticated user's admin role permits a given action. This provides server-side RBAC
   enforcement — the frontend cannot bypass it.
3. Tighter RLS policies on `admin_profiles` so that only super_admin users can insert/update
   role and is_active columns (preventing privilege escalation by lower-privileged admins).

## Changes

### site_settings
- New column: `library_enabled` (boolean, default true). Controls whether the public Library
  page is visible.

### admin_profiles RLS
- UPDATE policy tightened: only super_admin can change `role` or `is_active` columns.
  Other admins can still update their own full_name/username.
- INSERT policy tightened: only super_admin can create new admin_profiles rows.
- DELETE policy tightened: only super_admin can delete admin profiles.

### is_authorized function
- SECURITY DEFINER function that looks up the caller's role in admin_profiles and checks
  it against a permission matrix. Returns boolean. Used by edge functions for server-side
  authorization checks.

## Security
- RLS policies on admin_profiles now enforce that only super_admin can manage admin accounts.
- The is_authorized function provides a reusable server-side permission check.
*/

-- ============ library_enabled column ============
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'library_enabled') THEN
    ALTER TABLE site_settings ADD COLUMN library_enabled boolean NOT NULL DEFAULT true;
  END IF;
END $$;

-- ============ Tighten admin_profiles RLS ============
-- Only super_admin can INSERT new admin profiles
DROP POLICY IF EXISTS "admin_insert_profiles" ON admin_profiles;
CREATE POLICY "admin_insert_profiles" ON admin_profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin' AND p.is_active = true
    )
  );

-- Only super_admin can UPDATE role/is_active; users can update their own non-privileged columns
DROP POLICY IF EXISTS "admin_update_profiles" ON admin_profiles;
CREATE POLICY "admin_update_profiles" ON admin_profiles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles p
      WHERE p.user_id = auth.uid() AND p.is_active = true
    )
  )
  WITH CHECK (
    -- super_admin can change anything
    EXISTS (
      SELECT 1 FROM admin_profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin' AND p.is_active = true
    )
    -- OR the user is updating their own row AND not changing role or is_active
    OR (
      user_id = auth.uid()
      AND (role IS NOT DISTINCT FROM (SELECT role FROM admin_profiles p WHERE p.user_id = auth.uid()))
      AND (is_active IS NOT DISTINCT FROM (SELECT is_active FROM admin_profiles p WHERE p.user_id = auth.uid()))
    )
  );

-- Only super_admin can DELETE admin profiles
DROP POLICY IF EXISTS "admin_delete_profiles" ON admin_profiles;
CREATE POLICY "admin_delete_profiles" ON admin_profiles
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin' AND p.is_active = true
    )
  );

-- ============ is_authorized function ============
-- Server-side RBAC check. Usage: SELECT is_authorized('manage_admins');
-- Returns true if the current user's role has the given permission.
CREATE OR REPLACE FUNCTION is_authorized(action text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role
  FROM admin_profiles
  WHERE user_id = auth.uid() AND is_active = true;

  IF v_role IS NULL THEN
    RETURN false;
  END IF;

  -- Super Admin: all permissions
  IF v_role = 'super_admin' THEN
    RETURN true;
  END IF;

  -- Check specific permissions by action
  RETURN CASE action
    -- Dashboard access: all roles
    WHEN 'view_dashboard' THEN true

    -- Content management
    WHEN 'manage_news' THEN v_role IN ('admin', 'editor', 'moderator')
    WHEN 'manage_categories' THEN v_role IN ('admin', 'editor', 'moderator')
    WHEN 'manage_announcements' THEN v_role IN ('admin', 'editor', 'moderator')
    WHEN 'manage_events' THEN v_role IN ('admin', 'editor', 'moderator')
    WHEN 'manage_spirituality' THEN v_role IN ('admin', 'editor', 'moderator')
    WHEN 'manage_recommendations' THEN v_role IN ('admin', 'editor', 'moderator')

    -- People
    WHEN 'manage_leadership' THEN v_role IN ('admin', 'editor')
    WHEN 'manage_teachers' THEN v_role IN ('admin', 'editor')

    -- Media
    WHEN 'manage_gallery' THEN v_role IN ('admin', 'editor', 'moderator')
    WHEN 'manage_library' THEN v_role IN ('admin', 'librarian')
    WHEN 'manage_documents' THEN v_role IN ('admin', 'editor', 'moderator')

    -- School
    WHEN 'manage_programs' THEN v_role IN ('admin', 'editor')
    WHEN 'manage_achievements' THEN v_role IN ('admin', 'editor')
    WHEN 'manage_admission' THEN v_role IN ('admin', 'editor')

    -- Communication
    WHEN 'manage_messages' THEN v_role IN ('admin', 'moderator')

    -- Settings (admin gets limited access, editor/librarian/moderator get none)
    WHEN 'manage_settings' THEN v_role = 'admin'
    WHEN 'manage_hero' THEN v_role IN ('admin', 'editor')
    WHEN 'manage_statistics' THEN v_role IN ('admin', 'editor')
    WHEN 'manage_navigation' THEN v_role = 'admin'
    WHEN 'manage_about' THEN v_role IN ('admin', 'editor')

    -- Security — super_admin only (already returned true above)
    WHEN 'manage_admins' THEN false
    WHEN 'manage_logs' THEN false
    WHEN 'manage_roles' THEN false

    ELSE false
  END;
END;
$$;

-- Grant execute to authenticated role
GRANT EXECUTE ON FUNCTION is_authorized(text) TO authenticated;
