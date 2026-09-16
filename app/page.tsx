"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── Parallax hook ── */
function useParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return offset;
}

/* ── Scroll reveal hook ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
        }
      }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── Animated counter ── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = () => {
          start += to / 60;
          if (start < to) { setVal(Math.floor(start)); requestAnimationFrame(step); }
          else setVal(to);
        };
        requestAnimationFrame(step);
        io.disconnect();
      }
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString("pt-BR")}{suffix}</span>;
}

/* ── QR Preview floating widget ── */
function QRPreviewWidget({ parallax }: { parallax: { x: number; y: number } }) {
  return (
    <div style={{
      transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.4}px)`,
      transition: "transform 0.1s ease-out",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(32px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24,
        padding: 24,
        width: 260,
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.15)",
      }}>
        {/* QR fake visual */}
        <div style={{
          width: "100%", aspectRatio: "1/1", borderRadius: 12,
          background: "linear-gradient(135deg, #0f0f1f, #1a0a2e)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16, position: "relative", overflow: "hidden",
          border: "1px solid rgba(124,58,237,0.3)"
        }}>
          {/* QR pattern fakes — padrão determinístico */}
          {[
            [1,0,1,1,0,1],
            [1,1,0,1,1,0],
            [0,1,1,0,1,1],
            [1,0,1,1,0,1],
            [0,1,0,1,1,0],
            [1,1,1,0,0,1],
          ].map((row, ri) =>
            row.map((filled, ci) => (
              <div key={`${ri}-${ci}`} style={{
                position: "absolute",
                left: `${ci * 16 + 2}%`, top: `${ri * 16 + 2}%`,
                width: "14%", height: "14%", borderRadius: 3,
                background: filled
                  ? "linear-gradient(135deg,#7c3aed,#06b6d4)"
                  : "transparent",
                opacity: 0.8
              }} />
            ))
          )}
          {/* Center logo */}
          <div style={{
            width: 40, height: 40, borderRadius: 10, zIndex: 1,
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 18, color: "white",
            boxShadow: "0 0 20px rgba(124,58,237,0.6)"
          }}>Q</div>
        </div>

        {/* Info */}
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Restaurante Bella Vista</div>
        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12,
          fontFamily: "monospace"
        }}>qrhub.io/r/bell-vis</div>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ color: "#f59e0b", fontSize: 12 }}>★</span>
          ))}
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>4.9 · 312 avaliações</span>
        </div>

        {/* Scan counter */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 12px", borderRadius: 10,
          background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)"
        }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 1 }}>Scans hoje</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#a78bfa" }}>247</div>
          </div>
          <div style={{ fontSize: 20 }}>📡</div>
        </div>

        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%", background: "#10b981",
            boxShadow: "0 0 8px #10b981",
            animation: "pulse-ring 1.5s ease-out infinite"
          }} />
          <span style={{ fontSize: 11, color: "#10b981" }}>Ao vivo</span>
        </div>
      </div>
    </div>
  );
}

/* ── Floating badges ── */
function FloatingBadge({
  style, icon, text, delay
}: {
  style: React.CSSProperties;
  icon: string;
  text: string;
  delay: string;
}) {
  return (
    <div style={{
      position: "absolute",
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 100,
      padding: "8px 14px",
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 12, fontWeight: 600,
      whiteSpace: "nowrap",
      animation: `float 4s ease-in-out ${delay} infinite`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      ...style
    }}>
      <span>{icon}</span>
      <span style={{ color: "rgba(255,255,255,0.8)" }}>{text}</span>
    </div>
  );
}

/* ══════════════════════════════════════ */
export default function HomePage() {
  const parallax = useParallax();
  useScrollReveal();

  const revealStyle = (delay = "0s"): React.CSSProperties => ({
    opacity: 0,
    transform: "translateY(32px)",
    transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}`,
  });

  return (
    <>
      {/* ─── NAV ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
        background: "rgba(5,5,15,0.6)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color: "white",
            boxShadow: "0 0 16px rgba(124,58,237,0.5)"
          }}>Q</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.3px" }}>
            QRHub
          </span>
        </Link>

        {/* Links centrais */}
        <div style={{ display: "flex", gap: 4, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {["Produto", "Preços", "Docs"].map(l => (
            <a key={l} href="#" style={{
              padding: "7px 16px", borderRadius: 8, textDecoration: "none",
              fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.5)",
              transition: "color 0.2s, background 0.2s",
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = "white";
              (e.target as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              (e.target as HTMLElement).style.background = "transparent";
            }}>{l}</a>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/dashboard" style={{
            padding: "7px 18px", borderRadius: 8, textDecoration: "none",
            fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)",
            transition: "color 0.2s"
          }}>Entrar</Link>
          <Link href="/dashboard" className="btn-primary" style={{ padding: "8px 20px", fontSize: 13, borderRadius: 9 }}>
            Começar grátis →
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="grid-bg" style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Grid highlight on hover parallax */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at ${50 + parallax.x}% ${50 + parallax.y}%, rgba(124,58,237,0.06) 0%, transparent 60%)`,
          pointerEvents: "none", transition: "background 0.1s"
        }} />

        {/* Badge */}
        <div data-reveal style={{
          ...revealStyle("0s"),
          marginBottom: 28,
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "7px 16px", borderRadius: 100,
          backdropFilter: "blur(16px)",
        }}>
          <div className="shimmer-badge" style={{
            padding: "7px 16px", borderRadius: 100,
            border: "1px solid rgba(124,58,237,0.35)",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <span style={{ fontSize: 12 }}>✨</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#c4b5fd" }}>
              Novo: Gravação NFC direto pelo celular
            </span>
          </div>
        </div>

        {/* Headline */}
        <div data-reveal style={{ ...revealStyle("0.1s"), textAlign: "center", marginBottom: 24 }}>
          <h1 style={{
            fontSize: "clamp(44px, 7vw, 82px)",
            fontWeight: 900, letterSpacing: "-3px", lineHeight: 1.05,
          }}>
            <span className="text-gradient">QR Codes que</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.15)", WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
              convertem
            </span>
            <span className="text-gradient"> clientes</span>
          </h1>
        </div>

        {/* Subheadline */}
        <div data-reveal style={{ ...revealStyle("0.2s"), textAlign: "center", marginBottom: 44 }}>
          <p style={{
            fontSize: "clamp(16px, 2.5vw, 20px)", color: "rgba(255,255,255,0.45)",
            maxWidth: 520, lineHeight: 1.65, fontWeight: 400
          }}>
            Crie QR Codes dinâmicos, conecte com{" "}
            <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>Google Reviews</span>,
            grave tags NFC e acompanhe cada scan em{" "}
            <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>tempo real</span>.
          </p>
        </div>

        {/* CTAs */}
        <div data-reveal style={{ ...revealStyle("0.3s"), display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 72 }}>
          <Link href="/dashboard" className="btn-primary">
            Criar QR Code grátis →
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Ver demonstração ↗
          </Link>
        </div>

        {/* Hero visual — QR widget + floating badges */}
        <div data-reveal style={{
          ...revealStyle("0.4s"),
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "100%", maxWidth: 900,
        }}>
          {/* Main card */}
          <div style={{
            transform: `translate(${parallax.x * 0.2}px, ${parallax.y * 0.2}px)`,
            transition: "transform 0.1s ease-out",
            position: "relative",
          }}>
            <QRPreviewWidget parallax={parallax} />
          </div>

          {/* Floating badge: NFC */}
          <FloatingBadge
            style={{ top: "-30px", left: "calc(50% - 220px)" }}
            icon="📶" text="Tag NFC gravada" delay="0s"
          />

          {/* Floating badge: Scan */}
          <FloatingBadge
            style={{ top: "20px", right: "calc(50% - 240px)" }}
            icon="⚡" text="+12 scans agora" delay="-1.5s"
          />

          {/* Floating badge: Stars */}
          <FloatingBadge
            style={{ bottom: "10px", left: "calc(50% - 200px)" }}
            icon="⭐" text="Nova avaliação 5★" delay="-0.8s"
          />

          {/* Glow under widget */}
          <div style={{
            position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
            width: 200, height: 60,
            background: "radial-gradient(ellipse, rgba(124,58,237,0.4) 0%, transparent 70%)",
            filter: "blur(20px)", pointerEvents: "none"
          }} />
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ padding: "80px 24px", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 1, overflow: "hidden", borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.07)"
          }}>
            {[
              { value: 12400, suffix: "+", label: "QR Codes ativos" },
              { value: 98, suffix: "%", label: "Uptime garantido" },
              { value: 50, suffix: "ms", label: "Latência média" },
              { value: 4900, suffix: "+", label: "Scans hoje" },
            ].map((s, i) => (
              <div key={i} data-reveal style={{
                ...revealStyle(`${i * 0.08}s`),
                padding: "36px 28px", textAlign: "center",
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(12px)",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none"
              }}>
                <div style={{
                  fontSize: 44, fontWeight: 900, letterSpacing: "-2px",
                  marginBottom: 6,
                  background: "linear-gradient(135deg, #f0f0ff, #c4b5fd)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: "60px 24px 100px", maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal style={{ ...revealStyle("0s"), textAlign: "center", marginBottom: 60 }}>
          <div style={{
            display: "inline-block", fontSize: 12, fontWeight: 700,
            color: "#a78bfa", letterSpacing: "2px", textTransform: "uppercase",
            marginBottom: 16, padding: "5px 14px",
            border: "1px solid rgba(124,58,237,0.25)", borderRadius: 100,
            background: "rgba(124,58,237,0.06)"
          }}>Funcionalidades</div>
          <h2 style={{
            fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 800,
            letterSpacing: "-1.5px", lineHeight: 1.15
          }}>
            <span className="text-gradient">Tudo que você precisa</span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.25)" }}>num só lugar</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20
        }}>
          {[
            {
              icon: "⚡",
              color: "#f59e0b",
              title: "Redirect instantâneo",
              desc: "Edge Runtime global com < 50ms de latência. Mude o destino do QR a qualquer momento sem reimprimir.",
              tag: "Edge Runtime"
            },
            {
              icon: "⭐",
              color: "#f59e0b",
              title: "Google Reviews integrado",
              desc: "Conecte com Google Business Profile. Suas avaliações sincronizam automaticamente a cada 6 horas.",
              tag: "OAuth 2.0"
            },
            {
              icon: "📶",
              color: "#06b6d4",
              title: "Gravação NFC nativa",
              desc: "Grave tags NFC pelo próprio Chrome no Android. Sem app externo. QR impresso como fallback universal.",
              tag: "Web NFC API"
            },
            {
              icon: "📊",
              color: "#7c3aed",
              title: "Analytics em tempo real",
              desc: "Veja scans por cidade, país e horário. Dados que ajudam a entender seus clientes.",
              tag: "Tempo real"
            },
            {
              icon: "🎨",
              color: "#a855f7",
              title: "QR totalmente customizável",
              desc: "Escolha forma dos pontos, cores, adicione logo. Exporte em PNG (512–2048px) ou SVG.",
              tag: "qr-code-styling"
            },
            {
              icon: "🏷️",
              color: "#10b981",
              title: "Plaquinha pronta para imprimir",
              desc: "Preview WYSIWYG com logo, estrelas e QR. Formatos 10×10cm, 15×15cm e A6. Download PDF.",
              tag: "React PDF"
            },
          ].map((f, i) => (
            <div key={i} className="feature-card" data-reveal style={{ ...revealStyle(`${i * 0.06}s`) }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, marginBottom: 20,
                background: `radial-gradient(circle, ${f.color}22 0%, transparent 70%)`,
                border: `1px solid ${f.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20
              }}>{f.icon}</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{f.title}</h3>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.5px", textTransform: "uppercase"
                }}>{f.tag}</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section style={{ padding: "60px 24px 120px" }} id="precos">
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div data-reveal style={{ ...revealStyle(), textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-block", fontSize: 12, fontWeight: 700,
              color: "#a78bfa", letterSpacing: "2px", textTransform: "uppercase",
              marginBottom: 16, padding: "5px 14px",
              border: "1px solid rgba(124,58,237,0.25)", borderRadius: 100,
              background: "rgba(124,58,237,0.06)"
            }}>Preços</div>
            <h2 style={{
              fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 800,
              letterSpacing: "-1.5px"
            }}>
              <span className="text-gradient">Simples e transparente</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", marginTop: 12 }}>
              Sem fidelidade. Cancele quando quiser. Pix ou cartão.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20
          }}>
            {[
              {
                name: "Free", price: "R$ 0", per: "para sempre",
                features: ["1 QR Code dinâmico", "Short link qrhub.io", "Analytics básico", "Download PNG"],
                cta: "Começar grátis", accent: "rgba(255,255,255,0.2)"
              },
              {
                name: "Pro", price: "R$ 29", per: "/mês", highlight: true,
                features: ["10 QR Codes dinâmicos", "Google Reviews integrado", "Gravação NFC (Android)", "Download SVG + PNG", "Plaquinha para impressão", "Cores e logo customizáveis"],
                cta: "Assinar Pro", accent: "#7c3aed"
              },
              {
                name: "Business", price: "R$ 99", per: "/mês",
                features: ["50 QR Codes dinâmicos", "Multi-usuário (5 membros)", "Tudo do Pro", "Plaquinhas físicas pré-gravadas", "Suporte prioritário", "Relatórios avançados"],
                cta: "Assinar Business", accent: "#06b6d4"
              },
            ].map((p, i) => (
              <div key={i} data-reveal style={{
                ...revealStyle(`${i * 0.1}s`),
                position: "relative", borderRadius: 24, padding: 30,
                background: p.highlight
                  ? "linear-gradient(145deg, rgba(124,58,237,0.18), rgba(109,40,217,0.08))"
                  : "rgba(255,255,255,0.03)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: `1px solid ${p.highlight ? "rgba(124,58,237,0.45)" : "rgba(255,255,255,0.07)"}`,
                boxShadow: p.highlight ? "0 0 60px rgba(124,58,237,0.2)" : "none",
              }}>
                {p.highlight && (
                  <>
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                      color: "white", fontSize: 11, fontWeight: 800,
                      padding: "4px 18px", borderRadius: 100, letterSpacing: "1px",
                      boxShadow: "0 0 20px rgba(124,58,237,0.5)"
                    }}>MAIS POPULAR</div>
                    {/* Top shimmer line */}
                    <div style={{
                      position: "absolute", top: 0, left: 20, right: 20, height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), transparent)"
                    }} />
                  </>
                )}

                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: "0.5px" }}>
                  {p.name.toUpperCase()}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                  <span style={{
                    fontSize: 42, fontWeight: 900, letterSpacing: "-2px",
                    background: `linear-gradient(135deg, #f0f0ff, ${p.accent})`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>{p.per}</span>
                </div>

                <ul style={{ listStyle: "none", marginBottom: 28 }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 0",
                      borderBottom: j < p.features.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      fontSize: 13, color: "rgba(255,255,255,0.5)"
                    }}>
                      <span style={{ color: "#10b981", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/dashboard" style={{
                  display: "block", textAlign: "center",
                  padding: "13px 24px", borderRadius: 12,
                  background: p.highlight ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "rgba(255,255,255,0.05)",
                  border: p.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700,
                  boxShadow: p.highlight ? "0 0 30px rgba(124,58,237,0.35)" : "none",
                  transition: "all 0.2s"
                }}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 13, color: "white"
          }}>Q</div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2026 QRHub · Feito para lojistas brasileiros 🇧🇷</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Termos", "Privacidade", "Contato"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
