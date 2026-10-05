import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Suspense fallback={<div style={{ width: 260, backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0" }} />}>
        <Sidebar />
      </Suspense>

      {/* Área Principal de Conteúdo */}
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }}>
        {children}
      </main>
    </div>
  );
}
