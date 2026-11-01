
import { BookOpen, ShieldCheck, ShieldAlert } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type KnowledgeDocument = {
  id: string;
  title: string;
  source_type: string | null;
  is_verified: boolean;
  created_at: string;
};

export default async function KnowledgePage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("knowledge_documents")
    .select("id, title, source_type, is_verified, created_at")
    .order("created_at", { ascending: false });

  const documents = (data ?? []) as KnowledgeDocument[];

  return (
    <main className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <section>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-3 text-brand">
            <BookOpen size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Knowledge Center
            </h1>
            <p className="mt-1 text-sm text-muted">
              Materi pengetahuan terverifikasi sebagai sumber informasi AI.
            </p>
          </div>
        </div>
      </section>

      {/* Knowledge Documents */}
      <section className="rounded-2xl border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Dokumen Pengetahuan
            </h2>
            <p className="mt-1 text-sm text-muted">
              Data dokumen yang tersimpan di Supabase.
            </p>
          </div>

          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {documents.length} Dokumen
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-700">
              <ShieldAlert size={18} />
              <p className="text-sm font-semibold">
                Gagal memuat dokumen
              </p>
            </div>

            <p className="mt-2 text-sm text-red-600">
              {error.message}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error && documents.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-line px-5 py-12 text-center">
            <BookOpen size={36} className="text-gray-400" />

            <h3 className="mt-4 font-semibold text-gray-800">
              Belum Ada Dokumen
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted">
              Dokumen pengetahuan AI belum tersedia. Data akan muncul
              setelah dokumen berhasil ditambahkan ke database.
            </p>
          </div>
        )}

        {/* Document List */}
        {!error && documents.length > 0 && (
          <div className="mt-5 divide-y divide-line">
            {documents.map((document) => (
              <article
                key={document.id}
                className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-gray-900">
                    {document.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span>
                      Sumber: {document.source_type || "Tidak diketahui"}
                    </span>

                    <span>
                      {new Date(document.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {document.is_verified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      <ShieldCheck size={14} />
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                      <ShieldAlert size={14} />
                      Belum Diverifikasi
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
