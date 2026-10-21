import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Serviço — Qr Cuidja",
  description: "Termos e Condições de Uso da plataforma Qr Cuidja.",
};

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", color: "#1e293b", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #e2e8f0", padding: "18px 24px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "#0284c7", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
            <ArrowLeft size={16} /> Voltar ao Início
          </Link>
          <span style={{ fontSize: 13, color: "#64748b" }}>Atualizado em 21 de Outubro de 2026</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 840, margin: "0 auto", padding: "48px 24px 80px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", marginBottom: 12, letterSpacing: "-0.5px" }}>
          Termos de Serviço
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.6, marginBottom: 36 }}>
          Bem-vindo ao <strong>Qr Cuidja</strong>. Ao acessar ou utilizar nossa plataforma, você concorda em cumprir e estar vinculado aos presentes Termos de Serviço. Caso não concorde com qualquer termo, não utilize a plataforma.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            1. Objeto do Serviço
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
            A Qr Cuidja disponibiliza ferramentas de software como serviço (SaaS) para criação, customização visual, gerenciamento dinâmico e rastreamento analítico de códigos QR voltados para marketing, avaliações no Google Maps e conectividade empresarial.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            2. Uso Aceitável e Responsabilidade do Usuário
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155", marginBottom: 12 }}>
            O usuário declara e garante que os QR Codes gerados não serão utilizados para:
          </p>
          <ul style={{ paddingLeft: 20, fontSize: 15, lineHeight: 1.8, color: "#334155" }}>
            <li>Redirecionamento para conteúdos maliciosos, phishing, malwares ou vírus.</li>
            <li>Divulgação de produtos ou serviços ilegais conforme a legislação brasileira.</li>
            <li>Violação de direitos autorais, marcas registradas ou propriedade intelectual de terceiros.</li>
            <li>Disseminação de mensagens fraudulentas ou tentativas de estelionato.</li>
          </ul>
          <p style={{ fontSize: 14, color: "#ef4444", fontWeight: 600, marginTop: 10 }}>
            * Qualquer QR Code identificado violando estas regras será desativado imediatamente sem aviso prévio.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            3. Planos, Assinaturas e Pagamentos
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
            A plataforma opera sob o modelo freemium. Recursos avançados (como códigos adicionais, customização e suporte premium) exigem a contratação de planos pagos (PRO ou Agência). O cancelamento pode ser efetuado a qualquer momento através do painel de faturamento.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            4. Disponibilidade e Isenção de Garantias
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
            Empregamos os melhores esforços técnicos para assegurar disponibilidade contínua dos redirecionamentos dos códigos QR. Contudo, não nos responsabilizamos por indisponibilidades temporárias decorrentes de falhas em operadoras de telecomunicação, servidores terceiros ou serviços externos (como Google Maps).
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            5. Legislação Aplicável e Foro
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Para a resolução de quaisquer litígios, fica eleito o Foro da comarca do domicílio do usuário.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "24px", textAlign: "center", fontSize: 13, color: "#64748b" }}>
        © 2026 Qr Cuidja. Todos os direitos reservados.
      </footer>
    </div>
  );
}
