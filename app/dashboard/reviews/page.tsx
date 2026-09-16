export default function ReviewsPage() {
  const REVIEWS = [
    { name: "Carlos M.", stars: 5, comment: "Atendimento incrível, voltarei sempre!", date: "há 2 dias", avatar: "C" },
    { name: "Ana Paula S.", stars: 5, comment: "Produto excelente e entrega rápida. Super recomendo!", date: "há 5 dias", avatar: "A" },
    { name: "Roberto L.", stars: 4, comment: "Bom serviço, só achei o preço um pouco alto.", date: "há 1 semana", avatar: "R" },
    { name: "Fernanda T.", stars: 5, comment: "Melhor da região sem dúvida. Nota 10!", date: "há 2 semanas", avatar: "F" },
    { name: "Marcos B.", stars: 3, comment: "Serviço ok, nada especial.", date: "há 3 semanas", avatar: "M" },
  ];

  const avg = (REVIEWS.reduce((s, r) => s + r.stars, 0) / REVIEWS.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map(s => ({ stars: s, count: REVIEWS.filter(r => r.stars === s).length }));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Avaliações</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sincronizado com Google Business Profile</p>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Média geral", value: avg, icon: "⭐", sub: `${REVIEWS.length} avaliações` },
          { label: "Total", value: String(REVIEWS.length), icon: "💬", sub: "todas as avaliações" },
          { label: "Novas (30 dias)", value: "12", icon: "🆕", sub: "+3 esta semana" },
          { label: "5 estrelas", value: String(REVIEWS.filter(r => r.stars === 5).length), icon: "🏆", sub: `${Math.round(REVIEWS.filter(r => r.stars === 5).length / REVIEWS.length * 100)}% do total` },
        ].map((c, i) => (
          <div key={i} style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "20px 22px"
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px" }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20, marginBottom: 32 }}>
        {/* Distribuição */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 16, padding: 24
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Distribuição</h3>
          {dist.map(d => (
            <div key={d.stars} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 12, width: 14, textAlign: "right", color: "var(--text-muted)" }}>{d.stars}</span>
              <span style={{ fontSize: 12 }}>⭐</span>
              <div style={{ flex: 1, height: 6, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
                <div style={{
                  width: `${(d.count / REVIEWS.length) * 100}%`, height: "100%", borderRadius: 4,
                  background: d.stars >= 4 ? "linear-gradient(90deg,#7c3aed,#06b6d4)" : d.stars === 3 ? "#f59e0b" : "#ef4444"
                }} />
              </div>
              <span style={{ fontSize: 12, color: "var(--text-muted)", width: 16 }}>{d.count}</span>
            </div>
          ))}
        </div>

        {/* Sync */}
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 12
        }}>
          <div style={{ fontSize: 40 }}>🔗</div>
          <div style={{ fontSize: 16, fontWeight: 700, textAlign: "center" }}>Conecte seu Google Business</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", maxWidth: 280 }}>
            Sincronize suas avaliações automaticamente a cada 6 horas
          </div>
          <a href="/dashboard/settings" style={{
            padding: "10px 24px", borderRadius: 10,
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700,
            boxShadow: "0 0 16px rgba(124,58,237,0.3)"
          }}>Conectar Google →</a>
        </div>
      </div>

      {/* Lista de avaliações */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 16, overflow: "hidden"
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Últimas avaliações</h3>
        </div>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{
            padding: "20px 24px",
            borderBottom: i < REVIEWS.length - 1 ? "1px solid var(--border)" : "none"
          }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: 15
              }}>{r.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.date}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <span key={j} style={{ color: j < r.stars ? "#f59e0b" : "var(--text-dim)", fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>{r.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
