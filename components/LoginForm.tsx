"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Bot, LockKeyhole } from "lucide-react";

export function LoginForm({searchParams}:{searchParams:Promise<{setup?:string;next?:string}>}) {
 const router=useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
 const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const [setup,setSetup]=useState(false); const [nextPath,setNextPath]=useState("/");
 useEffect(()=>{let active=true;searchParams.then(p=>{if(active){setSetup(p.setup==="supabase");setNextPath(p.next||"/");}});return ()=>{active=false;};},[searchParams]);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");try{
  const supabase=createSupabaseBrowserClient();
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error) throw error;
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("Sesi login tidak dapat diverifikasi.");
  const {data:profile,error:profileError}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();
  if(profileError||!profile||!["admin","sales","viewer"].includes(profile.role)){
   await supabase.auth.signOut(); throw new Error("Akun belum memiliki profil akses. Hubungi administrator.");
  }
  router.replace(nextPath.startsWith("/")?nextPath:"/");router.refresh();
 }catch(err){setError(err instanceof Error?err.message:"Login gagal.");}finally{setBusy(false);}}
 return <div className="grid min-h-screen place-items-center bg-[#f4f7fb] p-4"><div className="w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-soft">
  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white"><Bot size={28}/></div>
  <h1 className="mt-5 text-center text-2xl font-bold">Suzuki AI Sales Agent</h1><p className="mt-1 text-center text-sm text-muted">Masuk ke dashboard administrator</p>
  {setup&&<div className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Supabase belum dikonfigurasi. Isi URL dan anon key di file .env.local, lalu restart server.</div>}
  <form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium">Email<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line px-3 py-3 outline-none focus:border-brand"/></label>
  <label className="block text-sm font-medium">Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line px-3 py-3 outline-none focus:border-brand"/></label>
  {error&&<div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
  <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold text-white disabled:opacity-60"><LockKeyhole size={17}/>{busy?"Memverifikasi...":"Masuk"}</button></form>
  <p className="mt-5 text-center text-xs leading-5 text-muted">Akses hanya untuk akun yang sudah dibuat dan diberi role di Supabase. Pendaftaran publik dinonaktifkan.</p>
 </div></div>;
}
