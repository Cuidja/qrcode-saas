"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredCodes } from "@/lib/codes-store";
import { Check, Zap, Sparkles, Building2 } from "lucide-react";

export default function BillingPage() {
  const [codeCount, setCodeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { codes } = await getStoredCodes();
      setCodeCount(codes.length);
      setLoading(false);
    }
    load();
  }, []);

  const FREE_LIMIT = 2;
  const isAtLimit = codeCount >= FREE_LIMIT;

  const PLANS = [
    {
      name: "Free",
      price: "R$ 0",
      per: "grátis para sempre",
      color: "#64748b",
      current: true,
      features: [
        "Até 2 QR Codes Dinâmicos",
        "Redirecionamento ilimitado",
        "Analytics básico de scans",
        "Download em alta resolução (PNG)",
        "Suporte da comunidade"
      ],
      cta: "Plano Atual",
      icon: Zap
    },
    {
      name: "PRO 🌟",
      price: "R$ 19,90",
      per: "/mês",
      color: "#0284c7",
      current: false,
      highlight: true,
      features: [
        "QR Codes Dinâmicos Ilimitados",
        "Google Reviews integrado com 5 estrelas",
        "Buscador de Place ID integrado",
        "Molduras, logos e cores personalizadas",
        "Analytics completo em tempo real",
        "Edição de destino sem mudar o QR impresso",
        "Suporte prioritário via WhatsApp"
      ],
      cta: "Assinar Plano PRO",
      icon: Sparkles
    },
    {
      name: "Agência",
      price: "R$ 69,90",
      per: "/mês",
      color: "#0f172a",
      current: false,
      features: [
        "Tudo do plano PRO",
        "Multi-empresas / Múltiplos clientes",
        "Relatórios exportáveis em PDF para clientes",
        "Sem marca d'água ou referências",
        "Gerente de conta dedicado",
        "Acesso antecipado a novos recursos"
      ],
      cta: "Assinar Agência",
      icon: Building2
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
          Planos & Faturamento
        </h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
          Escale seu negócio local com avaliações no Google e QR Codes profissionais.
        </p>
      </div>

      {/* Status atual */}
      <div style={{
        background: isAtLimit ? "#fffbeb" : "#f0f9ff",
        border: `1px solid ${isAtLimit ? "#fde68a" : "#bae6fd"}`,
        borderRadius: 14, padding: "20px 24px", marginBottom: 32,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: isAtLimit ? "#b45309" : "#0369a1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Seu Plano Atual
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>
            Plano Gratuito (Free)
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            {loading ? "Carregando..." : `${codeCount} de ${FREE_LIMIT} QR Codes utilizados`}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          {isAtLimit ? (
            <div>
              <div style={{ fontSize: 13, color: "#b45309", fontWeight: 700, marginBottom: 4 }}>
                ⚠️ Limite gratuito atingido ({codeCount}/{FREE_LIMIT})
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Faça upgrade para o PRO para criar códigos ilimitados
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 700, marginBottom: 4 }}>
                ✅ Você ainda tem {FREE_LIMIT - codeCount} QR Code(s) disponível(is)
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                Aproveite para criar e testar com seus clientes
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Planos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24 }}>
        {PLANS.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} style={{
              background: "#ffffff",
              border: p.highlight ? "2px solid #0284c7" : "1px solid #e2e8f0",
              borderRadius: 16, padding: 28,
              boxShadow: p.highlight ? "0 10px 25px -5px rgba(2,132,199,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              {p.highlight && (
                <div style={{
                  position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                  backgroundColor: "#0284c7", color: "#ffffff", fontSize: 11, fontWeight: 800,
                  padding: "4px 14px", borderRadius: 100, textTransform: "uppercase", letterSpacing: "0.5px"
                }}>
                  MAIS POPULAR
                </div>
              )}

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{p.name}</div>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    backgroundColor: p.highlight ? "#f0f9ff" : "#f8fafc",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: p.color
                  }}>
                    <Icon size={20} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 20 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: "#0f172a" }}>{p.price}</span>
                  <span style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>{p.per}</span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0" }}>
                  {p.features.map((f, j) => (
                    <li key={j} style={{
                      fontSize: 13, color: "#475569", padding: "8px 0",
                      borderBottom: "1px solid #f1f5f9", display: "flex", gap: 10, alignItems: "center"
                    }}>
                      <Check size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  disabled={p.current}
                  onClick={() => {
                    if (!p.current) {
                      alert(`Iniciando checkout do plano ${p.name}! Estamos configurando a chave do gateway de pagamento.`);
                    }
                  }}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                    cursor: p.current ? "default" : "pointer",
                    backgroundColor: p.current
                      ? "#f1f5f9"
                      : p.highlight
                        ? "#0284c7"
                        : "#0f172a",
                    border: "none",
                    color: p.current ? "#94a3b8" : "#ffffff",
                    boxShadow: (!p.current && p.highlight) ? "0 4px 12px rgba(2,132,199,0.25)" : "none",
                    transition: "all 0.15s ease"
                  }}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Informações de Pagamento e Segurança */}
      <div style={{
        marginTop: 32, padding: "20px 24px", borderRadius: 12,
        backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🔒</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
              Pagamento 100% Seguro via PIX ou Cartão de Crédito
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Ativação imediata dos recursos PRO. Cancele a qualquer momento com 1 clique.
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/codes"
          style={{
            fontSize: 13, fontWeight: 700, color: "#0284c7", textDecoration: "none"
          }}
        >
          Voltar para meus QR Codes →
        </Link>
      </div>
    </div>
  );
}
