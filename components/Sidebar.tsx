"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Users, MessageSquare, Database, Settings, CarFront, Radio, ClipboardList, LogOut } from "lucide-react";
const links = [
 ["/", "Overview", LayoutDashboard], ["/leads", "Prospek", Users], ["/inbox", "Customer Inbox", MessageSquare],
 ["/knowledge", "Knowledge Center", Database], ["/vehicles", "Katalog Suzuki", CarFront],
 ["/integrations", "Integrasi", Radio], ["/tasks", "AI Tasks", ClipboardList], ["/settings", "Pengaturan", Settings]
] as const;
export function Sidebar() {
 const path = usePathname();
 return <aside className="w-full border-b border-line bg-white px-4 py-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-5">
  <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-brand p-2 text-white"><Bot size={22}/></div><div><div className="font-bold tracking-tight">Suzuki AI</div><div className="text-xs text-muted">Sales Intelligence</div></div></div>
  <div className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</div>
  <nav className="flex gap-1 overflow-x-auto md:flex-col">{links.map(([href,label,Icon])=><Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${path===href ? "bg-blue-50 font-semibold text-brand" : "text-slate-600 hover:bg-slate-50"}`}><Icon size={17}/>{label}</Link>)}</nav>
  <div className="mt-6 hidden rounded-2xl bg-soft p-4 md:block"><div className="text-sm font-semibold">Keamanan akun</div><p className="mt-2 text-xs leading-5 text-muted">Sesi login dikelola Supabase Auth. Data dibatasi dengan Row Level Security.</p></div>
  <form action="/auth/logout" method="post" className="mt-4 border-t border-line pt-4"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><LogOut size={17}/>Keluar</button></form>
  <div className="mt-4 hidden text-xs text-muted md:block">Bandung, Indonesia · v1.1</div>
 </aside>;
}
