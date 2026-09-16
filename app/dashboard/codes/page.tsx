"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredCodes, updateCodeTarget, toggleCodeActive, QRCodeItem } from "@/lib/codes-store";

export default function CodesPage() {
  const [codes, setCodes] = useState<QRCodeItem[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  
  // Modal de Edição de Destino
  const [editingCode, setEditingCode] = useState<QRCodeItem | null>(null);
  const [newTargetUrl, setNewTargetUrl] = useState("");

  useEffect(() => {
    setCodes(getStoredCodes());
  }, []);

  const handleOpenEdit = (code: QRCodeItem) => {
    setEditingCode(code);
    setNewTargetUrl(code.target_url);
  };

  const handleSaveEdit = () => {
    if (!editingCode || !newTargetUrl.trim()) return;
    const updated = updateCodeTarget(editingCode.id, newTargetUrl.trim());
    setCodes(updated);
    setEditingCode(null);
  };

  const handleToggleActive = (id: string) => {
    const updated = toggleCodeActive(id);
    setCodes(updated);
  };

  const filtered = codes.filter(c => {
    if (filter === "active" && !c.active) return false;
    if (filter === "inactive" && c.active) return false;
    if (search && !c.label.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>QR Codes Dinâmicos</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            <span style={{ color: "var(--text)", fontWeight: 700 }}>{codes.length}</span> de{" "}
            <span style={{ color: "var(--text)", fontWeight: 700 }}>10</span> QR codes usados no plano Free
          </p>
        </div>
        <Link href="/dashboard/codes/new" style={{
          padding: "10px 22px", borderRadius: 10,
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700,
          boxShadow: "0 0 20px rgba(124,58,237,0.3)"
        }}>+ Novo QR Code</Link>
      </div>

      {/* Barra de Uso */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 12, padding: "16px 20px", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 16
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: "var(--text-muted)" }}>Capacidade de QR Codes</span>
            <span style={{ fontWeight: 700 }}>{codes.length} / 10</span>
          </div>
          <div style={{ height: 6, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
            <div style={{ width: `${(codes.length / 10) * 100}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #10b981, #06b6d4)" }} />
          </div>
        </div>
        <Link href="/dashboard/billing" style={{
          fontSize: 12, color: "#7c3aed", textDecoration: "none", fontWeight: 600,
          padding: "6px 14px", border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 8, whiteSpace: "nowrap", background: "rgba(124,58,237,0.05)"
        }}>⬆ Upgrade Pro</Link>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome/label..."
          style={{
            flex: 1, minWidth: 200, padding: "9px 16px", borderRadius: 9,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            color: "var(--text)", fontSize: 14, outline: "none"
          }}
        />
        {(["all", "active", "inactive"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600,
            border: filter === f ? "1px solid #7c3aed" : "1px solid var(--border)",
            background: filter === f ? "rgba(124,58,237,0.15)" : "var(--bg-card)",
            color: filter === f ? "#a78bfa" : "var(--text-muted)", cursor: "pointer"
          }}>
            {f === "all" ? "Todos" : f === "active" ? "Ativos" : "Inativos"}
          </button>
        ))}
      </div>

      {/* Tabela de QR Codes */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 16, overflow: "hidden"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.01)" }}>
              {["Design / Nome", "Short Link", "Destino Atual (Redirecionamento)", "Scans", "Status", "Ações"].map(h => (
                <th key={h} style={{
                  padding: "13px 20px", textAlign: "left",
                  fontSize: 11, color: "var(--text-muted)", fontWeight: 700,
                  letterSpacing: "0.5px", textTransform: "uppercase"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "60px 24px", textAlign: "center", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📱</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Nenhum QR Code encontrado</div>
                  <div style={{ fontSize: 13 }}>Crie seu primeiro QR Code para começar</div>
                </td>
              </tr>
            ) : filtered.map((code, i) => (
              <tr key={code.id} style={{
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none"
              }}>
                {/* Nome + Preview da Cor/Personalização */}
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, background: code.color || "#7c3aed",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 800, fontSize: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                    }}>
                      QR
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{code.label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{code.business_name || "Geral"}</div>
                    </div>
                  </div>
                </td>

                {/* Short Link (Impresso) */}
                <td style={{ padding: "16px 20px" }}>
                  <code style={{
                    fontSize: 12, background: "rgba(124,58,237,0.1)", padding: "4px 10px",
                    borderRadius: 6, color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)",
                    fontWeight: 600
                  }}>qrhub.io/r/{code.slug}</code>
                </td>

                {/* URL de Destino Editável */}
                <td style={{ padding: "16px 20px", maxWidth: 220 }}>
                  <span style={{
                    fontSize: 13, color: "#06b6d4", fontWeight: 500,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block"
                  }}>{code.target_url}</span>
                </td>

                {/* Scans */}
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 17 }}>{code.scans}</span>
                    <span style={{ fontSize: 11, color: "#10b981" }}>scans</span>
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: "16px 20px" }}>
                  <button onClick={() => handleToggleActive(code.id)} style={{
                    fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 100,
                    background: code.active ? "rgba(16,185,129,0.1)" : "rgba(107,107,138,0.1)",
                    color: code.active ? "#10b981" : "var(--text-muted)",
                    border: `1px solid ${code.active ? "rgba(16,185,129,0.3)" : "var(--border)"}`,
                    cursor: "pointer"
                  }}>{code.active ? "● Ativo" : "○ Pausado"}</button>
                </td>

                {/* Botão de Edição de Destino */}
                <td style={{ padding: "16px 20px" }}>
                  <button onClick={() => handleOpenEdit(code)} style={{
                    fontSize: 13, color: "#a78bfa",
                    fontWeight: 600, padding: "7px 14px", borderRadius: 8,
                    border: "1px solid rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.08)",
                    cursor: "pointer"
                  }}>
                    ✏️ Alterar Destino
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE EDIÇÃO DE DESTINO */}
      {editingCode && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20
        }}>
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border-bright)",
            borderRadius: 20, padding: 32, maxWidth: 500, width: "100%",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>✏️ Alterar Destino do QR Code</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
              Editando: <strong style={{ color: "var(--text)" }}>{editingCode.label}</strong> (`qrhub.io/r/{editingCode.slug}`)
            </p>

            <div style={{
              padding: 14, borderRadius: 10, background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.25)", marginBottom: 20
            }}>
              <div style={{ fontSize: 12, color: "#06b6d4", fontWeight: 600, marginBottom: 2 }}>
                ⚡ Redirecionamento Instantâneo
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Não é necessário reimprimir o QR Code. Quem escanear o QR impresso agora será levado imediatamente para o novo link.
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
                Nova URL de Destino (https://)
              </label>
              <input
                value={newTargetUrl}
                onChange={e => setNewTargetUrl(e.target.value)}
                placeholder="https://g.page/r/sua-empresa/review"
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 10,
                  background: "var(--bg)", border: "1px solid var(--border-bright)",
                  color: "var(--text)", fontSize: 14, outline: "none"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setEditingCode(null)} style={{
                flex: 1, padding: "12px", borderRadius: 10, background: "var(--bg)",
                border: "1px solid var(--border-bright)", color: "var(--text-muted)",
                fontSize: 14, fontWeight: 600, cursor: "pointer"
              }}>Cancelar</button>
              <button onClick={handleSaveEdit} style={{
                flex: 2, padding: "12px", borderRadius: 10,
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "white", border: "none", fontSize: 14, fontWeight: 700,
                cursor: "pointer", boxShadow: "0 0 16px rgba(124,58,237,0.3)"
              }}>Salvar Novo Destino ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
