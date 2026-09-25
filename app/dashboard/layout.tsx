"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  QrCode, 
  BarChart3, 
  Folder, 
  Settings, 
  Zap, 
  Plus, 
  LogOut,
  HelpCircle,
  TrendingUp
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "All QR Codes", href: "/dashboard/codes", icon: QrCode },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Folders", href: "/dashboard/folders", icon: Folder },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Sidebar QRCG Clean Light Mode */}
      <aside style={{
        width: 260,
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 16px",
        position: "sticky",
        top: 0,
        height: "100vh",
        boxSizing: "border-box"
      }}>
        <div>
          {/* Logo QRCG por Bitly */}
          <div style={{ padding: "8px 12px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              backgroundColor: "#0284c7", color: "#ffffff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 18
            }}>
              <QrCode size={20} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.5px", color: "#0f172a" }}>
                QRCG <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>by Bitly</span>
              </div>
            </div>
          </div>

          {/* Weekly Scans Widget */}
          <div style={{
            backgroundColor: "#f8fafc",
            borderRadius: 10,
            padding: "14px 16px",
            border: "1px solid #e2e8f0",
            marginBottom: 20
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#64748b", fontWeight: 600 }}>
              <span>Weekly Scans</span>
              <TrendingUp size={14} color="#0284c7" />
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>2</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>since Sep 24th</span>
            </div>
          </div>

          {/* Navegação Principal */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#0284c7" : "#475569",
                    backgroundColor: isActive ? "#f0f9ff" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s ease"
                  }}
                >
                  <Icon size={18} color={isActive ? "#0284c7" : "#64748b"} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar - Overview do Plano */}
        <div>
          <div style={{
            padding: 14,
            borderRadius: 12,
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            marginBottom: 16
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              Overview
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginBottom: 6 }}>
              <span>Dynamic QR Codes</span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>2 of 250</span>
            </div>
            <div style={{ height: 6, backgroundColor: "#e2e8f0", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ width: "10%", height: "100%", backgroundColor: "#0284c7", borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>
              Trial ends in 13 days
            </div>
            <Link
              href="/dashboard/billing"
              style={{
                display: "block",
                textAlign: "center",
                padding: "7px 12px",
                borderRadius: 20,
                border: "1px solid #0284c7",
                color: "#0284c7",
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                backgroundColor: "#ffffff",
                transition: "all 0.15s"
              }}
            >
              UPGRADE
            </Link>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px", fontSize: 13, color: "#64748b" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <HelpCircle size={15} /> Ajuda
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#ef4444" }}>
              <LogOut size={15} /> Sair
            </span>
          </div>
        </div>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }}>
        {children}
      </main>
    </div>
  );
}
