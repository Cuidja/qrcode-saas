import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade — QRCG",
  description: "Política de Privacidade e Proteção de Dados da plataforma QRCG.",
};

export default function PrivacyPage() {
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
          Política de Privacidade
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.6, marginBottom: 36 }}>
          A sua privacidade e a segurança dos seus dados são fundamentais para nós. Esta política explica como a <strong>QRCG</strong> coleta, usa, armazena e protege suas informações ao utilizar nossa plataforma de QR Codes dinâmicos e serviços integrados.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            1. Informações que Coletamos
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155", marginBottom: 12 }}>
            Para fornecer nossos serviços, coletamos as seguintes categorias de dados:
          </p>
          <ul style={{ paddingLeft: 20, fontSize: 15, lineHeight: 1.8, color: "#334155" }}>
            <li><strong>Dados de Conta:</strong> Nome, endereço de e-mail e foto de perfil fornecidos durante o cadastro direto ou através de login social (como Google OAuth).</li>
            <li><strong>Dados de QR Codes:</strong> URLs de destino, títulos personalizados, slugs e parâmetros de configuração visual (cores, molduras, logos).</li>
            <li><strong>Dados de Métricas e Acesso:</strong> Quantidade de escaneamentos dos seus QR Codes, endereço IP anonimizado, dispositivo, navegador e data/hora dos acessos para geração de relatórios de analytics.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            2. Uso de Dados e Autenticação Google
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155", marginBottom: 12 }}>
            Quando você opta por fazer login com sua conta Google:
          </p>
          <ul style={{ paddingLeft: 20, fontSize: 15, lineHeight: 1.8, color: "#334155" }}>
            <li>Acessamos apenas seu e-mail público, nome e identificador de perfil para autenticação segura.</li>
            <li><strong>Não solicitamos</strong> e <strong>não temos acesso</strong> aos seus e-mails do Gmail, contatos, arquivos do Google Drive ou senhas.</li>
            <li>Seus dados de login do Google nunca são compartilhados ou vendidos a terceiros.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            3. Finalidade do Tratamento
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
            Utilizamos suas informações exclusivamente para:
          </p>
          <ul style={{ paddingLeft: 20, fontSize: 15, lineHeight: 1.8, color: "#334155" }}>
            <li>Criar e manter sua conta ativa na plataforma.</li>
            <li>Garantir o redirecionamento instantâneo dos QR Codes para seus clientes finais.</li>
            <li>Apresentar relatórios de desempenho e métricas de escaneamento no seu painel.</li>
            <li>Garantir a segurança da plataforma e prevenir fraudes ou abusos de serviço.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            4. Seus Direitos (LGPD)
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
            Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD), você possui o direito de:
          </p>
          <ul style={{ paddingLeft: 20, fontSize: 15, lineHeight: 1.8, color: "#334155" }}>
            <li>Confirmar a existência de tratamento e acessar seus dados cadastrais.</li>
            <li>Solicitar a correção de dados incompletos ou desatualizados.</li>
            <li>Solicitar a exclusão definitiva da sua conta e de todos os seus QR Codes a qualquer momento.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
            5. Contato e Encarregado de Dados
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#334155" }}>
            Em caso de dúvidas sobre nossa Política de Privacidade ou para exercer qualquer um dos seus direitos, entre em contato através do e-mail de suporte: <a href="mailto:contato@cuidja.com" style={{ color: "#0284c7", fontWeight: 600 }}>contato@cuidja.com</a>.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "24px", textAlign: "center", fontSize: 13, color: "#64748b" }}>
        © {new Date().getFullYear()} QRCG. Todos os direitos reservados.
      </footer>
    </div>
  );
}
