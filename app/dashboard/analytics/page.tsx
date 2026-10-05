"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredCodes, QRCodeItem } from "@/lib/codes-store";
import { getScanStats, emptyStats, ScanStats } from "@/lib/analytics";
import { ScanStatsView } from "@/components/scan-stats-view";

export default function AnalyticsPage() {
  const [codes, setCodes] = useState<QRCodeItem[]>([]);
  const [stats, setStats] = useState<ScanStats>(emptyStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [codesResult, statsResult] = await Promise.all([getStoredCodes(), getScanStats()]);
      setCodes(codesResult.codes);
      setStats(statsResult.stats);
      setError(codesResult.error || statsResult.error);
      setLoading(false);
    }
    load();
  }, []);

  const ranking = [...codes].sort((a, b) => (stats.perCode[b.id] || b.scans) - (stats.perCode[a.id] || a.scans));

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 24px 0", letterSpacing: "-0.5px" }}>
        Analytics
      </h1>

      {error && (
        <div role="alert" style={{
          backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
          borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13, fontWeight: 600
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: "#64748b", fontSize: 14 }}>Carregando analytics...</div>
      ) : (
        <>
          <ScanStatsView stats={stats} />

          <div style={{
            backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14,
            padding: "18px 22px", marginTop: 20
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>QR Codes mais escaneados</div>
            {ranking.length === 0 ? (
              <div style={{ fontSize: 13, color: "#94a3b8" }}>Você ainda não criou nenhum QR Code.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {ranking.map((code) => (
                    <tr key={code.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 0" }}>
                        <Link href={`/dashboard/codes/${code.id}`} style={{ color: "#0284c7", fontWeight: 700, textDecoration: "none" }}>
                          {code.label}
                        </Link>
                      </td>
                      <td style={{ padding: "10px 0", color: "#64748b" }}>{code.active ? "Active" : "Paused"}</td>
                      <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 800, color: "#0f172a" }}>
                        {stats.perCode[code.id] ?? code.scans}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
