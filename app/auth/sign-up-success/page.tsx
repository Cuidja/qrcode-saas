import Link from "next/link";
import { MailCheck, ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: 16,
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
      padding: "36px 28px",
      width: "100%",
      boxSizing: "border-box",
      textAlign: "center"
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 16,
        backgroundColor: "#e0f2fe", color: "#0284c7",
        margin: "0 auto 20px auto", display: "flex",
        alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(2, 132, 199, 0.15)"
      }}>
        <MailCheck size={32} />
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
        Conta criada com sucesso!
      </h1>

      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 24px 0" }}>
        Enviamos um link de confirmação para o seu e-mail. Por favor, acesse sua caixa de entrada e clique no link para ativar sua conta antes de entrar.
      </p>

      <div style={{
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "14px",
        marginBottom: 24,
        fontSize: 13,
        color: "#64748b",
        textAlign: "left"
      }}>
        💡 <strong>Dica:</strong> Se não encontrar na caixa de entrada, verifique sua pasta de <em>Spam</em> ou <em>Lixo Eletrônico</em>.
      </div>

      <Link
        href="/auth/login"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: "#0284c7",
          color: "#ffffff",
          textDecoration: "none",
          borderRadius: 10,
          padding: "12px",
          fontSize: 15,
          fontWeight: 800,
          boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)"
        }}
      >
        Ir para o Login <ArrowRight size={16} />
      </Link>
    </div>
  );
}
