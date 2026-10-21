import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { validateTargetUrl } from "@/lib/url-validation";
import { checkRateLimit } from "@/lib/rate-limiter";

const SLUG_PATTERN = /^[A-Za-z0-9_-]{3,64}$/;

// Regex de identificação de rastreadores e geradores de thumbnail de redes sociais
const BOT_PATTERN = /bot|crawler|spider|crawling|facebookexternalhit|whatsapp|telegrambot|twitterbot|slackbot|discordbot|applebot|preview/i;

// Nunca cachear: editar o destino precisa valer imediatamente para o mesmo QR impresso.
const NO_STORE = { 
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Pragma": "no-cache",
};

function textResponse(message: string, status: number, headersExtra: Record<string, string> = {}) {
  return new NextResponse(message, {
    status,
    headers: { ...NO_STORE, "Content-Type": "text/plain; charset=utf-8", ...headersExtra },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return textResponse("QR Code inválido.", 400);
  }

  // 1. Rate Limiting por IP (Proteção ativa contra ataques de sobrecarga / DoS)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
  const rateLimit = checkRateLimit(ip, 60, 60_000); // 60 requisições por minuto por IP

  if (!rateLimit.allowed) {
    return textResponse(
      "Limite de requisições excedido. Por favor, aguarde alguns segundos.",
      429,
      { "Retry-After": String(rateLimit.resetSeconds) }
    );
  }

  const config = getSupabasePublicConfig();
  if (!config) {
    console.error(
      "[redirect] Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
    return textResponse("Serviço indisponível: configuração do servidor incompleta.", 503);
  }

  // Cliente sem sessão: o redirect é público e só usa as RPCs resolve_code / record_scan.
  const supabase = createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 2. Buscar destino no banco
  const { data, error } = await supabase.rpc("resolve_code", { p_slug: slug });

  if (error) {
    console.error("[redirect] Falha ao consultar o Supabase:", error);
    return textResponse("Não foi possível consultar o destino deste QR Code. Tente novamente.", 502);
  }

  const code = Array.isArray(data) ? data[0] : data;
  if (!code) {
    return textResponse("QR Code não encontrado.", 404);
  }

  if (!code.active) {
    return textResponse("Este QR Code está pausado ou desativado pelo proprietário.", 410);
  }

  // 3. Validação rigorosa e Anti-SSRF da URL antes de redirecionar
  const target = validateTargetUrl(code.target_url);
  if (!target.ok) {
    console.error(`[redirect] target_url inválido para o slug ${slug}:`, target.error);
    return textResponse("O destino deste QR Code é inválido ou inseguro.", 502);
  }

  // 4. Filtro Inteligente de Bots e Previews de Mensageiros (WhatsApp, Telegram, Facebook)
  // Se for um bot apenas gerando preview de link, não inflamos as métricas de scans reais de humanos.
  const userAgent = request.headers.get("user-agent") ?? "";
  const isBot = BOT_PATTERN.test(userAgent);

  if (!isBot) {
    const { error: scanError } = await supabase.rpc("record_scan", {
      p_slug: slug,
      p_user_agent: userAgent,
      p_ip: ip,
    });
    if (scanError) {
      console.error("[redirect] Falha ao registrar scan:", scanError);
    }
  }

  // 5. Redirecionamento 307 com cabeçalhos de segurança estritos
  return NextResponse.redirect(target.url, { 
    status: 307, 
    headers: {
      ...NO_STORE,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer-when-downgrade"
    } 
  });
}
