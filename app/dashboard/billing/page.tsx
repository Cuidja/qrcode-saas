"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredCodes } from "@/lib/codes-store";
import { getUserPlan, setUserPlan, PlanDetails, UserPlan } from "@/lib/user-plan";
import { Check, Zap, Sparkles, Building2, QrCode, CreditCard, Shield, X } from "lucide-react";

export default function BillingPage() {
  const [codeCount, setCodeCount] = useState(0);
  const [planDetails, setPlanDetails] = useState<PlanDetails>({
    plan: "free",
    isPro: false,
    isAgency: false,
    limit: 2,
    name: "Plano Free (Gratuito)"
  });
  const [loading, setLoading] = useState(true);
  
  // Checkout Modal State
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<UserPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [codesRes, planRes] = await Promise.all([
        getStoredCodes(),
        getUserPlan()
      ]);
      setCodeCount(codesRes.codes.length);
      setPlanDetails(planRes);
      setLoading(false);
    }
    load();
  }, []);

  const handleSimulatePurchase = async (plan: UserPlan) => {
    setProcessing(true);
    const res = await setUserPlan(plan);
    setProcessing(false);

    if (res.success) {
      const updated = await getUserPlan();
      setPlanDetails(updated);
      setSelectedPlanToBuy(null);
      setSuccessMessage(`🎉 Parabéns! Sua assinatura do ${updated.name} foi ativada com sucesso!`);
      setTimeout(() => setSuccessMessage(null), 6000);
    } else {
      alert("Erro ao ativar plano: " + res.error);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Deseja simular o cancelamento e voltar para o Plano Free (Gratuito)?")) return;
    setLoading(true);
    await setUserPlan("free");
    const updated = await getUserPlan();
    setPlanDetails(updated);
    setLoading(false);
    setSuccessMessage("Assinatura cancelada. Você voltou para o plano Free.");
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const isAtLimit = !planDetails.isPro && codeCount >= planDetails.limit;

  const PLANS = [
    {
      id: "free" as UserPlan,
      name: "Free",
      price: "R$ 0",
      per: "grátis para sempre",
      color: "#64748b",
      features: [
        "Até 2 QR Codes Dinâmicos",
        "Redirecionamento ilimitado",
        "Analytics básico de scans",
        "Download em alta resolução (PNG)",
        "Suporte da comunidade"
      ],
      icon: Zap
    },
    {
      id: "pro" as UserPlan,
      name: "PRO 🌟",
      price: "R$ 19,90",
      per: "/mês",
      color: "#0284c7",
      highlight: true,
      features: [
        "QR Codes Dinâmicos Ilimitados (∞)",
        "Google Reviews integrado com 5 estrelas",
        "Buscador de Place ID integrado",
        "Molduras, logos e cores personalizadas",
        "Analytics completo em tempo real",
        "Edição de destino sem mudar o QR impresso",
        "Suporte prioritário via WhatsApp"
      ],
      icon: Sparkles
    },
    {
      id: "agency" as UserPlan,
      name: "Agência",
      price: "R$ 69,90",
      per: "/mês",
      color: "#0f172a",
      features: [
        "Tudo do plano PRO",
        "Multi-empresas / Múltiplos clientes",
        "Relatórios exportáveis em PDF para clientes",
        "Sem marca d'água ou referências",
        "Gerente de conta dedicado",
        "Acesso antecipado a novos recursos"
      ],
      icon: Building2
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 60 }}>
      
      {/* Toast de Sucesso */}
      {successMessage && (
        <div style={{
          backgroundColor: "#dcfce7", border: "1px solid #86efac", color: "#166534",
          padding: "16px 20px", borderRadius: 12, marginBottom: 24, fontSize: 14,
          fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 4px 12px rgba(22, 101, 52, 0.1)"
        }}>
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#166534" }}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
          Planos & Faturamento
        </h1>
        <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
          Escale seu negócio local com avaliações no Google e QR Codes profissionais.
        </p>
      </div>

      {/* Status Atual do Usuário */}
      <div style={{
        background: planDetails.isPro ? "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)" : (isAtLimit ? "#fffbeb" : "#ffffff"),
        border: `1px solid ${planDetails.isPro ? "#7dd3fc" : (isAtLimit ? "#fde68a" : "#e2e8f0")}`,
        borderRadius: 16, padding: "24px 28px", marginBottom: 36,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
        boxShadow: planDetails.isPro ? "0 4px 16px rgba(2, 132, 199, 0.08)" : "0 1px 3px rgba(0,0,0,0.03)"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px",
              padding: "4px 10px", borderRadius: 100,
              backgroundColor: planDetails.isPro ? "#0284c7" : "#64748b",
              color: "#ffffff"
            }}>
              {planDetails.name}
            </div>
            {planDetails.isPro && (
              <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                <Check size={14} /> Assinatura Ativa
              </span>
            )}
          </div>

          <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", marginTop: 8 }}>
            {planDetails.isPro ? "Acesso Ilimitado Liberado" : "Você está no Plano Free"}
          </div>

          <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
            {loading ? "Carregando..." : (
              planDetails.isPro 
                ? `${codeCount} QR Codes criados (Cota Ilimitada ∞)`
                : `${codeCount} de ${planDetails.limit} QR Codes utilizados`
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {planDetails.isPro ? (
            <button
              onClick={handleCancelSubscription}
              style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff", color: "#64748b", fontSize: 13,
                fontWeight: 600, cursor: "pointer"
              }}
            >
              Cancelar Assinatura (Voltar p/ Free)
            </button>
          ) : (
            <button
              onClick={() => setSelectedPlanToBuy("pro")}
              style={{
                padding: "12px 24px", borderRadius: 8, border: "none",
                backgroundColor: "#0284c7", color: "#ffffff", fontSize: 14,
                fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(2,132,199,0.3)"
              }}
            >
              Fazer Upgrade para o PRO →
            </button>
          )}
        </div>
      </div>

      {/* Grid de Planos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24 }}>
        {PLANS.map((p) => {
          const Icon = p.icon;
          const isCurrentPlan = planDetails.plan === p.id;

          return (
            <div key={p.id} style={{
              background: "#ffffff",
              border: isCurrentPlan 
                ? "2px solid #16a34a" 
                : (p.highlight ? "2px solid #0284c7" : "1px solid #e2e8f0"),
              borderRadius: 16, padding: 28,
              boxShadow: isCurrentPlan
                ? "0 8px 20px -4px rgba(22, 163, 74, 0.15)"
                : (p.highlight ? "0 10px 25px -5px rgba(2, 132, 199, 0.15)" : "0 1px 3px rgba(0,0,0,0.04)"),
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              {isCurrentPlan ? (
                <div style={{
                  position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                  backgroundColor: "#16a34a", color: "#ffffff", fontSize: 11, fontWeight: 800,
                  padding: "4px 14px", borderRadius: 100, textTransform: "uppercase"
                }}>
                  ✓ PLANO ATUAL
                </div>
              ) : p.highlight && (
                <div style={{
                  position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                  backgroundColor: "#0284c7", color: "#ffffff", fontSize: 11, fontWeight: 800,
                  padding: "4px 14px", borderRadius: 100, textTransform: "uppercase"
                }}>
                  MAIS POPULAR
                </div>
              )}

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{p.name}</div>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    backgroundColor: isCurrentPlan ? "#dcfce7" : (p.highlight ? "#f0f9ff" : "#f8fafc"),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isCurrentPlan ? "#16a34a" : p.color
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
                {isCurrentPlan ? (
                  <button
                    disabled
                    style={{
                      width: "100%", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                      backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0",
                      cursor: "default"
                    }}
                  >
                    ✓ Ativo na sua Conta
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedPlanToBuy(p.id)}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                      cursor: "pointer",
                      backgroundColor: p.highlight ? "#0284c7" : "#0f172a",
                      border: "none",
                      color: "#ffffff",
                      boxShadow: p.highlight ? "0 4px 12px rgba(2,132,199,0.25)" : "none"
                    }}
                  >
                    Assinar {p.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL DE CHECKOUT SIMULADO (PIX / CARTÃO) ── */}
      {selectedPlanToBuy && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20
        }}>
          <div style={{
            backgroundColor: "#ffffff", borderRadius: 20, padding: 32,
            maxWidth: 480, width: "100%", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            position: "relative"
          }}>
            {/* Fechar */}
            <button
              onClick={() => setSelectedPlanToBuy(null)}
              style={{
                position: "absolute", top: 20, right: 20, background: "none",
                border: "none", cursor: "pointer", color: "#64748b"
              }}
            >
              <X size={20} />
            </button>

            {/* Cabeçalho Modal */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, backgroundColor: "#f0f9ff",
                color: "#0284c7", margin: "0 auto 12px auto", display: "flex",
                alignItems: "center", justifyContent: "center"
              }}>
                <Sparkles size={26} />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: "0 0 6px 0" }}>
                Checkout Simulado: Plano {selectedPlanToBuy === "agency" ? "Agência" : "PRO 🌟"}
              </h3>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                Valor: <strong>{selectedPlanToBuy === "agency" ? "R$ 69,90/mês" : "R$ 19,90/mês"}</strong>
              </p>
            </div>

            {/* Tabs de Pagamento */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => setPaymentMethod("pix")}
                style={{
                  flex: 1, padding: "10px", borderRadius: 8, fontWeight: 700, fontSize: 13,
                  border: paymentMethod === "pix" ? "2px solid #0284c7" : "1px solid #cbd5e1",
                  backgroundColor: paymentMethod === "pix" ? "#f0f9ff" : "#ffffff",
                  color: paymentMethod === "pix" ? "#0284c7" : "#64748b",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}
              >
                <QrCode size={16} /> Pagar com PIX
              </button>

              <button
                onClick={() => setPaymentMethod("card")}
                style={{
                  flex: 1, padding: "10px", borderRadius: 8, fontWeight: 700, fontSize: 13,
                  border: paymentMethod === "card" ? "2px solid #0284c7" : "1px solid #cbd5e1",
                  backgroundColor: paymentMethod === "card" ? "#f0f9ff" : "#ffffff",
                  color: paymentMethod === "card" ? "#0284c7" : "#64748b",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}
              >
                <CreditCard size={16} /> Cartão de Crédito
              </button>
            </div>

            {/* Conteúdo do Método */}
            {paymentMethod === "pix" ? (
              <div style={{ textAlign: "center", backgroundColor: "#f8fafc", padding: 20, borderRadius: 12, marginBottom: 24, border: "1px solid #e2e8f0" }}>
                <div style={{ width: 140, height: 140, margin: "0 auto 12px auto", backgroundColor: "#ffffff", padding: 8, borderRadius: 8, border: "1px solid #cbd5e1" }}>
                  <img src="/logo.png" alt="Simulação QR PIX" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", marginBottom: 6 }}>
                  QR Code Pix de Demonstração
                </div>
                <code style={{ fontSize: 11, color: "#64748b", wordBreak: "break-all", display: "block", backgroundColor: "#ffffff", padding: "6px 8px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                  00020126580014br.gov.bcb.pix0136qr-cuidja-pro-teste520400005303986540519.905802BR
                </code>
              </div>
            ) : (
              <div style={{ backgroundColor: "#f8fafc", padding: 18, borderRadius: 12, marginBottom: 24, border: "1px solid #e2e8f0" }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Número do Cartão (Simulação)</label>
                  <input readOnly value="4111 •••• •••• 4242" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Validade</label>
                    <input readOnly value="12/28" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>CVC</label>
                    <input readOnly value="888" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13, boxSizing: "border-box" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Ação */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setSelectedPlanToBuy(null)}
                style={{
                  flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #cbd5e1",
                  backgroundColor: "#ffffff", color: "#64748b", fontWeight: 700, fontSize: 14,
                  cursor: "pointer"
                }}
              >
                Voltar
              </button>
              <button
                onClick={() => handleSimulatePurchase(selectedPlanToBuy)}
                disabled={processing}
                style={{
                  flex: 2, padding: "12px", borderRadius: 8, border: "none",
                  backgroundColor: processing ? "#64748b" : "#16a34a", color: "#ffffff",
                  fontWeight: 800, fontSize: 14, cursor: processing ? "wait" : "pointer",
                  boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
                }}
              >
                {processing ? "Ativando..." : "Simular Pagamento & Ativar PRO"}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, fontSize: 12, color: "#64748b" }}>
              <Shield size={14} color="#16a34a" /> Modo Simulação Seguro (Altera status no banco sem cobrança real)
            </div>
          </div>
        </div>
      )}

      {/* Voltar */}
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Link href="/dashboard/codes" style={{ color: "#0284c7", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
          ← Voltar para o Gerenciador de QR Codes
        </Link>
      </div>

    </div>
  );
}
