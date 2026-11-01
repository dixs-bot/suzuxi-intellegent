import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAuthContext() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null, role: null as string | null };
  const { data: profile } = await supabase.from("profiles").select("role,full_name").eq("id", user.id).maybeSingle();
  return { supabase, user, role: profile?.role ?? null, profile };
}
export async function requireApiUser(allowedRoles: string[] = ["admin", "sales", "viewer"]) {
  const context = await getAuthContext();
  if (!context.user) return { context, response: NextResponse.json({ error: "Unauthenticated" }, { status: 401 }) };
  if (!context.role || !allowedRoles.includes(context.role)) return { context, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { context, response: null };
}
