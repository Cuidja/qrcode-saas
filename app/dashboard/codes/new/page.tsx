"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Globe, 
  Contact, 
  FileText, 
  Share2, 
  Instagram, 
  Image as ImageIcon, 
  Smartphone, 
  Video, 
  Calendar, 
  QrCode as QrIcon, 
  Music, 
  MessageSquare, 
  Star,
  ArrowLeft,
  Check,
  Download,
  RotateCcw
} from "lucide-react";
import { renderCustomQRCode } from "@/lib/qr-renderer";
import { saveCodeItem, QRCodeItem } from "@/lib/codes-store";

function generateSlug(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// Preset de Tipos de QR Code do QRCG
const CONTENT_TYPES = [
  { id: "website", title: "Website", desc: "Link to your website, any Google URL or document", icon: Globe },
  { id: "vcard", title: "vCard Plus", desc: "Share personalized contact details", icon: Contact },
  { id: "pdf", title: "PDF", desc: "Link to a mobile-optimized PDF", icon: FileText },
  { id: "social", title: "Social Media", desc: "Link to your social media channels", icon: Share2 },
  { id: "instagram", title: "Instagram", desc: "Link to your Instagram business page", icon: Instagram },
  { id: "images", title: "Images", desc: "Show a series of photos", icon: ImageIcon },
  { id: "app", title: "App", desc: "View your app on various App Stores", icon: Smartphone },
  { id: "video", title: "Video", desc: "Share one or more videos", icon: Video },
  { id: "event", title: "Event", desc: "Promote your event", icon: Calendar },
  { id: "2d", title: "2D Barcode", desc: "Supports GS1 standards", icon: QrIcon },
  { id: "mp3", title: "MP3", desc: "Play an audio file", icon: Music },
  { id: "feedback", title: "Feedback", desc: "Collect feedback and get rated", icon: MessageSquare },
  { id: "rating", title: "Rating", desc: "Ask a question and get rated", icon: Star },
];

// SVGs das Logos para centro do QR
const LOGO_PRESETS = [
  { id: "none", label: "Nenhum", svg: null },
  {
    id: "web",
    label: "Web / Globo",
    svg: `<svg viewBox="0 0 24 24" width="32" height="32" fill="#0284c7"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`
  },
  {
    id: "google",
    label: "Google",
    svg: `<svg viewBox="0 0 24 24" width="32" height="32"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    svg: `<svg viewBox="0 0 24 24" width="32" height="32" fill="#25D366"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>`
  }
];

export default function NewCodePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<string>("website");
  const [targetUrl, setTargetUrl] = useState("https://www.website.com");
  const [slug, setSlug] = useState("");

  // Estúdio de Design (Shapes, Frames, Corners, Colors)
  const [frameStyle, setFrameStyle] = useState<"none" | "badge" | "top_banner" | "bottom_banner">("bottom_banner");
  const [frameText, setFrameText] = useState("SCAN ME");
  const [selectedLogo, setSelectedLogo] = useState("web");
  const [shape, setShape] = useState<"square" | "rounded" | "dots" | "classy">("square");
  const [cornerStyle, setCornerStyle] = useState<"square" | "rounded" | "circle" | "leaf">("square");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    setSlug(generateSlug());
  }, []);

  const baseUrl = typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
    : "http://localhost:3000";

  const shortLink = `${baseUrl}/r/${slug}`;
  const shortLinkDisplay = shortLink.replace(/^https?:\/\//, "");

  // Renderizar o QR Code em tempo real no Canvas sempre que qualquer propriedade mudar
  useEffect(() => {
    if (step === 2 && canvasRef.current) {
      const logoSvg = LOGO_PRESETS.find(l => l.id === selectedLogo)?.svg || null;

      renderCustomQRCode(canvasRef.current, {
        text: shortLink,
        width: 260,
        color: qrColor,
        bgColor: bgColor,
        shape: shape,
        cornerStyle: cornerStyle,
        frameStyle: frameStyle,
        frameText: frameText,
        logoSvg: logoSvg
      });
    }
  }, [step, targetUrl, slug, frameStyle, frameText, selectedLogo, shape, cornerStyle, qrColor, bgColor]);

  const handleCreateType = () => {
    if (!targetUrl.trim()) return;
    setStep(2);
  };

  const handleCompleteCode = async () => {
    const newItem: QRCodeItem = {
      id: Date.now().toString(),
      label: targetUrl,
      slug: slug,
      target_url: targetUrl,
      type: selectedType as any,
      color: qrColor,
      bg_color: bgColor,
      icon: selectedLogo,
      shape: shape,
      corner_style: cornerStyle,
      cta_frame: frameStyle,
      cta_text: frameText,
      scans: 0,
      active: true,
      created_at: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    await saveCodeItem(newItem);
    router.push("/dashboard/codes");
  };

  return (
    <div>
      {/* Top Bar Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <button
          onClick={() => step === 2 ? setStep(1) : router.push("/dashboard/codes")}
          style={{
            border: "none", background: "none", color: "#0284c7", fontSize: 14,
            fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>
          {step === 1 ? "Step 1: Choose Type" : "Step 2: Customize QR Code"}
        </div>
      </div>

      {/* PASSO 1: CHOOSE YOUR QR CODE TYPE (Grid do QRCG) */}
      {step === 1 && (
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>
            Create your QR Code
          </h1>

          {/* Card Inicial: Website Input */}
          <div style={{
            backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
            borderRadius: 12, padding: 24, marginBottom: 32,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                <Globe size={20} color="#0284c7" /> Website
              </div>
              <span style={{ fontSize: 12, color: "#0284c7", fontWeight: 600, cursor: "pointer" }}>Bulk Create from CSV</span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
              Create this QR Code type to link to your website, any Google URL or document, your social media profile or any other page on the web.
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <input
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                placeholder="https://www.your-website.com"
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 8,
                  border: "1px solid #cbd5e1", fontSize: 14, outline: "none"
                }}
              />
              <button
                onClick={handleCreateType}
                style={{
                  padding: "12px 24px", borderRadius: 8, border: "none",
                  backgroundColor: "#0284c7", color: "#ffffff", fontWeight: 700,
                  fontSize: 14, cursor: "pointer"
                }}
              >
                CREATE
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "24px 0", color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>
            or select from more Dynamic Code types
          </div>

          {/* Grid de Tipos (QRCG Style) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {CONTENT_TYPES.slice(1).map(type => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    setTargetUrl(
                      type.id === "instagram" ? "https://instagram.com/seu-perfil" :
                      type.id === "pdf" ? "https://seusite.com/documento.pdf" :
                      type.id === "vcard" ? "https://qrhub.io/vcard" :
                      type.id === "rating" ? "https://g.page/r/seu-negocio/review" :
                      "https://www.your-website.com"
                    );
                    setStep(2);
                  }}
                  style={{
                    backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
                    borderRadius: 12, padding: 18, cursor: "pointer",
                    display: "flex", alignItems: "flex-start", gap: 14,
                    transition: "all 0.15s ease", boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, backgroundColor: "#f0f9ff",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Icon size={20} color="#0284c7" />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{type.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{type.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PASSO 2: CUSTOMIZE QR CODE (Editor Split-Screen Réplica QRCG) */}
      {step === 2 && (
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>
            Customize QR Code
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "start" }}>
            {/* COLUNA ESQUERDA: OPÇÕES DE CUSTOMIZAÇÃO */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* 0. TARGET DESTINATION LINK */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px 0" }}>
                  TARGET URL / DESTINATION
                </h3>
                <input
                  value={targetUrl}
                  onChange={e => setTargetUrl(e.target.value)}
                  placeholder="https://www.your-website.com"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 8,
                    border: "1px solid #cbd5e1", fontSize: 14, outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>

              {/* 1. FRAMES (Molduras) */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px 0" }}>
                  FRAMES
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                  {[
                    { id: "none", label: "No Frame" },
                    { id: "bottom_banner", label: "Bottom Banner" },
                    { id: "badge", label: "Badge Scan Me" },
                    { id: "top_banner", label: "Top Banner" }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFrameStyle(f.id as any)}
                      style={{
                        padding: "12px 8px", borderRadius: 10,
                        border: frameStyle === f.id ? "2px solid #0284c7" : "1px solid #cbd5e1",
                        backgroundColor: frameStyle === f.id ? "#f0f9ff" : "#ffffff",
                        color: frameStyle === f.id ? "#0284c7" : "#475569",
                        fontSize: 12, fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {frameStyle !== "none" && (
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                      FRAME TEXT
                    </label>
                    <input
                      value={frameText}
                      onChange={e => setFrameText(e.target.value)}
                      placeholder="SCAN ME"
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 8,
                        border: "1px solid #cbd5e1", fontSize: 13, outline: "none", boxSizing: "border-box"
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 2. LOGOS */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px 0" }}>
                  LOGOS
                </h3>

                <div style={{ display: "flex", gap: 12 }}>
                  {LOGO_PRESETS.map(logo => (
                    <button
                      key={logo.id}
                      onClick={() => setSelectedLogo(logo.id)}
                      style={{
                        width: 60, height: 60, borderRadius: 10,
                        border: selectedLogo === logo.id ? "2px solid #0284c7" : "1px solid #cbd5e1",
                        backgroundColor: selectedLogo === logo.id ? "#f0f9ff" : "#ffffff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer"
                      }}
                      title={logo.label}
                    >
                      {logo.svg ? (
                        <div dangerouslySetInnerHTML={{ __html: logo.svg }} />
                      ) : (
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>🚫</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. SHAPES (Formatos dos Pontos) */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px 0" }}>
                  SHAPES
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    { id: "square", label: "Squares" },
                    { id: "rounded", label: "Rounded" },
                    { id: "dots", label: "Dots" },
                    { id: "classy", label: "Classy" }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => setShape(s.id as any)}
                      style={{
                        padding: "12px", borderRadius: 10,
                        border: shape === s.id ? "2px solid #0284c7" : "1px solid #cbd5e1",
                        backgroundColor: shape === s.id ? "#f0f9ff" : "#ffffff",
                        color: shape === s.id ? "#0284c7" : "#475569",
                        fontSize: 13, fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. CORNERS (Cantos/Olhos) */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px 0" }}>
                  CORNERS
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    { id: "square", label: "Square" },
                    { id: "rounded", label: "Rounded" },
                    { id: "circle", label: "Circle" },
                    { id: "leaf", label: "Leaf" }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCornerStyle(c.id as any)}
                      style={{
                        padding: "12px", borderRadius: 10,
                        border: cornerStyle === c.id ? "2px solid #0284c7" : "1px solid #cbd5e1",
                        backgroundColor: cornerStyle === c.id ? "#f0f9ff" : "#ffffff",
                        color: cornerStyle === c.id ? "#0284c7" : "#475569",
                        fontSize: 13, fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. COLORS (Cores) */}
              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 16px 0" }}>
                  COLORS
                </h3>

                <div style={{ display: "flex", gap: 24 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                      QR CODE COLOR
                    </label>
                    <input
                      type="color"
                      value={qrColor}
                      onChange={e => setQrColor(e.target.value)}
                      style={{ width: 44, height: 44, border: "none", cursor: "pointer", borderRadius: 6 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                      BACKGROUND COLOR
                    </label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={e => setBgColor(e.target.value)}
                      style={{ width: 44, height: 44, border: "none", cursor: "pointer", borderRadius: 6 }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* COLUNA DIREITA: LIVE PREVIEW FIXO (Estilo QRCG) */}
            <div style={{ position: "sticky", top: 32 }}>
              <div style={{
                backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
                borderRadius: 16, padding: 32, textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 20 }}>
                  PREVIEW
                </div>

                {/* Canvas de Renderização */}
                <div style={{ display: "inline-block", padding: 12, backgroundColor: "#ffffff", borderRadius: 12, marginBottom: 20 }}>
                  <canvas ref={canvasRef} style={{ display: "block", maxWidth: "100%", height: "auto" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  <button
                    onClick={() => {
                      setFrameStyle("bottom_banner");
                      setFrameText("SCAN ME");
                      setSelectedLogo("web");
                      setShape("square");
                      setCornerStyle("square");
                      setQrColor("#000000");
                      setBgColor("#ffffff");
                    }}
                    style={{
                      border: "none", background: "none", color: "#64748b",
                      fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                    }}
                  >
                    <RotateCcw size={14} /> RESET DESIGN
                  </button>
                </div>

                <button
                  onClick={handleCompleteCode}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 8, border: "none",
                    backgroundColor: "#0284c7", color: "#ffffff", fontSize: 14, fontWeight: 800,
                    cursor: "pointer", boxShadow: "0 4px 12px rgba(2,132,199,0.2)"
                  }}
                >
                  COMPLETE YOUR CODE
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
