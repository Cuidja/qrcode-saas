import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { validateTargetUrl } from "@/lib/url-validation";

const SLUG_PATTERN = /^[A-Za-z0-9_-]{3,64}$/;

// Nunca cachear: editar o destino precisa valer imediatamente para o mesmo QR impresso.
const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

function textResponse(message: string, status: number) {
  return new NextResponse(message, {
    status,
    headers: { ...NO_STORE, "Content-Type": "text/plain; charset=utf-8" },
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

  // 1. Buscar destino
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

  // 2. Nunca redirecionar para algo que não seja http(s) válido, mesmo que o banco contenha lixo.
  const target = validateTargetUrl(code.target_url);
  if (!target.ok) {
    console.error(`[redirect] target_url inválido para o slug ${slug}:`, target.error);
    return textResponse("O destino deste QR Code é inválido.", 502);
  }

  // 3. Registrar o scan (contador + analytics). Falha aqui não pode impedir o redirect.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : null;
  const { error: scanError } = await supabase.rpc("record_scan", {
    p_slug: slug,
    p_user_agent: request.headers.get("user-agent") ?? "",
    p_ip: ip ?? "",
  });
  if (scanError) {
    console.error("[redirect] Falha ao registrar scan:", scanError);
  }

  // 4. 307 (temporário): o destino pode mudar a qualquer momento.
  return NextResponse.redirect(target.url, { status: 307, headers: NO_STORE });
}
