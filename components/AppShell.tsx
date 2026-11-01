"use client";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
export function AppShell({children}:{children:React.ReactNode}) {
 const pathname=usePathname();
 if(pathname==="/login") return <>{children}</>;
 return <div className="min-h-screen md:flex"><Sidebar/><main className="min-w-0 flex-1 p-4 md:p-8">{children}</main></div>;
}
