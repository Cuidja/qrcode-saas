import { NextRequest, NextResponse } from "next/server";

// Mock store para resolver o redirecionamento local ou consultar Supabase
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Em produção, isso busca no Supabase (SELECT target_url FROM codes WHERE slug = slug)
  // Se não encontrar ou durante o teste local, redireciona para a URL configurada ou demo
  if (slug) {
    // Redirecionamento 307 (Temporary Redirect) preserva SEO e permite mudar o link a qualquer momento
    return NextResponse.redirect("https://google.com", { status: 307 });
  }

  return NextResponse.json({ error: "QR Code não encontrado" }, { status: 404 });
}
