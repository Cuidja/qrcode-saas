import Link from "next/link";

const MOCK_CODES = [
  { id: "1", label: "Restaurante Centro", slug: "rest-ctr", target: "https://g.page/r/...", scans: 247, active: true, business: "Restaurante Bom Sabor", created: "10 set 2026" },
  { id: "2", label: "Loja Boa Vista", slug: "lj-bvista", target: "https://g.page/r/...", scans: 89, active: true, business: "Moda Fashion Store", created: "8 set 2026" },
  { id: "3", label: "Barbearia Nobre", slug: "barb-nob", target: "https://g.page/r/...", scans: 412, active: true, business: "Barbearia Nobre", created: "1 set 2026" },
  { id: "4", label: "Padaria do João", slug: "pad-joao", target: "https://g.page/r/...", scans: 33, active: false, business: "Padaria do João", created: "15 ago 2026" },
];

const STATS = [
  { label: "Total de Scans", value: "781", icon: "📡", change: "+18% este mês" },
  { label: "QR Codes Ativos", value: "3", icon: "✅", change: "1 inativo" },
  { label: "Média de Stars", value: "4.7", icon: "⭐", change: "127 avaliações" },
  { label: "Scans hoje", value: "24", icon: "🔥", change: "+6 vs ontem" },
];

export default function DashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6 }}>
          Bom dia! 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
          Aqui está o resumo dos seus QR Codes
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16, marginBottom: 40
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "20px 24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 500 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>{s.change}</div>
              </div>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Codes recentes */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 16, overflow: "hidden"
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>QR Codes recentes</h2>
          <Link href="/dashboard/codes" style={{
            fontSize: 13, color: "#7c3aed", textDecoration: "none", fontWeight: 600
          }}>Ver todos →</Link>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Label", "Slug", "Scans", "Status", "Ações"].map(h => (
                <th key={h} style={{
                  padding: "12px 24px", textAlign: "left",
                  fontSize: 12, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px",
                  textTransform: "uppercase"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_CODES.map((code, i) => (
              <tr key={code.id} style={{
                borderBottom: i < MOCK_CODES.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background 0.15s"
              }}>
                <td style={{ padding: "16px 24px" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{code.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{code.business}</div>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <code style={{
                    fontSize: 12, background: "var(--bg)", padding: "3px 8px",
                    borderRadius: 6, color: "#a78bfa", border: "1px solid var(--border)"
                  }}>qrhub.io/r/{code.slug}</code>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{code.scans}</span>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100,
                    background: code.active ? "rgba(16,185,129,0.1)" : "rgba(107,107,138,0.1)",
                    color: code.active ? "#10b981" : "var(--text-muted)",
                    border: `1px solid ${code.active ? "rgba(16,185,129,0.3)" : "var(--border)"}`
                  }}>{code.active ? "Ativo" : "Inativo"}</span>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <Link href={`/dashboard/codes/${code.id}`} style={{
                    fontSize: 13, color: "#7c3aed", textDecoration: "none", fontWeight: 600
                  }}>Editar →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
