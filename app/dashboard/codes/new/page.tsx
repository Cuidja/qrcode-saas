"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { saveCodeItem, QRCodeItem } from "@/lib/codes-store";

function generateSlug(len = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const COLOR_PRESETS = [
  { name: "Azul Google", color: "#2563eb", bg: "#ffffff" },
  { name: "Roxo SaaS", color: "#7c3aed", bg: "#ffffff" },
  { name: "Verde WhatsApp", color: "#16a34a", bg: "#ffffff" },
  { name: "Vermelho / Rosa", color: "#dc2626", bg: "#ffffff" },
  { name: "Cyan Cyberpunk", color: "#06b6d4", bg: "#111118" },
  { name: "Dark Luxe", color: "#f3f4f6", bg: "#111118" },
];

const ICONS = [
  { id: "none", label: "Nenhum", svg: null },
  {
    id: "google",
    label: "Google",
    svg: `<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    svg: `<svg viewBox="0 0 24 24" width="32" height="32" fill="#25D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>`
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    svg: `<svg viewBox="0 0 24 24" width="32" height="32" fill="#06b6d4"><path d="M12 3c-4.97 0-9.5 2.01-12 5.25l2.5 2.5c1.94-2.58 5.6-4.25 9.5-4.25s7.56 1.67 9.5 4.25l2.5-2.5c-2.5-3.24-7.03-5.25-12-5.25zm0 6c-3.31 0-6.33 1.34-8.5 3.5l2.5 2.5c1.5-1.5 3.55-2.5 6-2.5s4.5 1 6 2.5l2.5-2.5c-2.17-2.16-5.19-3.5-8.5-3.5zm0 6c-1.66 0-3.17.67-4.25 1.75l4.25 4.25 4.25-4.25c-1.08-1.08-2.59-1.75-4.25-1.75z"/></svg>`
  },
  {
    id: "star",
    label: "Avaliação",
    svg: `<svg viewBox="0 0 24 24" width="32" height="32" fill="#eab308"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
  }
];

export default function NewCodePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [label, setLabel] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [business, setBusiness] = useState("");
  const [slug, setSlug] = useState("");

  // Customização Visual
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);
  const [selectedIcon, setSelectedIcon] = useState("google");
  const [ctaFrame, setCtaFrame] = useState<"badge" | "banner" | "simple">("banner");
  const [ctaText, setCtaText] = useState("SCAN ME");

  useEffect(() => {
    setSlug(generateSlug());
  }, []);

  const baseUrl = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
    : "http://localhost:3000";

  const shortLinkDisplay = baseUrl.replace(/^https?:\/\//, "") + `/r/${slug}`;
  const fullShortUrl = `${baseUrl}/r/${slug}`;

  async function renderQR() {
    if (!canvasRef.current) return;
    await QRCode.toCanvas(canvasRef.current, fullShortUrl, {
      width: 240,
      margin: 2,
      color: {
        dark: selectedColor.color,
        light: selectedColor.bg
      }
    });
  }

  function handleSaveAndFinish() {
    const newItem: QRCodeItem = {
      id: Date.now().toString(),
      label: label.trim(),
      slug: slug,
      target_url: targetUrl.trim(),
      business_name: business.trim() || "Minha Empresa",
      color: selectedColor.color,
      bg_color: selectedColor.bg,
      icon: selectedIcon,
      cta_frame: ctaFrame,
      cta_text: ctaText || "SCAN ME",
      scans: 0,
      active: true,
      created_at: new Date().toLocaleDateString("pt-BR")
    };

    saveCodeItem(newItem);
    setStep(4);
    setTimeout(renderQR, 100);
  }

  function handleNext() {
    if (step === 1) {
      if (!label.trim() || !targetUrl.trim()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      handleSaveAndFinish();
    }
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 10,
    background: "var(--bg)", border: "1px solid var(--border-bright)",
    color: "var(--text)", fontSize: 15, outline: "none"
  };

  const labelStyle = {
    display: "block", fontSize: 13, fontWeight: 600,
    color: "var(--text-muted)", marginBottom: 8
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>
          Novo QR Code Dinâmico
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Crie, personalize e publique em 4 passos simples
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 36 }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: step >= s
              ? "linear-gradient(90deg, #7c3aed, #06b6d4)"
              : "var(--border)"
          }} />
        ))}
      </div>

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 20, padding: 36
      }}>

        {/* STEP 1 — BÁSICO */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>1. Informações básicas</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
              Defina o nome de controle e a URL de destino inicial
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Nome do QR Code *</label>
              <input
                value={label} onChange={e => setLabel(e.target.value)}
                placeholder="Ex: Placa Mesa 01 - Google Reviews"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>URL de destino atual *</label>
              <input
                value={targetUrl} onChange={e => setTargetUrl(e.target.value)}
                placeholder="https://g.page/r/seu-negocio/review"
                style={inputStyle}
              />
              <p style={{ fontSize: 12, color: "#06b6d4", marginTop: 6, fontWeight: 500 }}>
                💡 Você poderá trocar esse link a qualquer momento no futuro sem alterar o QR Code impresso!
              </p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Short link gerado (Impresso no QR)</label>
              <div style={{
                padding: "12px 16px", borderRadius: 10,
                background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <code style={{ color: "#a78bfa", fontSize: 15, fontWeight: 600 }}>{shortLinkDisplay}</code>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>automático</span>
              </div>
            </div>

            <button onClick={handleNext} disabled={!label.trim() || !targetUrl.trim()} style={{
              width: "100%", padding: "13px", borderRadius: 10,
              background: (!label.trim() || !targetUrl.trim()) ? "var(--border)" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "white", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer"
            }}>
              Próximo →
            </button>
          </div>
        )}

        {/* STEP 2 — NEGÓCIO */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>2. Vincular negócio</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
              Identifique o estabelecimento para agrupar as métricas
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Nome da empresa ou local</label>
              <input
                value={business} onChange={e => setBusiness(e.target.value)}
                placeholder="Ex: Restaurante Sabor & Arte"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{
                flex: 1, padding: "13px", borderRadius: 10, background: "var(--bg)",
                border: "1px solid var(--border-bright)", color: "var(--text-muted)", cursor: "pointer"
              }}>← Voltar</button>
              <button onClick={handleNext} style={{
                flex: 2, padding: "13px", borderRadius: 10,
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "white", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer"
              }}>Personalizar Design 🎨 →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — PERSONALIZAÇÃO VISUAL */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>3. Personalização Visual</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
              Escolha as cores, o ícone central e o estilo da moldura
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 24, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Cores */}
                <div>
                  <label style={labelStyle}>Estilo de Cores</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {COLOR_PRESETS.map((p, idx) => (
                      <button key={idx} onClick={() => setSelectedColor(p)} style={{
                        padding: "10px", borderRadius: 10,
                        background: p.bg === "#ffffff" ? "#1a1a24" : "#0d0d12",
                        border: selectedColor.name === p.name ? "2px solid #7c3aed" : "1px solid var(--border)",
                        display: "flex", alignItems: "center", gap: 8, cursor: "pointer"
                      }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: p.color, border: "1px solid rgba(255,255,255,0.2)" }} />
                        <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ícones */}
                <div>
                  <label style={labelStyle}>Ícone Central</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {ICONS.map(icon => (
                      <button key={icon.id} onClick={() => setSelectedIcon(icon.id)} style={{
                        flex: 1, padding: "10px", borderRadius: 10,
                        background: selectedIcon === icon.id ? "rgba(124,58,237,0.15)" : "var(--bg)",
                        border: selectedIcon === icon.id ? "1px solid #7c3aed" : "1px solid var(--border)",
                        color: "var(--text)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6
                      }}>
                        {icon.svg ? (
                          <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
                        ) : (
                          <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>🚫</div>
                        )}
                        <span>{icon.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Moldura */}
                <div>
                  <label style={labelStyle}>Estilo da Moldura (Frame)</label>
                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    {[
                      { id: "badge", label: "Etiqueta SCAN ME" },
                      { id: "banner", label: "Banner Sólido" },
                      { id: "simple", label: "Texto Simples" }
                    ].map(f => (
                      <button key={f.id} onClick={() => setCtaFrame(f.id as any)} style={{
                        flex: 1, padding: "10px", borderRadius: 8,
                        background: ctaFrame === f.id ? "rgba(124,58,237,0.15)" : "var(--bg)",
                        border: ctaFrame === f.id ? "1px solid #7c3aed" : "1px solid var(--border)",
                        color: "var(--text)", fontSize: 12, fontWeight: 600, cursor: "pointer"
                      }}>{f.label}</button>
                    ))}
                  </div>

                  <input
                    value={ctaText} onChange={e => setCtaText(e.target.value)}
                    placeholder="Texto da moldura (ex: SCAN ME)"
                    style={inputStyle}
                  />
                </div>

              </div>

              {/* PREVIEW DA MOLDURA */}
              <div style={{
                background: selectedColor.bg, padding: 16, borderRadius: 16,
                border: "2px solid var(--border-bright)", textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", marginBottom: 10 }}>
                  Pré-visualização
                </div>

                <div style={{
                  position: "relative", width: 180, height: 180, margin: "0 auto",
                  background: selectedColor.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 12, border: `2px solid ${selectedColor.color}`
                }}>
                  <div style={{
                    width: 150, height: 150,
                    backgroundImage: `radial-gradient(${selectedColor.color} 2px, transparent 2px)`,
                    backgroundSize: "8px 8px"
                  }} />

                  {selectedIcon !== "none" && (
                    <div style={{
                      position: "absolute", width: 42, height: 42, borderRadius: "50%",
                      background: selectedColor.bg, border: `2px solid ${selectedColor.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                    }}>
                      <div dangerouslySetInnerHTML={{ __html: ICONS.find(i => i.id === selectedIcon)?.svg || "" }} />
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 14 }}>
                  {ctaFrame === "badge" && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
                      borderRadius: 20, background: selectedColor.color, color: "#fff",
                      fontSize: 12, fontWeight: 800, letterSpacing: "0.5px"
                    }}>
                      <span>📱</span> {ctaText || "SCAN ME"}
                    </div>
                  )}
                  {ctaFrame === "banner" && (
                    <div style={{
                      padding: "8px", borderRadius: 8, background: selectedColor.color,
                      color: "#fff", fontSize: 13, fontWeight: 800, textTransform: "uppercase"
                    }}>
                      {ctaText || "SCAN ME"}
                    </div>
                  )}
                  {ctaFrame === "simple" && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedColor.color }}>
                      {ctaText || "SCAN ME"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button onClick={() => setStep(2)} style={{
                flex: 1, padding: "13px", borderRadius: 10, background: "var(--bg)",
                border: "1px solid var(--border-bright)", color: "var(--text-muted)", cursor: "pointer"
              }}>← Voltar</button>
              <button onClick={handleNext} style={{
                flex: 2, padding: "13px", borderRadius: 10,
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "white", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer"
              }}>Salvar e Gerar QR Code →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — SUCESSO E DOWNLOAD */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 54, height: 54, borderRadius: 16,
              background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 26, marginBottom: 16
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>QR Code Salvo com Sucesso!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
              <strong style={{ color: "var(--text)" }}>{label}</strong> • {shortLinkDisplay}
            </p>

            <div style={{
              display: "inline-block", padding: 24, borderRadius: 24,
              background: selectedColor.bg, border: `2px solid ${selectedColor.color}`,
              marginBottom: 28, boxShadow: `0 0 50px ${selectedColor.color}33`, position: "relative"
            }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <canvas ref={canvasRef} style={{ display: "block", borderRadius: 12 }} />

                {selectedIcon !== "none" && (
                  <div style={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    width: 52, height: 52, borderRadius: "50%", background: selectedColor.bg,
                    border: `3px solid ${selectedColor.color}`, display: "flex", alignItems: "center",
                    justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: ICONS.find(i => i.id === selectedIcon)?.svg || "" }} />
                  </div>
                )}
              </div>

              <div style={{ marginTop: 16 }}>
                {ctaFrame === "badge" && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px",
                    borderRadius: 30, background: selectedColor.color, color: "#fff",
                    fontSize: 14, fontWeight: 800, letterSpacing: "0.5px"
                  }}>
                    <span>📱</span> {ctaText || "SCAN ME"}
                  </div>
                )}
                {ctaFrame === "banner" && (
                  <div style={{
                    padding: "10px", borderRadius: 10, background: selectedColor.color,
                    color: "#fff", fontSize: 14, fontWeight: 800, textTransform: "uppercase"
                  }}>
                    {ctaText || "SCAN ME"}
                  </div>
                )}
                {ctaFrame === "simple" && (
                  <div style={{ fontSize: 14, fontWeight: 800, color: selectedColor.color }}>
                    {ctaText || "SCAN ME"}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              <button onClick={() => {
                const link = document.createElement("a");
                link.download = `qr-${slug}.png`;
                link.href = canvasRef.current?.toDataURL() || "";
                link.click();
              }} style={{
                padding: "12px 24px", borderRadius: 10,
                background: "var(--bg)", border: "1px solid var(--border-bright)",
                color: "var(--text)", fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>⬇ Baixar PNG</button>

              <button onClick={() => navigator.clipboard.writeText(fullShortUrl)} style={{
                padding: "12px 24px", borderRadius: 10,
                background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)",
                color: "#a78bfa", fontSize: 14, fontWeight: 700, cursor: "pointer"
              }}>📋 Copiar Link Curto</button>
            </div>

            <button onClick={() => router.push("/dashboard/codes")} style={{
              width: "100%", padding: "14px", borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "white", border: "none", fontSize: 15, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 0 20px rgba(124,58,237,0.3)"
            }}>Ver Todos Meus QR Codes →</button>
          </div>
        )}

      </div>
    </div>
  );
}
