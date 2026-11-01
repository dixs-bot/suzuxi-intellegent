import { Users, Flame, MessageCircle, Target, ArrowUpRight, Bot, Clock3 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
export const dynamic="force-dynamic";
export default async function Dashboard() {
 const supabase=await createSupabaseServerClient();
 const [{data:leads},{count:total},{count:hot},{count:consented}] = await Promise.all([
  supabase.from("leads").select("*").order("created_at",{ascending:false}).limit(8),
  supabase.from("leads").select("*",{count:"exact",head:true}),
  supabase.from("leads").select("*",{count:"exact",head:true}).gte("lead_score",75),
  supabase.from("leads").select("*",{count:"exact",head:true}).eq("consent_to_contact",true)
 ]);
 return <div className="mx-auto max-w-7xl space-y-7">
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="text-sm text-muted">Dashboard · Bandung</div><h1 className="mt-1 text-2xl font-bold tracking-tight">Overview penjualan</h1><p className="mt-1 text-sm text-muted">Data langsung dari Supabase.</p></div><Link href="/leads" className="rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white">+ Tambah prospek</Link></div>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total prospek" value={String(total??0)} detail="Total data dalam database" icon={Users}/><StatCard label="Hot leads" value={String(hot??0)} detail="Skor potensi ≥ 75" icon={Flame} tone="amber"/><StatCard label="Boleh dihubungi" value={String(consented??0)} detail="Memiliki persetujuan kontak" icon={MessageCircle} tone="green"/><StatCard label="Rasio kualifikasi" value="—" detail="Metrik akan ditambahkan" icon={Target} tone="violet"/></div>
  <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
   <section className="rounded-2xl border border-line bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><div><h2 className="font-bold">Prospek terbaru</h2><p className="mt-1 text-xs text-muted">Data real-time dari database</p></div><Link href="/leads" className="text-xs font-semibold text-brand">Lihat semua <ArrowUpRight className="inline" size={14}/></Link></div>
    <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="text-xs text-muted"><tr className="border-b border-line"><th className="pb-3 font-medium">Nama</th><th className="pb-3 font-medium">Sumber</th><th className="pb-3 font-medium">Minat unit</th><th className="pb-3 font-medium">Skor</th><th className="pb-3 font-medium">Status</th></tr></thead><tbody>{(leads||[]).map((l:any)=><tr key={l.id} className="border-b border-slate-50"><td className="py-3 font-semibold">{l.full_name}</td><td className="py-3 text-muted">{l.source||"—"}</td><td className="py-3">{l.vehicle_interest||"Belum diketahui"}</td><td className="py-3">{l.lead_score??0}</td><td className="py-3"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700">{l.lead_status||"new"}</span></td></tr>)}{(!leads||leads.length===0)&&<tr><td colSpan={5} className="py-8 text-center text-sm text-muted">Belum ada prospek. Tambahkan data pertama Anda.</td></tr>}</tbody></table></div>
   </section>
   <section className="rounded-2xl border border-line bg-white p-5 shadow-soft"><div className="flex items-center gap-2"><Bot className="text-brand"/><h2 className="font-bold">AI Agent Control</h2></div><p className="mt-2 text-sm text-muted">Agen AI menunggu sumber data dan kanal resmi dihubungkan.</p><div className="mt-5 space-y-3">{[["Prospect Hunter","Menunggu sumber prospek terhubung"],["Engagement Agent","Menunggu webhook kanal resmi"],["Qualification Agent","Siap menilai data prospek"]].map(([name,desc])=><div key={name} className="rounded-xl bg-soft p-3"><div className="flex justify-between text-sm font-semibold"><span>{name}</span><span className="text-xs font-medium text-amber-600">Setup</span></div><p className="mt-1 text-xs text-muted">{desc}</p></div>)}</div><Link href="/integrations" className="mt-4 block rounded-xl border border-line px-3 py-2.5 text-center text-sm font-semibold hover:bg-slate-50">Konfigurasi integrasi</Link></section>
  </div><div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-blue-900"><Clock3 size={17}/> Keamanan aktif</div><p className="mt-1 text-xs leading-5 text-blue-800">Dashboard membutuhkan sesi Supabase Auth. Operasi data menggunakan anon key dengan kebijakan RLS; service role hanya untuk pekerjaan server tepercaya.</p></div>
 </div>;
}
