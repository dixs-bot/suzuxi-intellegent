
import { BookOpen } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type KnowledgeDocument = {
  id: string;
  title: string;
  source_type: string | null;
  is_verified: boolean;
  created_at: string;
};

export default async function Knowledge() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("knowledge_documents")
    .select("id, title, source_type, is_verified, created_at")
    .order("created_at", { ascending: false });

  const documents = (data ?? []) as KnowledgeDocument[];

  return (
    <main className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Knowledge Center</h1>
        <p className="mt-1 text-sm text-muted">
          Materi terverifikasi yang menjadi sumber informasi AI.
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-brand">
            <BookOpen />
          </div>

          <div>
            <h2 className="font-bold">
              Dokumen pengetahuan ({documents.length})
            </h2>
            <p className="text-xs text-muted">
              Data diambil langsung dari Supabase.
            </p>
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-red-600">
            Gagal mengambil dokumen: {error.message}
          </p>
        ) : (
          <div className="mt-5 divide-y divide-line">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {document.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {document.source_type ?? "Tidak diketahui"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] ${
                    document.is_verified
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {document.is_verified
                    ? "Terverifikasi"
                    : "Belum diverifikasi"}
                </span>
              </div>
            ))}

            {documents.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">
                Belum ada dokumen pengetahuan.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
