import { createClient } from "./supabase/client";
import { validateTargetUrl } from "./url-validation";

export interface QRCodeItem {
  id: string;
  label: string;
  slug: string;
  target_url: string;
  type: "website" | "vcard" | "pdf" | "social" | "google_reviews" | "wifi" | "feedback";
  business_name?: string;
  color: string;
  bg_color: string;
  icon: string;
  shape: "square" | "rounded" | "dots" | "classy";
  corner_style: "square" | "rounded" | "circle" | "leaf";
  cta_frame: "none" | "badge" | "top_banner" | "bottom_banner";
  cta_text: string;
  scans: number;
  active: boolean;
  expires_at?: string;
  created_at: string;
}

/**
 * Resultado de toda operação do store.
 * - `error === null`: a operação foi confirmada pelo Supabase.
 * - `error !== null`: a operação NÃO foi persistida; `codes` traz o estado real atual do banco
 *   (ou uma lista vazia se nem a leitura foi possível).
 *
 * O Supabase é a única fonte da verdade: não há mais cache em localStorage nem registro fictício,
 * para que a interface nunca mostre como "salvo" algo que não está no banco.
 */
export interface StoreResult {
  codes: QRCodeItem[];
  error: string | null;
}

export interface CreateResult extends StoreResult {
  created: QRCodeItem | null;
}

const SUPABASE_NOT_CONFIGURED = "Supabase não está configurado neste ambiente.";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbRow = Record<string, any>;

function mapRow(c: DbRow): QRCodeItem {
  return {
    id: c.id,
    label: c.label || c.target_url,
    slug: c.slug,
    target_url: c.target_url,
    type: c.type || "website",
    color: c.color || "#000000",
    bg_color: c.bg_color || "#ffffff",
    icon: c.icon || "none",
    shape: c.shape || "square",
    corner_style: c.corner_style || "square",
    cta_frame: c.cta_frame || "bottom_banner",
    cta_text: c.cta_text || "SCAN ME",
    scans: Number(c.scans_count) || 0,
    active: c.active !== false,
    created_at: c.created_at
      ? new Date(c.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
      : "",
  };
}

function describeError(error: { message?: string; code?: string } | null | undefined): string {
  if (!error) return "Erro desconhecido.";
  if (error.code === "23505") return "Já existe um QR Code com este slug. Gere outro e tente novamente.";
  if (error.code === "42501") return "Sem permissão. Faça login novamente e tente de novo.";
  if (error.code === "23514") return "Os dados enviados violam as regras do banco (verifique a URL e o slug).";
  return error.message || "Erro ao falar com o Supabase.";
}

function getClient() {
  try {
    return createClient();
  } catch {
    return null;
  }
}

/** Lê os QR Codes do usuário logado direto do banco. */
export async function getStoredCodes(): Promise<StoreResult> {
  const supabase = getClient();
  if (!supabase) return { codes: [], error: SUPABASE_NOT_CONFIGURED };

  const { data, error } = await supabase
    .from("codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { codes: [], error: describeError(error) };
  return { codes: (data ?? []).map(mapRow), error: null };
}

async function failWith(message: string): Promise<StoreResult> {
  const current = await getStoredCodes();
  return { codes: current.codes, error: message };
}

/** Cria um QR Code. Só retorna sucesso depois que o Supabase confirmar a linha gravada. */
export async function saveCodeItem(
  item: Omit<QRCodeItem, "id" | "scans" | "created_at"> & Partial<Pick<QRCodeItem, "id" | "scans" | "created_at">>,
): Promise<CreateResult> {
  const supabase = getClient();
  if (!supabase) return { codes: [], error: SUPABASE_NOT_CONFIGURED, created: null };

  const target = validateTargetUrl(item.target_url);
  if (!target.ok) {
    const current = await getStoredCodes();
    return { codes: current.codes, error: target.error, created: null };
  }

  const { data, error } = await supabase
    .from("codes")
    .insert({
      slug: item.slug,
      target_url: target.url,
      label: item.label?.trim() || target.url,
      type: item.type,
      active: item.active,
      color: item.color,
      bg_color: item.bg_color,
      icon: item.icon,
      shape: item.shape,
      corner_style: item.corner_style,
      cta_frame: item.cta_frame,
      cta_text: item.cta_text,
    })
    .select()
    .single();

  if (error || !data) {
    const current = await getStoredCodes();
    return { codes: current.codes, error: describeError(error), created: null };
  }

  const current = await getStoredCodes();
  return { codes: current.codes, error: current.error, created: mapRow(data) };
}

/** Altera o destino e o nome (rótulo). O slug (e portanto o QR impresso) não muda. */
export async function updateCodeTarget(id: string, newTarget: string, newLabel?: string): Promise<StoreResult> {
  const supabase = getClient();
  if (!supabase) return { codes: [], error: SUPABASE_NOT_CONFIGURED };

  const target = validateTargetUrl(newTarget);
  if (!target.ok) return failWith(target.error);

  const { data: existing, error: readError } = await supabase
    .from("codes")
    .select("id, label, target_url")
    .eq("id", id)
    .maybeSingle();

  if (readError) return failWith(describeError(readError));
  if (!existing) return failWith("QR Code não encontrado (ou você não tem permissão para editá-lo).");

  const patch: DbRow = { target_url: target.url, updated_at: new Date().toISOString() };
  
  // Se recebemos um label explícito, usamos ele. 
  // Senão, mantemos a lógica antiga (o label segue a URL se antes não tinha sido personalizado).
  if (newLabel !== undefined) {
    patch.label = newLabel.trim() || target.url;
  } else {
    const labelFollowsTarget = !existing.label || existing.label === existing.target_url;
    if (labelFollowsTarget) patch.label = target.url;
  }

  const { data: updatedRows, error } = await supabase
    .from("codes")
    .update(patch)
    .eq("id", id)
    .select("id");

  if (error) return failWith(describeError(error));
  if (!updatedRows || updatedRows.length === 0) {
    return failWith("Nenhuma linha foi atualizada. Verifique se você ainda tem acesso a este QR Code.");
  }

  return getStoredCodes();
}

export async function toggleCodeActive(id: string): Promise<StoreResult> {
  const supabase = getClient();
  if (!supabase) return { codes: [], error: SUPABASE_NOT_CONFIGURED };

  const { data: existing, error: readError } = await supabase
    .from("codes")
    .select("id, active")
    .eq("id", id)
    .maybeSingle();

  if (readError) return failWith(describeError(readError));
  if (!existing) return failWith("QR Code não encontrado.");

  const { data: updatedRows, error } = await supabase
    .from("codes")
    .update({ active: !existing.active, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");

  if (error) return failWith(describeError(error));
  if (!updatedRows || updatedRows.length === 0) return failWith("Nenhuma linha foi atualizada.");

  return getStoredCodes();
}

export async function deleteCodeItem(id: string): Promise<StoreResult> {
  const supabase = getClient();
  if (!supabase) return { codes: [], error: SUPABASE_NOT_CONFIGURED };

  const { data: deletedRows, error } = await supabase
    .from("codes")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) return failWith(describeError(error));
  if (!deletedRows || deletedRows.length === 0) {
    return failWith("Nada foi excluído. O QR Code não existe ou você não tem permissão.");
  }

  return getStoredCodes();
}
