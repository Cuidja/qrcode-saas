"use client";
import type { ScanStats } from "@/lib/analytics";

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: "18px 22px",
};

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export function ScanStatsView({ stats }: { stats: ScanStats }) {
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.count));
  const maxDevice = Math.max(1, ...stats.devices.map((d) => d.count));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <StatCard label="Total de scans" value={stats.total} />
        <StatCard label="Hoje" value={stats.today} />
        <StatCard label="Últimos 7 dias" value={stats.last7Days} />
        <StatCard label="Últimos 30 dias" value={stats.last30Days} />
      </div>

      {stats.truncated && (
        <div style={{ fontSize: 12, color: "#b45309" }}>
          Mostrando apenas os 5.000 scans mais recentes.
        </div>
      )}

      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Scans por dia (14 dias)</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
          {stats.daily.map((d) => (
            <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 10, color: "#64748b" }}>{d.count || ""}</div>
              <div
                title={`${d.label}: ${d.count}`}
                style={{
                  width: "100%",
                  height: `${Math.max(2, (d.count / maxDaily) * 100)}px`,
                  backgroundColor: d.count ? "#0284c7" : "#e2e8f0",
                  borderRadius: 4,
                }}
              />
              <div style={{ fontSize: 9, color: "#94a3b8" }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Dispositivos</div>
        {stats.devices.length === 0 ? (
          <div style={{ fontSize: 13, color: "#94a3b8" }}>Ainda não há scans registrados.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.devices.map((d) => (
              <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
                <div style={{ width: 110, color: "#334155", fontWeight: 600 }}>{d.label}</div>
                <div style={{ flex: 1, height: 10, backgroundColor: "#f1f5f9", borderRadius: 5 }}>
                  <div
                    style={{
                      width: `${(d.count / maxDevice) * 100}%`,
                      height: "100%",
                      backgroundColor: "#0284c7",
                      borderRadius: 5,
                    }}
                  />
                </div>
                <div style={{ width: 40, textAlign: "right", color: "#0f172a", fontWeight: 700 }}>{d.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
