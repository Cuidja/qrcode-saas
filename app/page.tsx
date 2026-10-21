"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  QrCode, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Sliders, 
  BarChart3, 
  Palette,
  ExternalLink,
  ChevronDown
} from "lucide-react";

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: "O que é um QR Code Dinâmico e qual a vantagem?",
      a: "Diferente de um QR Code comum estático, o QR Code Dinâmico permite que você altere o link de destino a qualquer momento sem precisar reimprimir plaquinhas, adesivos ou cardápios. Além disso, você tem acesso a estatísticas detalhadas de quantas pessoas escanearam."
    },
    {
      q: "Como o QR Code ajuda a conseguir mais avaliações 5 estrelas no Google?",
      a: "Nossa ferramenta conecta diretamente com o Place ID da sua empresa no Google Maps. Ao escanear o QR Code no seu balcão ou na mesa, o cliente abre automaticamente a tela do Google já com as 5 estrelas pré-selecionadas, bastando ele clicar em publicar."
    },
    {
      q: "Preciso pagar para começar a usar?",
      a: "Não! Você pode criar até 2 QR Codes dinâmicos de forma 100% gratuita para sempre. Quando o seu negócio crescer ou você precisar de códigos ilimitados e recursos de personalização avançados, basta fazer upgrade para o plano PRO por apenas R$ 19,90/mês."
    },
    {
      q: "Qual formato de arquivo posso baixar para imprimir?",
      a: "Você pode baixar seus QR Codes em alta resolução (PNG) prontos para envio a gráficas, impressoras normais ou para colocar em suportes de acrílico."
    }
  ];

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#0f172a", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      
      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
        padding: "14px 24px"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* Brand */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              backgroundColor: "#0284c7", color: "#ffffff",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 10px rgba(2, 132, 199, 0.3)"
            }}>
              <QrCode size={22} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
              Qr Cuidja
            </div>
          </Link>

          {/* Links Centrais */}
          <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hidden-mobile">
            <a href="#recursos" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Recursos</a>
            <a href="#google-reviews" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Google Reviews</a>
            <a href="#como-funciona" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Como Funciona</a>
            <a href="#precos" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>Preços</a>
            <a href="#faq" style={{ fontSize: 14, fontWeight: 600, color: "#475569", textDecoration: "none" }}>FAQ</a>
          </div>

          {/* Ações */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/auth/login"
              style={{
                fontSize: 14, fontWeight: 700, color: "#334155", textDecoration: "none",
                padding: "8px 16px", borderRadius: 8
              }}
            >
              Entrar
            </Link>
            <Link
              href="/auth/sign-up"
              style={{
                fontSize: 14, fontWeight: 700, color: "#ffffff", backgroundColor: "#0284c7",
                textDecoration: "none", padding: "10px 18px", borderRadius: 8,
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.25)",
                display: "inline-flex", alignItems: "center", gap: 6,
                transition: "all 0.15s ease"
              }}
            >
              Criar QR Code Grátis <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{
        padding: "80px 24px 60px 24px",
        background: "linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)",
        borderBottom: "1px solid #f1f5f9"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            backgroundColor: "#e0f2fe", color: "#0369a1",
            border: "1px solid #bae6fd", padding: "6px 16px", borderRadius: 100,
            fontSize: 13, fontWeight: 700, marginBottom: 24
          }}>
            <Sparkles size={16} color="#0284c7" />
            O Gerador de QR Code feito para Negócios Locais
          </div>

          {/* Headline Principal */}
          <h1 style={{
            fontSize: 48, fontWeight: 900, color: "#0f172a",
            letterSpacing: "-1.5px", lineHeight: 1.15, marginBottom: 20
          }}>
            Transforme clientes no seu balcão em <br />
            <span style={{ color: "#0284c7" }}>Avaliações 5 Estrelas no Google</span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: 18, color: "#475569", maxWidth: 740, margin: "0 auto 36px auto",
            lineHeight: 1.6
          }}>
            Crie QR Codes dinâmicos com molduras personalizadas, integre com seu Google Maps, 
            acompanhe as métricas de scans em tempo real e mude o link de destino quando quiser sem reimprimir nada.
          </p>

          {/* Botões CTA */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 50 }}>
            <Link
              href="/auth/sign-up"
              style={{
                backgroundColor: "#0284c7", color: "#ffffff", padding: "14px 28px",
                borderRadius: 10, fontSize: 16, fontWeight: 800, textDecoration: "none",
                boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.4)",
                display: "inline-flex", alignItems: "center", gap: 8
              }}
            >
              Criar Meu QR Code Grátis <ArrowRight size={18} />
            </Link>

            <Link
              href="/auth/login"
              style={{
                backgroundColor: "#ffffff", color: "#0f172a", padding: "14px 24px",
                borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: "none",
                border: "1px solid #cbd5e1", display: "inline-flex", alignItems: "center", gap: 8,
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
            >
              Já tenho conta
            </Link>
          </div>

          {/* ── CARD INTERATIVO DE PREVIEW DO PRODUTO ── */}
          <div style={{
            maxWidth: 680, margin: "0 auto", backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0", borderRadius: 20, padding: 32,
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.08)",
            display: "grid", gridTemplateColumns: "240px 1fr", gap: 32,
            alignItems: "center", textAlign: "left"
          }}>
            {/* Visual do QR Code com Moldura */}
            <div style={{
              backgroundColor: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 16,
              padding: 16, textAlign: "center"
            }}>
              {/* Moldura Superior ou Inferior */}
              <div style={{
                backgroundColor: "#0284c7", color: "#ffffff", fontSize: 11, fontWeight: 800,
                letterSpacing: "1px", padding: "4px 8px", borderRadius: 6, marginBottom: 12
              }}>
                ⭐ SCAN FOR 5-STARS
              </div>

              {/* QR Code Img */}
              <div style={{
                width: 170, height: 170, margin: "0 auto", backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0", borderRadius: 12, padding: 8,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <img 
                  src="/logo.png" 
                  alt="QR Code Exemplo Qr Cuidja" 
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>

              <div style={{ fontSize: 11, color: "#64748b", marginTop: 10, fontWeight: 600 }}>
                qr.cuidja.com/r/demo
              </div>
            </div>

            {/* Benefícios em destaque ao lado */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#b45309", marginBottom: 8, fontSize: 13, fontWeight: 700 }}>
                <span>⭐⭐⭐⭐⭐</span> 5.0 no Google Maps
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
                Exemplo: Barbearia ou Restaurante
              </h3>

              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 18px 0" }}>
                O cliente escaneia com a câmera do celular no balcão e cai direto na tela oficial de avaliação. Sem atritos, sem login demorado.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155", fontWeight: 600 }}>
                  <Check size={16} color="#16a34a" /> QR Code Dinâmico (Mude o link quando quiser)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155", fontWeight: 600 }}>
                  <Check size={16} color="#16a34a" /> Rastreamento de scans em tempo real
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155", fontWeight: 600 }}>
                  <Check size={16} color="#16a34a" /> Buscador de Place ID do Google integrado
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SEÇÃO: RECURSOS REAIS ── */}
      <section id="recursos" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
            Funcionalidades Feitas para Converter
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>
            Tudo o que você precisa em uma única plataforma
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7", marginBottom: 18 }}>
              <TrendingUp size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              QR Codes 100% Dinâmicos
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              Nunca mais perca material impresso. Se o seu site, WhatsApp ou promoção mudar, basta editar o destino no painel em 2 cliques.
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706", marginBottom: 18 }}>
              <Star size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              Google Reviews Inteligente
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              Use nosso buscador de Place ID para gerar links diretos que abrem o modal de 5 estrelas do Google Maps instantaneamente.
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a", marginBottom: 18 }}>
              <Palette size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              Estúdio de Design & Molduras
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              Personalize cores, cantos arredondados, pontos estilizados e insira molduras de ação como "SCAN ME" ou sua logo no centro.
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#9333ea", marginBottom: 18 }}>
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              Analytics e Métricas Reais
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              Monitore a contagem de acessos dos seus QR Codes. Descubra quais mesas, balcões ou campanhas estão gerando mais engajamento.
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#ecfeff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0891b2", marginBottom: 18 }}>
              <Globe size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              Redirecionamento Ultrarrápido
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              Hospedado em servidores de alta velocidade para que o seu cliente não espere nem 1 segundo ao apontar a câmera do celular.
            </p>
          </div>

          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626", marginBottom: 18 }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>
              Conformidade LGPD & Segurança
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              Dados criptografados, autenticação segura com Google OAuth e total conformidade com a legislação brasileira.
            </p>
          </div>

        </div>
      </section>

      {/* ── SEÇÃO: COMO FUNCIONA ── */}
      <section id="como-funciona" style={{ padding: "80px 24px", backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 40 }}>
            Crie seu QR Code em 3 passos simples
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#0284c7", marginBottom: 12 }}>01</div>
              <h4 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>Insira seu Link</h4>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Cole o link do seu site, WhatsApp ou use nosso buscador de Place ID do Google para avaliações.
              </p>
            </div>

            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#0284c7", marginBottom: 12 }}>02</div>
              <h4 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>Personalize o Design</h4>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Escolha cores da sua marca, adicione uma moldura com chamada e coloque sua logo favorita.
              </p>
            </div>

            <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#0284c7", marginBottom: 12 }}>03</div>
              <h4 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>Imprima e Converta</h4>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                Baixe em alta qualidade, posicione no seu balcão ou cardápio e receba avaliações todos os dias!
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── SEÇÃO: TABELA DE PREÇOS REAL ── */}
      <section id="precos" style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
            Preços Claros e Justos
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>
            Comece grátis, faça upgrade quando crescer
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24 }}>
          
          {/* FREE */}
          <div style={{
            backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16,
            padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between"
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Plano Free</div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>Ideal para pequenos comércios testarem</p>
              
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: "#0f172a" }}>R$ 0</span>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>para sempre</span>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0" }}>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Até 2 QR Codes Dinâmicos
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Redirecionamento Ilimitado
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Download em alta resolução (PNG)
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Analytics básico de scans
                </li>
              </ul>
            </div>

            <Link
              href="/auth/sign-up"
              style={{
                width: "100%", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                textAlign: "center", textDecoration: "none", backgroundColor: "#f1f5f9",
                color: "#334155", display: "block", boxSizing: "border-box"
              }}
            >
              Começar Gratuitamente
            </Link>
          </div>

          {/* PRO (DESTAQUE) */}
          <div style={{
            backgroundColor: "#ffffff", border: "2px solid #0284c7", borderRadius: 16,
            padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxShadow: "0 12px 30px -5px rgba(2, 132, 199, 0.2)", position: "relative"
          }}>
            <div style={{
              position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#0284c7", color: "#ffffff", fontSize: 11, fontWeight: 800,
              padding: "4px 14px", borderRadius: 100, textTransform: "uppercase"
            }}>
              MAIS POPULAR
            </div>

            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Plano PRO 🌟</div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>Para quem quer acelerar avaliações no Google</p>
              
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: "#0284c7" }}>R$ 19,90</span>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>/mês</span>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0" }}>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> <strong>QR Codes Dinâmicos Ilimitados</strong>
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Google Reviews 5 estrelas integrado
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Buscador de Place ID do Google
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Molduras, logos e cores customizadas
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Analytics completo em tempo real
                </li>
              </ul>
            </div>

            <Link
              href="/auth/sign-up"
              style={{
                width: "100%", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 800,
                textAlign: "center", textDecoration: "none", backgroundColor: "#0284c7",
                color: "#ffffff", display: "block", boxSizing: "border-box",
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)"
              }}
            >
              Assinar Plano PRO
            </Link>
          </div>

          {/* AGÊNCIA */}
          <div style={{
            backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16,
            padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between"
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Agência / Multi</div>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>Para agências que atendem vários clientes</p>
              
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: "#0f172a" }}>R$ 69,90</span>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>/mês</span>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0" }}>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Tudo incluído no plano PRO
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Gestão de múltiplos clientes/empresas
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Relatórios de scans para exportar
                </li>
                <li style={{ padding: "8px 0", fontSize: 13, color: "#334155", display: "flex", gap: 8, alignItems: "center" }}>
                  <Check size={16} color="#16a34a" /> Suporte prioritário via WhatsApp
                </li>
              </ul>
            </div>

            <Link
              href="/auth/sign-up"
              style={{
                width: "100%", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700,
                textAlign: "center", textDecoration: "none", backgroundColor: "#0f172a",
                color: "#ffffff", display: "block", boxSizing: "border-box"
              }}
            >
              Assinar Agência
            </Link>
          </div>

        </div>
      </section>

      {/* ── SEÇÃO: FAQ ── */}
      <section id="faq" style={{ padding: "80px 24px", maxWidth: 840, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 10px 0" }}>
            Perguntas Frequentes
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Tire suas dúvidas sobre o funcionamento do Qr Cuidja.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FAQS.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => toggleFaq(idx)}
              style={{
                backgroundColor: "#ffffff", border: "1px solid #e2e8f0",
                borderRadius: 12, padding: "18px 24px", cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{item.q}</span>
                <ChevronDown 
                  size={18} 
                  color="#64748b" 
                  style={{ 
                    transform: activeFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease" 
                  }} 
                />
              </div>
              {activeFaq === idx && (
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "14px 0 0 0" }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#0f172a", color: "#94a3b8", padding: "60px 24px 40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#ffffff", fontSize: 20, fontWeight: 900, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  backgroundColor: "#0284c7", color: "#ffffff",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <QrCode size={18} />
                </div>
                Qr Cuidja
              </div>
              <p style={{ fontSize: 13, color: "#64748b", maxWidth: 320, lineHeight: 1.6, margin: 0 }}>
                A plataforma brasileira para criar QR Codes inteligentes, dinâmicos e que aceleram suas avaliações no Google Maps.
              </p>
            </div>

            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", marginBottom: 12, textTransform: "uppercase" }}>Produto</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                  <li><a href="#recursos" style={{ color: "#94a3b8", textDecoration: "none" }}>Recursos</a></li>
                  <li><a href="#precos" style={{ color: "#94a3b8", textDecoration: "none" }}>Planos & Preços</a></li>
                  <li><Link href="/auth/login" style={{ color: "#94a3b8", textDecoration: "none" }}>Entrar no Painel</Link></li>
                </ul>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff", marginBottom: 12, textTransform: "uppercase" }}>Legal</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                  <li><Link href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>Privacidade</Link></li>
                  <li><Link href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>Termos de Serviço</Link></li>
                  <li><a href="mailto:contato@cuidja.com" style={{ color: "#94a3b8", textDecoration: "none" }}>Contato</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 12 }}>
            <div>
              © {new Date().getFullYear()} Qr Cuidja. Todos os direitos reservados.
            </div>
            <div>
              Desenvolvido com tecnologia de alta performance e foco em resultados.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
