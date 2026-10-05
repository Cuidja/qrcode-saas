/**
 * Configuração pública do Supabase (URL + chave publishable/anon).
 *
 * IMPORTANTE: as referências a process.env.NEXT_PUBLIC_* precisam ser literais
 * para o Next.js inlinar os valores no bundle do browser.
 * A chave service_role NUNCA é usada aqui (nem deve ir para o browser).
 */
export function getSupabasePublicConfig(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return { url, key };
}
