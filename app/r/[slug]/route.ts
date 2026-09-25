import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Slug inválido" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Se o Supabase estiver configurado no servidor
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        }
      });

      // 1. Buscar destino dinâmico no Supabase
      const { data: codeData } = await supabase
        .from("codes")
        .select("id, target_url, active, scans_count")
        .eq("slug", slug)
        .single();

      if (codeData) {
        if (!codeData.active) {
          return new NextResponse("Este QR Code está pausado ou desativado pelo proprietário.", { status: 403 });
        }

        // 2. Incrementar contagem de scans (RPC ou update)
        try {
          await supabase.rpc("increment_scan_count", { code_id: codeData.id });
        } catch {
          await supabase.from("codes").update({ scans_count: (codeData.scans_count || 0) + 1 }).eq("id", codeData.id);
        }

        // 3. Registrar Log de Scan (Analytics)
        try {
          const userAgent = request.headers.get("user-agent") || "";
          await supabase.from("scans").insert({
            code_id: codeData.id,
            user_agent: userAgent,
            ip_address: request.headers.get("x-forwarded-for") || "127.0.0.1"
          });
        } catch {
          // ignora log se tabela analytics falhar
        }

        // 4. Redirecionar para a URL final
        let redirectTarget = codeData.target_url;
        if (!redirectTarget.startsWith("http://") && !redirectTarget.startsWith("https://")) {
          redirectTarget = `https://${redirectTarget}`;
        }
        return NextResponse.redirect(redirectTarget, { status: 307 });
      }
    } catch (e) {
      console.error("Erro ao consultar Supabase no redirecionamento:", e);
    }
  }

  // Fallback seguro se não achar no Supabase ou em testes locais
  return NextResponse.redirect("https://cuidja.com", { status: 307 });
}
