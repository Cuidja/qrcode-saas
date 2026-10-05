"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getStoredCodes, QRCodeItem } from "@/lib/codes-store";
import { getScanStats, emptyStats, ScanStats } from "@/lib/analytics";
import { renderCustomQRCode } from "@/lib/qr-renderer";
import { ScanStatsView } from "@/components/scan-stats-view";

function CodeDetailClient() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [code, setCode] = useState<QRCodeItem | null>(null);
  const [stats, setStats] = useState<ScanStats>(emptyStats());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const [codesResult, statsResult] = await Promise.all([getStoredCodes(), getScanStats(id)]);
      setCode(codesResult.codes.find((c) => c.id === id) ?? null);
      setStats(statsResult.stats);
      setError(codesResult.error || statsResult.error);
      setLoading(false);
    }
    load();
  }, [id]);

  const baseUrl = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
    : "http://localhost:3000";

  useEffect(() => {
    if (!code || !canvasRef.current) return;
    renderCustomQRCode(canvasRef.current, {
      text: `${baseUrl}/r/${code.slug}`,
      width: 260,
      color: code.color,
      bgColor: code.bg_color,
      shape: code.shape,
      cornerStyle: code.corner_style,
      frameStyle: code.cta_frame,
      frameText: code.cta_text,
      logoId: code.icon,
    });
  }, [code, baseUrl]);

  return (
    <div>
      <Link href="/dashboard/codes" style={{
        display: "inline-flex", alignItems: "center", gap: 6, color: "#0284c7",
        fontSize: 14, fontWeight: 700, textDecoration: "none", marginBottom: 20
      }}>
        <ArrowLeft size={16} /> Back
      </Link>

      {error && (
        <div role="alert" style={{
          backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b",
          borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13, fontWeight: 600
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: "#64748b", fontSize: 14 }}>Carregando...</div>
      ) : !code ? (
        <div style={{ color: "#0f172a", fontSize: 16, fontWeight: 700 }}>
          QR Code não encontrado (ou você não tem acesso a ele).
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 32, alignItems: "start" }}>
          <div style={{
            backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14,
            padding: 20, textAlign: "center"
          }}>
            <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 12, wordBreak: "break-all" }}>
              {baseUrl.replace(/^https?:\/\//, "")}/r/{code.slug}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0", wordBreak: "break-all" }}>
                {code.label}
              </h1>
              <div style={{ fontSize: 13, color: "#475569", wordBreak: "break-all" }}>
                ↳ {code.target_url} · {code.active ? "Active" : "Paused"} · criado em {code.created_at}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                Para alterar o destino ou pausar, volte para a lista de QR Codes.
              </div>
            </div>
            <ScanStatsView stats={stats} />
          </div>
        </div>
      )}
    </div>
  );
}
export default function CodeDetailPage() { return <Suspense fallback={<div>Carregando...</div>}><CodeDetailClient /></Suspense>; }
