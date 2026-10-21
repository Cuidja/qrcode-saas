import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div style={{
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: 10,
      padding: "12px 16px",
      fontSize: 13,
      color: "#b91c1c",
      wordBreak: "break-word",
      marginBottom: 24
    }}>
      {params?.error ? (
        <span>Código do erro: <strong>{params.error}</strong></span>
      ) : (
        <span>Ocorreu um erro inesperado durante a autenticação.</span>
      )}
    </div>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
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
        backgroundColor: "#fee2e2", color: "#ef4444",
        margin: "0 auto 20px auto", display: "flex",
        alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)"
      }}>
        <AlertTriangle size={32} />
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "0 0 10px 0", letterSpacing: "-0.5px" }}>
        Ops, algo deu errado!
      </h1>

      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 20px 0" }}>
        Não foi possível concluir sua autenticação. Isso pode ocorrer por um link expirado ou credenciais inválidas.
      </p>

      <Suspense fallback={<div style={{ height: 40, marginBottom: 24 }} />}>
        <ErrorContent searchParams={searchParams} />
      </Suspense>

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
        <ArrowLeft size={16} /> Voltar para o Login
      </Link>
    </div>
  );
}
