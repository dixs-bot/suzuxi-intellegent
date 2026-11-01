// Compatibility export: use the cookie-bound server client in user-facing routes.
// Do not use a service-role client for ordinary dashboard/API requests.
export { createSupabaseServerClient } from "@/lib/supabase/server";
