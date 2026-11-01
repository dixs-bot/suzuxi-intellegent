import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { context, response } = await requireApiUser([
      "admin",
      "sales",
      "viewer",
    ]);

    if (response) return response;

    const { data, error } = await context.supabase
      .from("knowledge_documents")
      .select("id, title, source_type, is_verified, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[API knowledge GET]", error);
      return NextResponse.json(
        { error: "Gagal mengambil dokumen pengetahuan." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (error) {
    console.error("[API knowledge GET]", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
