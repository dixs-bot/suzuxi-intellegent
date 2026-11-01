import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  return value;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin));
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[Auth callback]", error.message);
      return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin));
    }

    return NextResponse.redirect(new URL(next, url.origin));
  } catch (error) {
    console.error("[Auth callback]", error);
    return NextResponse.redirect(new URL("/login?error=auth_callback", url.origin));
  }
}
