"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QrCode, BarChart3, HelpCircle, LogOut, TrendingUp } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const navItems = [
    { label: "All QR Codes", href: "/dashboard/codes", icon: QrCode },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  ];

  return (
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
        {/* Logo */}
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



        {/* Navegação Principal */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => {
            const Icon = item.icon;
            // Handle dynamic routes properly
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

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

      {/* Rodapé da Sidebar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px", fontSize: 13, color: "#64748b" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <HelpCircle size={15} /> Ajuda
          </span>
          <span onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#ef4444" }}>
            <LogOut size={15} /> Sair
          </span>
        </div>
      </div>
    </aside>
  );
}
