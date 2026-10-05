export const MAX_TARGET_URL_LENGTH = 2048;

export type UrlValidationResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Valida e normaliza uma URL de destino.
 * - Só aceita http:// e https:// (bloqueia javascript:, data:, file:, etc.).
 * - Se o usuário digitar sem esquema ("meusite.com"), assume https://.
 * - Rejeita credenciais embutidas (user:senha@host) e hosts sem ponto (exceto localhost).
 */
export function validateTargetUrl(input: string): UrlValidationResult {
  const raw = (input ?? "").trim();

  if (!raw) return { ok: false, error: "Informe a URL de destino." };
  if (raw.length > MAX_TARGET_URL_LENGTH) {
    return { ok: false, error: `A URL excede ${MAX_TARGET_URL_LENGTH} caracteres.` };
  }
  if (/[\s\u0000-\u001f]/.test(raw)) {
    return { ok: false, error: "A URL não pode conter espaços ou caracteres de controle." };
  }

  // Esquema explícito diferente de http(s) (ex.: javascript:, data:, mailto:, ftp://)
  const hasExplicitScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
  const looksLikeHostPort = /^[^/\s:@]+:\d+(\/|$)/.test(raw); // "meusite.com:8080/x"
  const candidate = hasExplicitScheme && !looksLikeHostPort ? raw : `https://${raw}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: "URL inválida." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Apenas URLs http:// ou https:// são permitidas." };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, error: "A URL não pode conter usuário ou senha embutidos." };
  }
  const host = parsed.hostname;
  if (!host || (!host.includes(".") && host !== "localhost" && !host.includes(":"))) {
    return { ok: false, error: "Informe um domínio válido (ex.: meusite.com)." };
  }

  return { ok: true, url: parsed.toString() };
}
