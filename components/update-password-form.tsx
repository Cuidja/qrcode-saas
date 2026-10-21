"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem. Verifique e tente novamente.");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro ao atualizar sua senha.");
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
            Senha Atualizada!
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0" }}>
            Sua nova senha foi salva com sucesso. Redirecionando para o seu painel...
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Criar Nova Senha
            </h1>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
              Defina sua nova credencial de acesso
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                Nova Senha
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px 10px 38px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                Confirme a Nova Senha
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="Repita sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px 10px 38px",
                    borderRadius: 10,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    color: "#0f172a",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: 8,
                backgroundColor: "#0284c7",
                color: "#ffffff",
                border: "none",
                borderRadius: 10,
                padding: "12px",
                fontSize: 15,
                fontWeight: 800,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)"
              }}
            >
              {isLoading ? "Salvando..." : (
                <>
                  Salvar Nova Senha <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
