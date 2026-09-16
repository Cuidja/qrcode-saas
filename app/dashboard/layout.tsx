"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/dashboard/codes", label: "QR Codes", icon: "⊞" },
  { href: "/dashboard/reviews", label: "Avaliações", icon: "★" },
  { href: "/dashboard/settings", label: "Configurações", icon: "⚙" },
  { href: "/dashboard/billing", label: "Faturamento", icon: "◈" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="dashboard-area" style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0,
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
        background: "var(--bg-card)"
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid var(--border)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "white"
            }}>Q</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>QRHub</div>
              <div style={{
                fontSize: 11, color: "#7c3aed", fontWeight: 600,
                background: "rgba(124,58,237,0.1)", padding: "1px 8px",
                borderRadius: 100, display: "inline-block", marginTop: 2
              }}>Free</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 12px" }}>
          {NAV.map(item => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                textDecoration: "none", fontSize: 14, fontWeight: 500,
                color: active ? "white" : "var(--text-muted)",
                background: active ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(109,40,217,0.15))" : "transparent",
                border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                transition: "all 0.15s"
              }}>
                <span style={{ fontSize: 16, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div style={{
          padding: "16px 16px 20px",
          borderTop: "1px solid var(--border)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 14
            }}>U</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Minha Empresa</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>1 de 10 QR codes</div>
            </div>
          </div>
          <div style={{
            marginTop: 10, height: 4, borderRadius: 4,
            background: "var(--border)", overflow: "hidden"
          }}>
            <div style={{
              width: "10%", height: "100%", borderRadius: 4,
              background: "linear-gradient(90deg, #7c3aed, #06b6d4)"
            }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 64, borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px", position: "sticky", top: 0, zIndex: 40,
          background: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)"
        }}>
          <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
            {pathname === "/dashboard" && "Visão geral"}
            {pathname.startsWith("/dashboard/codes") && "QR Codes"}
            {pathname.startsWith("/dashboard/reviews") && "Avaliações"}
            {pathname.startsWith("/dashboard/settings") && "Configurações"}
            {pathname.startsWith("/dashboard/billing") && "Faturamento"}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/dashboard/codes/new" style={{
              padding: "8px 18px", borderRadius: 8,
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "white", textDecoration: "none", fontSize: 13, fontWeight: 600,
              boxShadow: "0 0 16px rgba(124,58,237,0.3)"
            }}>+ Novo QR Code</Link>
          </div>
        </header>

        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
