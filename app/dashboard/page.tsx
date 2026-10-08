"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredCodes, QRCodeItem } from "@/lib/codes-store";

export default function DashboardPage() {
  const [codes, setCodes] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { codes } = await getStoredCodes();
      setCodes(codes);
      setLoading(false);
    }
    load();
  }, []);

  const totalScans = codes.reduce((acc, code) => acc + code.scans, 0);
  const activeCodes = codes.filter(c => c.active).length;
  const recentCodes = codes.slice(0, 5);

  const getAppBaseUrl = () => {
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    }
    return "";
  };

  if (loading) {
    return <div style={{ padding: "40px 0", color: "#64748b" }}>Carregando seu dashboard...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6, color: "#0f172a" }}>
          Welcome back! 👋
        </h1>
        <p style={{ color: "#64748b", fontSize: 15 }}>
          Here is a summary of your QR Codes performance.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16, marginBottom: 40
      }}>
        <div style={{
          background: "#ffffff", border: "1px solid #e2e8f0",
          borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Total Scans</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" }}>{totalScans}</div>
            </div>
            <div style={{ fontSize: 24 }}>📡</div>
          </div>
        </div>

        <div style={{
          background: "#ffffff", border: "1px solid #e2e8f0",
          borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Active QR Codes</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" }}>{activeCodes}</div>
            </div>
            <div style={{ fontSize: 24 }}>✅</div>
          </div>
        </div>
        
        <div style={{
          background: "#ffffff", border: "1px solid #e2e8f0",
          borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Total Created</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" }}>{codes.length}</div>
            </div>
            <div style={{ fontSize: 24 }}>📱</div>
          </div>
        </div>
      </div>

      {/* QR Codes recentes */}
      <div style={{
        background: "#ffffff", border: "1px solid #e2e8f0",
        borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #e2e8f0",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>Recent QR Codes</h2>
          <Link href="/dashboard/codes" style={{
            fontSize: 13, color: "#0284c7", textDecoration: "none", fontWeight: 700
          }}>View all →</Link>
        </div>

        {recentCodes.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            You haven't created any QR codes yet. <Link href="/dashboard/codes/new" style={{ color: "#0284c7", fontWeight: 600 }}>Create your first</Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                  {["Name", "Short Link", "Scans", "Status", ""].map(h => (
                    <th key={h} style={{
                      padding: "12px 24px", textAlign: "left",
                      fontSize: 12, color: "#64748b", fontWeight: 700, letterSpacing: "0.5px",
                      textTransform: "uppercase"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentCodes.map((code, i) => (
                  <tr key={code.id} style={{
                    borderBottom: i < recentCodes.length - 1 ? "1px solid #e2e8f0" : "none",
                  }}>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{code.label}</div>
                      <div style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>{code.target_url}</div>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <code style={{
                        fontSize: 12, background: "#f1f5f9", padding: "4px 8px",
                        borderRadius: 6, color: "#0284c7", fontWeight: 600
                      }}>{getAppBaseUrl().replace(/^https?:\/\//, "")}/r/{code.slug}</code>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{code.scans}</span>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 12,
                        backgroundColor: code.active ? "#dcfce7" : "#f1f5f9",
                        color: code.active ? "#15803d" : "#64748b"
                      }}>{code.active ? "Active" : "Paused"}</span>
                    </td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <Link href={`/dashboard/codes/${code.id}`} style={{
                        fontSize: 13, color: "#0284c7", textDecoration: "none", fontWeight: 700
                      }}>Analytics →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
