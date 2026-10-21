"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Lock, Mail, CheckCircle2 } from "lucide-react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("As senhas não coincidem. Digite a mesma senha nos dois campos.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve conter no mínimo 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro ao criar a conta.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const supabase = createClient();
    setError(null);
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
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
      {/* Título */}
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
          Crie sua conta grátis
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Comece a criar QR Codes inteligentes em segundos
        </p>
      </div>

      {/* Botão do Google */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "11px 16px",
          borderRadius: 10,
          border: "1px solid #cbd5e1",
          backgroundColor: "#ffffff",
          color: "#1e293b",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.15s ease",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        Cadastrar com o Google
      </button>

      {/* Divisor */}
      <div style={{
        display: "flex",
        alignItems: "center",
        margin: "20px 0",
        color: "#94a3b8",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase"
      }}>
        <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
        <span style={{ padding: "0 12px" }}>ou preencha com seu e-mail</span>
        <div style={{ flex: 1, height: 1, backgroundColor: "#e2e8f0" }} />
      </div>

      {/* Mensagem de Erro */}
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

      {/* Formulário */}
      <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
            Seu melhor E-mail
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

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
            Criar Senha
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            <Lock size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: 13 }} />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
            Confirmar Senha
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              required
              placeholder="Repita sua senha"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
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
            <Lock size={16} color="#94a3b8" style={{ position: "absolute", left: 12, top: 13 }} />
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
          {isLoading ? "Criando sua conta..." : "Criar Minha Conta Grátis"} <ArrowRight size={16} />
        </button>
      </form>

      {/* Link de Login */}
      <div style={{ marginTop: 24, textAlign: "center", fontSize: 13, color: "#64748b" }}>
        Já possui uma conta?{" "}
        <Link
          href="/auth/login"
          style={{ fontWeight: 800, color: "#0284c7", textDecoration: "none" }}
        >
          Fazer Login
        </Link>
      </div>
    </div>
  );
}
