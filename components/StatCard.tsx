import type { LucideIcon } from "lucide-react";
export function StatCard({label,value,detail,icon:Icon,tone="blue"}:{label:string;value:string;detail:string;icon:LucideIcon;tone?:string}) {
 const tones:Record<string,string>={blue:"bg-blue-50 text-blue-700",green:"bg-emerald-50 text-emerald-700",amber:"bg-amber-50 text-amber-700",violet:"bg-violet-50 text-violet-700"};
 return <div className="rounded-2xl border border-line bg-white p-5 shadow-soft"><div className="flex items-center justify-between"><span className="text-sm text-muted">{label}</span><span className={`rounded-xl p-2 ${tones[tone]||tones.blue}`}><Icon size={18}/></span></div><div className="mt-3 text-3xl font-bold tracking-tight">{value}</div><div className="mt-1 text-xs text-muted">{detail}</div></div>;
}
