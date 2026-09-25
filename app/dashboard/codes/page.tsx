"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart2, 
  Edit2, 
  Palette, 
  MoreVertical, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  Download,
  Trash2
} from "lucide-react";
import { getStoredCodes, updateCodeTarget, toggleCodeActive, deleteCodeItem, QRCodeItem } from "@/lib/codes-store";
import { renderCustomQRCode } from "@/lib/qr-renderer";

// Componente para renderizar a miniatura real do QR Code de cada Card
function QRThumbnail({ code }: { code: QRCodeItem }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const baseUrl = typeof window !== "undefined"
        ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
        : "http://localhost:3000";

      renderCustomQRCode(canvasRef.current, {
        text: `${baseUrl}/r/${code.slug}`,
        width: 100,
        color: code.color || "#0f172a",
        bgColor: code.bg_color || "#ffffff",
        shape: code.shape || "square",
        cornerStyle: code.corner_style || "square",
        frameStyle: code.cta_frame || "bottom_banner",
        frameText: code.cta_text || "Scan Me",
        logoId: code.icon || "none"
      });
    }
  }, [code]);

  return (
    <div style={{
      width: 110, height: 110, backgroundColor: "#ffffff",
      border: "1px solid #e2e8f0", borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 6, boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
    }}>
      <canvas ref={canvasRef} style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 6 }} />
    </div>
  );
}

export default function CodesPage() {
  const [codes, setCodes] = useState<QRCodeItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal de Edição de Destino
  const [editingCode, setEditingCode] = useState<QRCodeItem | null>(null);
  const [newTargetUrl, setNewTargetUrl] = useState("");

  useEffect(() => {
    setCodes(getStoredCodes());
  }, []);

  const getAppBaseUrl = () => {
    if (typeof window !== "undefined") {
      return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    }
    return "http://localhost:3000";
  };

  const handleCopyLink = (code: QRCodeItem) => {
    const fullUrl = `${getAppBaseUrl()}/r/${code.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(code.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenEdit = (code: QRCodeItem) => {
    setEditingCode(code);
    setNewTargetUrl(code.target_url);
  };

  const handleSaveEdit = async () => {
    if (!editingCode || !newTargetUrl.trim()) return;
    const updated = await updateCodeTarget(editingCode.id, newTargetUrl.trim());
    setCodes(updated);
    setEditingCode(null);
  };

  const handleToggleActive = async (id: string) => {
    const updated = await toggleCodeActive(id);
    setCodes(updated);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este QR Code?")) {
      const updated = await deleteCodeItem(id);
      setCodes(updated);
    }
  };

  const filteredCodes = codes.filter(c => {
    if (filterStatus === "active" && !c.active) return false;
    if (filterStatus === "inactive" && c.active) return false;
    if (searchQuery && !c.label.toLowerCase().includes(searchQuery.toLowerCase()) && !c.target_url.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div>
      {/* Top Bar Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
            All QR Codes
          </h1>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <a
            href="https://productmate.com/pt-br/gerador-de-link-de-avaliacao-google"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#fffbebf5",
              color: "#b45309",
              border: "1px solid #fcd34d",
              padding: "10px 16px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
              boxShadow: "0 2px 6px rgba(245,158,11,0.1)",
              transition: "all 0.2s"
            }}
          >
            <span>⭐</span> Gerador de Link Google Reviews
          </a>

          <Link
            href="/dashboard/codes/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#0f172a",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(15,23,42,0.15)",
              transition: "all 0.2s"
            }}
          >
            <Plus size={18} /> CREATE QR CODE
          </Link>
        </div>
      </div>

      {/* Toolbar & Filter Controls (Padrão QRCG) */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 16, marginBottom: 24, flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Select Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{
              padding: "8px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff", color: "#334155", fontSize: 13, fontWeight: 600,
              outline: "none", cursor: "pointer"
            }}
          >
            <option value="all">Filters: All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Paused</option>
          </select>

          <span style={{ fontSize: 13, color: "#94a3b8" }}>|</span>

          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
            Showing <strong>{filteredCodes.length}</strong> codes
          </span>
        </div>

        {/* Input de Busca */}
        <div style={{ position: "relative", minWidth: 260 }}>
          <Search size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: 10 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Name or paste URL"
            style={{
              width: "100%", padding: "8px 14px 8px 36px", borderRadius: 8,
              border: "1px solid #cbd5e1", backgroundColor: "#ffffff",
              color: "#0f172a", fontSize: 13, outline: "none", boxSizing: "border-box"
            }}
          />
        </div>
      </div>

      {/* BANNER DICAS / TIPS (Padrão QRCG) */}
      <div style={{
        backgroundColor: "#e0f2fe", border: "1px solid #bae6fd",
        borderRadius: 12, padding: "16px 20px", marginBottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            TIPS
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0c4a6e", marginTop: 2 }}>
            Design QR Codes That Get Results
          </div>
          <div style={{ fontSize: 13, color: "#0369a1", marginTop: 2 }}>
            Drive more scans with clear, compelling QR code CTAs and custom shapes.
          </div>
        </div>

        <button style={{
          padding: "8px 16px", borderRadius: 20, border: "1px solid #0284c7",
          backgroundColor: "#ffffff", color: "#0284c7", fontSize: 12, fontWeight: 700,
          cursor: "pointer"
        }}>
          LEARN HOW ↗
        </button>
      </div>

      {/* CARDS HORIZONTAIS DE QR CODES (Estilo QRCG) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filteredCodes.length === 0 ? (
          <div style={{
            backgroundColor: "#ffffff", border: "1px dashed #cbd5e1",
            borderRadius: 16, padding: "60px 20px", textAlign: "center"
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Nenhum QR Code encontrado</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Crie seu primeiro QR Code dinâmico para começar a rastrear.</div>
          </div>
        ) : (
          filteredCodes.map(code => (
            <div
              key={code.id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease"
              }}
            >
              {/* Coluna 1: Thumbnail Real em Canvas */}
              <QRThumbnail code={code} />

              {/* Coluna 2: Informações de Link + Redirecionamento */}
              <div style={{ flex: 1 }}>
                {/* Título da URL principal */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <a
                    href={code.target_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 16, fontWeight: 800, color: "#0284c7", textDecoration: "none" }}
                  >
                    {code.label}
                  </a>

                  {/* Badges de Status */}
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 12,
                    backgroundColor: code.active ? "#dcfce7" : "#f1f5f9",
                    color: code.active ? "#15803d" : "#64748b"
                  }}>
                    {code.active ? "Active" : "Paused"}
                  </span>
                </div>

                {/* Short Link com atalho para copiar */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                    {getAppBaseUrl().replace(/^https?:\/\//, "")}/r/{code.slug}
                  </span>
                  <button
                    onClick={() => handleCopyLink(code)}
                    style={{
                      border: "none", background: "none", cursor: "pointer",
                      padding: 2, display: "inline-flex", alignItems: "center"
                    }}
                    title="Copiar Shortlink"
                  >
                    {copiedId === code.id ? <Check size={14} color="#16a34a" /> : <Copy size={14} color="#94a3b8" />}
                  </button>
                </div>

                {/* Atalho de Destino Editável em 1-clique */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#475569" }}>
                  <span>↳ {code.target_url}</span>
                  <button
                    onClick={() => handleOpenEdit(code)}
                    style={{
                      border: "none", background: "none", color: "#0284c7",
                      fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                    }}
                  >
                    <Edit2 size={13} /> Destination
                  </button>
                </div>
              </div>

              {/* Coluna 3: Estatísticas de Scans */}
              <div style={{ textAlign: "right", paddingRight: 16, borderRight: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                  <BarChart2 size={18} color="#64748b" />
                  <span style={{ fontSize: 22, fontWeight: 900, color: "#0f172a" }}>{code.scans}</span>
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginTop: 2 }}>scans</div>
              </div>

              {/* Coluna 4: Ações Rápida (Botões verticais) */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => handleOpenEdit(code)}
                  title="Editar Destino"
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}
                >
                  <Edit2 size={16} color="#475569" />
                </button>

                <Link
                  href="/dashboard/codes/new"
                  title="Personalizar Design"
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}
                >
                  <Palette size={16} color="#475569" />
                </Link>

                <button
                  onClick={() => {
                    const tempCanvas = document.createElement("canvas");
                    const baseUrl = typeof window !== "undefined"
                      ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
                      : "http://localhost:3000";

                    renderCustomQRCode(tempCanvas, {
                      text: `${baseUrl}/r/${code.slug}`,
                      width: 400,
                      color: code.color || "#0f172a",
                      bgColor: code.bg_color || "#ffffff",
                      shape: code.shape || "square",
                      cornerStyle: code.corner_style || "square",
                      frameStyle: code.cta_frame || "bottom_banner",
                      frameText: code.cta_text || "Scan Me",
                      logoId: code.icon || "none"
                    }).then(() => {
                      const a = document.createElement("a");
                      a.download = `qrcode-${code.slug}.png`;
                      a.href = tempCanvas.toDataURL("image/png");
                      a.click();
                    });
                  }}
                  title="Download PNG Alta Resolução"
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}
                >
                  <Download size={16} color="#0284c7" />
                </button>

                <button
                  onClick={() => handleDelete(code.id)}
                  title="Excluir"
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: "1px solid #fee2e2",
                    backgroundColor: "#fff5f5", cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}
                >
                  <Trash2 size={16} color="#ef4444" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE EDIÇÃO RÁPIDA DE DESTINO */}
      {editingCode && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20
        }}>
          <div style={{
            backgroundColor: "#ffffff", borderRadius: 16, padding: 32,
            maxWidth: 480, width: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>
              ✏️ Edit Destination
            </h3>
            <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 20px 0" }}>
              Update target URL for <strong>qrhub.io/r/{editingCode.slug}</strong>. The printed QR Code remains unchanged!
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Target URL (https://)
              </label>
              <input
                value={newTargetUrl}
                onChange={e => setNewTargetUrl(e.target.value)}
                placeholder="https://cuidja.com/novo-destino"
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "1px solid #cbd5e1", fontSize: 14, outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setEditingCode(null)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff", color: "#64748b", fontWeight: 600, cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 2, padding: "10px", borderRadius: 8, border: "none",
                  backgroundColor: "#0f172a", color: "#ffffff", fontWeight: 700, cursor: "pointer"
                }}
              >
                Save Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
