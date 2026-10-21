"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getStoredCodes, QRCodeItem, isStaticCode } from "@/lib/codes-store";
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
    const isStatic = isStaticCode(code);
    const textToRender = isStatic ? code.target_url : `${baseUrl}/r/${code.slug}`;

    renderCustomQRCode(canvasRef.current, {
      text: textToRender,
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
            <div style={{ fontSize: 12, color: isStaticCode(code) ? "#7c3aed" : "#64748b", marginTop: 12, wordBreak: "break-all", fontWeight: 600 }}>
              {isStaticCode(code) ? `🏷️ Link Direto: ${code.target_url}` : `${baseUrl.replace(/^https?:\/\//, "")}/r/${code.slug}`}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0, wordBreak: "break-all" }}>
                  {code.label}
                </h1>
                <span style={{
                  fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 12,
                  backgroundColor: isStaticCode(code) ? "#faf5ff" : (code.active ? "#dcfce7" : "#f1f5f9"),
                  color: isStaticCode(code) ? "#7c3aed" : (code.active ? "#15803d" : "#64748b"),
                  border: isStaticCode(code) ? "1px solid #e9d5ff" : "none"
                }}>
                  {isStaticCode(code) ? "🏷️ QR Estático" : (code.active ? "Ativo" : "Pausado")}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#475569", wordBreak: "break-all" }}>
                ↳ {code.target_url} · criado em {code.created_at}
              </div>
            </div>

            {isStaticCode(code) ? (
              <div style={{
                backgroundColor: "#faf5ff", border: "1px solid #e9d5ff",
                borderRadius: 12, padding: "20px 24px", color: "#6b21a8"
              }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>
                  🏷️ Informações do QR Code Estático
                </div>
                <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6, color: "#581c87" }}>
                  Este código possui o link gravado diretamente nos seus pixels físicos e não passa pelos servidores do Qr Cuidja. 
                  Por ser 100% estático, ele <strong>nunca expira</strong> e <strong>não consome a cota do seu plano</strong>, mas não armazena estatísticas de escaneamento.
                </p>
              </div>
            ) : (
              <ScanStatsView stats={stats} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default function CodeDetailPage() { return <Suspense fallback={<div>Carregando...</div>}><CodeDetailClient /></Suspense>; }
