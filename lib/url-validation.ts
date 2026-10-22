export const MAX_TARGET_URL_LENGTH = 2048;

export type UrlValidationResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

// Padrões de endereços privados / loopback / metadados em nuvem (Anti-SSRF)
const PRIVATE_IP_PATTERNS = [
  /^127\./,                         // 127.0.0.0/8 (Loopback)
  /^10\./,                          // 10.0.0.0/8 (Rede Privada)
  /^192\.168\./,                    // 192.168.0.0/16 (Rede Privada Local)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12 (Rede Privada)
  /^169\.254\./,                    // 169.254.0.0/16 (Link-local / AWS Metadata 169.254.169.254)
  /^0\.0\.0\.0$/,
  /^::1$/,                          // IPv6 loopback
  /^fc00:/i,                        // IPv6 Unique Local
  /^fe80:/i,                        // IPv6 Link-local
];

/**
 * Validação rigorosa e sanitização de URLs de destino.
 * - Só aceita http:// e https:// (bloqueia javascript:, data:, file:, etc.).
 * - Se o usuário digitar sem esquema ("meusite.com"), assume https://.
 * - Rejeita credenciais embutidas (user:senha@host).
 * - Proteção Anti-SSRF: rejeita localhost, IPs privados e metadados de nuvem.
 * - Proteção Anti-Looping: rejeita redirecionamentos recursivos para o próprio /r/.
 * - Bloqueia números puros (como telefones ou chaves) de serem interpretados como IPs pelo parser de URL.
 */
export function validateTargetUrl(input: string): UrlValidationResult {
  const raw = (input ?? "").trim();

  if (!raw) return { ok: false, error: "Informe a URL de destino." };
  if (raw.length > MAX_TARGET_URL_LENGTH) {
    return { ok: false, error: `A URL excede o limite máximo de ${MAX_TARGET_URL_LENGTH} caracteres.` };
  }
  if (/[\s\u0000-\u001f]/.test(raw)) {
    return { ok: false, error: "A URL não pode conter espaços ou caracteres de controle inválidos." };
  }

  // 0. Bloquear se o usuário digitou apenas números (evita que a especificação WHATWG URL
  // converta inteiros/octais como '05317244501' para o IP '43.61.73.65')
  const cleanNumeric = raw.replace(/^https?:\/\//i, "").replace(/[\s/().-]/g, "");
  if (/^\d+$/.test(cleanNumeric)) {
    const phoneDigits = cleanNumeric.replace(/^0+/, "");
    if (phoneDigits.length >= 10 && phoneDigits.length <= 11) {
      return {
        ok: false,
        error: `O destino informado ('${raw}') parece um telefone/celular com DDD. Para WhatsApp, use o link: https://wa.me/55${phoneDigits}`
      };
    }
    return {
      ok: false,
      error: `O destino informado ('${raw}') contém apenas números. Digite um endereço de site válido (exemplo: seusite.com.br).`
    };
  }

  // Esquema explícito diferente de http(s) (ex.: javascript:, data:, mailto:, ftp://)
  const hasExplicitScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
  const looksLikeHostPort = /^[^/\s:@]+:\d+(\/|$)/.test(raw);
  const candidate = hasExplicitScheme && !looksLikeHostPort ? raw : `https://${raw}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: "Formato de URL inválido." };
  }

  // 1. Apenas HTTP e HTTPS
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Apenas protocolos seguros http:// ou https:// são permitidos." };
  }

  // 2. Proibir credenciais embutidas
  if (parsed.username || parsed.password) {
    return { ok: false, error: "A URL não pode conter usuário ou senha embutidos por motivos de segurança." };
  }

  const host = parsed.hostname.toLowerCase();

  // 3. Proibir localhost
  if (host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1") {
    return { ok: false, error: "Endereços locais (localhost) não são permitidos em produção." };
  }

  // 4. Bloqueio Anti-SSRF (IPs privados / Metadados AWS/GCP)
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(host)) {
      return { ok: false, error: "Endereços IP de redes internas ou privadas não são permitidos." };
    }
  }

  // 5. Bloquear endereços IP numéricos (IPv4 ou inteiros resolvidos)
  // Domínios públicos obrigatoriamente devem conter letras (ex: site.com.br)
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host) || !/[a-z]/i.test(host)) {
    return { ok: false, error: "Endereços IP diretos ou numéricos não são permitidos. Informe um domínio válido (exemplo: seusite.com.br)." };
  }

  // 6. Exigir formato de domínio válido
  if (!host.includes(".")) {
    return { ok: false, error: "Informe um domínio público válido (exemplo: seusite.com.br)." };
  }

  // 7. Proteção Anti-Looping (Não permitir que um QR Code aponte para outro /r/ do próprio domínio)
  const pathname = parsed.pathname.toLowerCase();
  if ((host === "qr.cuidja.com" || host.endsWith("cuidja.com")) && pathname.startsWith("/r/")) {
    return { ok: false, error: "Não é permitido criar redirecionamentos recursivos para o próprio encurtador." };
  }

  return { ok: true, url: parsed.toString() };
}
