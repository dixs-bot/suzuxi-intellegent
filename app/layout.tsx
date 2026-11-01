import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
export const metadata: Metadata = { title: "Suzuki AI Sales Agent", description: "AI-powered Suzuki sales CRM" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><div className="min-h-screen md:flex"><Sidebar/><main className="min-w-0 flex-1 p-4 md:p-8">{children}</main></div></body></html>;
}
