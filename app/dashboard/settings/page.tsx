export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>Configurações</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Gerencie sua conta e integrações</p>
      </div>

      {/* Perfil */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 16, padding: 28, marginBottom: 20
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Perfil da organização</h2>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
              Nome da organização
            </label>
            <input defaultValue="Minha Empresa" style={{
              width: "100%", padding: "10px 14px", borderRadius: 9,
              background: "var(--bg)", border: "1px solid var(--border-bright)",
              color: "var(--text)", fontSize: 14, outline: "none"
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
              Email
            </label>
            <input defaultValue="dono@empresa.com" style={{
              width: "100%", padding: "10px 14px", borderRadius: 9,
              background: "var(--bg)", border: "1px solid var(--border-bright)",
              color: "var(--text)", fontSize: 14, outline: "none"
            }} />
          </div>
        </div>
        <button style={{
          marginTop: 16, padding: "9px 20px", borderRadius: 9,
          background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
          color: "white", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer"
        }}>Salvar</button>
      </div>

      {/* Google Business */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 16, padding: 28, marginBottom: 20
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Google Business Profile</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          Conecte para sincronizar avaliações automaticamente
        </p>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderRadius: 12,
          background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>🔴</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#ef4444" }}>Não conectado</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Nenhuma conta vinculada</div>
            </div>
          </div>
          <button style={{
            padding: "9px 18px", borderRadius: 9,
            background: "white", color: "#1a1a1a",
            border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Conectar com Google
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div style={{
        background: "var(--bg-card)", border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 16, padding: 28
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#ef4444", marginBottom: 6 }}>Zona de perigo</h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          Ações irreversíveis. Tenha certeza antes de prosseguir.
        </p>
        <button style={{
          padding: "9px 20px", borderRadius: 9,
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer"
        }}>Excluir minha conta</button>
      </div>
    </div>
  );
}
