"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, ArrowRight, Mail, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro ao enviar o e-mail de recuperação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: "#ffffff",
      borderRadius: 16,
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
      padding: "32px 28px",
      width: "100%",
      boxSizing: "border-box"
    }}>
      {success ? (
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12, backgroundColor: "#dcfce7",
            color: "#16a34a", margin: "0 auto 16px auto", display: "flex",
            alignItems: "center", justifyContent: "center"
          }}>
            <CheckCircle2 size={28} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: "0 0 8px 0" }}>
            Verifique seu E-mail
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 24px 0" }}>
            Enviamos um link de recuperação para <strong>{email}</strong>. Abra a mensagem e siga as instruções para redefinir sua senha.
          </p>
          <Link
            href="/auth/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              color: "#0284c7", fontWeight: 700, fontSize: 14, textDecoration: "none"
            }}
          >
            <ArrowLeft size={16} /> Voltar para o Login
          </Link>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Recuperar Senha
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              Digite seu e-mail cadastrado para receber o link de redefinição
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
              padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 16
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                E-mail cadastrado
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 36px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <Mail size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: 13 }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#0284c7",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 800,
                cursor: isLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
                marginTop: 6
              }}
            >
              {isLoading ? "Enviando..." : "Enviar Link de Recuperação"} <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "#64748b" }}>
            Lembrou da senha?{" "}
            <Link
              href="/auth/login"
              style={{ fontWeight: 800, color: "#0284c7", textDecoration: "none" }}
            >
              Fazer Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
