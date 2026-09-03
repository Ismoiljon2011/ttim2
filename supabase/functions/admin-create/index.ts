import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;

    // Extract the user's JWT from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create a client with the caller's JWT to verify their identity and role
    const userClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Check that the caller is a super_admin
    const { data: callerProfile, error: profileError } = await userClient
      .from("admin_profiles")
      .select("role, is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError || !callerProfile) {
      return new Response(
        JSON.stringify({ error: "Admin profile not found" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (callerProfile.role !== "super_admin" || !callerProfile.is_active) {
      return new Response(
        JSON.stringify({ error: "Only Super Admin can create new administrators" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Parse the request body
    const { email, password, username, full_name, role } = await req.json();

    // Validate inputs
    if (!email || !password || !username) {
      return new Response(
        JSON.stringify({ error: "Email, password, and username are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const validRoles = ["super_admin", "admin", "editor", "librarian", "moderator"];
    const assignedRole = validRoles.includes(role) ? role : "editor";

    // Check for duplicate username
    const { data: existing } = await userClient
      .from("admin_profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "This username is already taken" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Use service role client to create the auth user
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Create the admin profile
    const { error: profileInsertError } = await adminClient
      .from("admin_profiles")
      .insert({
        user_id: authData.user.id,
        username,
        full_name: full_name || null,
        role: assignedRole,
        is_active: true,
      });

    if (profileInsertError) {
      // Attempt to clean up the auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return new Response(
        JSON.stringify({ error: profileInsertError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Log the activity
    await adminClient.from("activity_logs").insert({
      admin_id: user.id,
      admin_username: username,
      action: "create_admin",
      resource_type: "admin",
      resource_id: authData.user.id,
      details: `Created admin: ${username} (${assignedRole})`,
    });

    return new Response(
      JSON.stringify({ success: true, user_id: authData.user.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
