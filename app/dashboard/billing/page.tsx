export default function BillingPage() {
  const PLANS = [
    {
      name: "Free", price: "R$ 0", per: "para sempre",
      color: "#6b6b8a", current: true,
      features: ["1 QR Code dinâmico", "Analytics básico", "Download PNG", "Short link qrhub.io"],
      cta: "Plano atual"
    },
    {
      name: "Pro", price: "R$ 29", per: "/mês",
      color: "#7c3aed", current: false, highlight: true,
      features: ["10 QR Codes dinâmicos", "Google Reviews integrado", "Gravação NFC (Android)", "Download SVG + PNG", "Plaquinha para impressão", "Personalização completa do QR"],
      cta: "Assinar Pro"
    },
    {
      name: "Business", price: "R$ 99", per: "/mês",
      color: "#06b6d4", current: false,
      features: ["50 QR Codes dinâmicos", "Multi-usuário (5 membros)", "Tudo do Pro", "Suporte prioritário", "Pedido de plaquinhas físicas", "Relatórios avançados"],
      cta: "Assinar Business"
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Faturamento</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Gerencie seu plano e pagamentos</p>
      </div>

      {/* Status atual */}
      <div style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))",
        border: "1px solid rgba(124,58,237,0.2)",
        borderRadius: 16, padding: "20px 24px", marginBottom: 32,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
      }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Plano atual</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>Free</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>1 de 1 QR Code disponível</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 600, marginBottom: 4 }}>
            ⚠️ Você está no limite do plano Free
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Faça upgrade para criar mais QR Codes
          </div>
        </div>
      </div>

      {/* Planos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {PLANS.map((p, i) => (
          <div key={i} style={{
            background: p.highlight
              ? "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(109,40,217,0.05))"
              : "var(--bg-card)",
            border: `1px solid ${p.highlight ? "#7c3aed" : "var(--border)"}`,
            borderRadius: 20, padding: 28,
            boxShadow: p.highlight ? "0 0 40px rgba(124,58,237,0.2)" : "none",
            position: "relative"
          }}>
            {p.highlight && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "white", fontSize: 11, fontWeight: 700,
                padding: "4px 16px", borderRadius: 100, whiteSpace: "nowrap"
              }}>MAIS POPULAR</div>
            )}
            {p.current && (
              <div style={{
                position: "absolute", top: 16, right: 16,
                background: "rgba(16,185,129,0.15)", color: "#10b981",
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                border: "1px solid rgba(16,185,129,0.3)"
              }}>✓ Atual</div>
            )}
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>{p.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
              <span style={{ fontSize: 38, fontWeight: 800, color: p.color }}>{p.price}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 14 }}>{p.per}</span>
            </div>
            <ul style={{ listStyle: "none", marginBottom: 28 }}>
              {p.features.map((f, j) => (
                <li key={j} style={{
                  fontSize: 13, color: "var(--text-muted)", padding: "7px 0",
                  borderBottom: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center"
                }}>
                  <span style={{ color: "#10b981", fontSize: 12 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              disabled={p.current}
              style={{
                width: "100%", padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                cursor: p.current ? "not-allowed" : "pointer",
                background: p.current
                  ? "var(--bg)"
                  : p.highlight
                    ? "linear-gradient(135deg, #7c3aed, #6d28d9)"
                    : "var(--bg-card-hover)",
                border: p.current ? "1px solid var(--border)" : p.highlight ? "none" : "1px solid var(--border-bright)",
                color: p.current ? "var(--text-muted)" : "white",
                boxShadow: (!p.current && p.highlight) ? "0 0 20px rgba(124,58,237,0.3)" : "none"
              }}
            >{p.cta}</button>
          </div>
        ))}
      </div>

      {/* Info */}
      <div style={{
        marginTop: 24, padding: "16px 20px", borderRadius: 12,
        background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)"
      }}>
        <div style={{ fontSize: 13, color: "#06b6d4", fontWeight: 600, marginBottom: 4 }}>
          💳 Pagamentos via Pix ou Cartão (Asaas)
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Cancele a qualquer momento. Sem fidelidade ou taxas escondidas.
        </div>
      </div>
    </div>
  );
}
