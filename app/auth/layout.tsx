import Link from "next/link";
import { QrCode, ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 16px 40px 16px",
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Top Header com Logo */}
      <header style={{ width: "100%", maxWidth: 440, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            backgroundColor: "#0284c7", color: "#ffffff",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 10px rgba(2, 132, 199, 0.3)"
          }}>
            <QrCode size={20} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
            Qr Cuidja
          </span>
        </Link>

        <Link href="/" style={{
          fontSize: 13, fontWeight: 700, color: "#64748b", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 6
        }}>
          <ArrowLeft size={14} /> Início
        </Link>
      </header>

      {/* Conteúdo Central (Formulário) */}
      <main style={{ width: "100%", maxWidth: 440, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {children}
      </main>

      {/* Rodapé */}
      <footer style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 8 }}>
          <Link href="/privacy" style={{ color: "#64748b", textDecoration: "none" }}>Privacidade</Link>
          <Link href="/terms" style={{ color: "#64748b", textDecoration: "none" }}>Termos de Uso</Link>
          <a href="mailto:contato@cuidja.com" style={{ color: "#64748b", textDecoration: "none" }}>Ajuda</a>
        </div>
        <div>
          © 2026 Qr Cuidja. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
