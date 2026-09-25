import { createClient } from "./supabase/client";

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

const STORAGE_KEY = "qrhub_codes_store_v2";

export const INITIAL_MOCK_CODES: QRCodeItem[] = [
  {
    id: "1",
    label: "https://cuidja.com",
    slug: "bh1ukN",
    target_url: "https://cuidja.com",
    type: "website",
    business_name: "Cuidja Tech",
    color: "#0f172a",
    bg_color: "#ffffff",
    icon: "none",
    shape: "square",
    corner_style: "square",
    cta_frame: "bottom_banner",
    cta_text: "Scan Me",
    scans: 0,
    active: true,
    created_at: "Sep 24, 2026"
  }
];

export async function getStoredCodes(): Promise<QRCodeItem[]> {
  if (typeof window === "undefined") return INITIAL_MOCK_CODES;

  let localItems: QRCodeItem[] = [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      localItems = JSON.parse(data);
    }
  } catch {
    // fallback
  }

  try {
    const supabase = createClient();
    const { data: dbCodes, error } = await supabase.from("codes").select("*").order("created_at", { ascending: false });

    if (dbCodes && dbCodes.length > 0 && !error) {
      const mapped: QRCodeItem[] = dbCodes.map(c => ({
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
        scans: c.scans_count || 0,
        active: c.active !== false,
        created_at: c.created_at ? new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Sep 24, 2026"
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      return mapped;
    }
  } catch (e) {
    console.warn("Usando cache local para listagem de QR codes:", e);
  }

  if (localItems.length === 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CODES));
    return INITIAL_MOCK_CODES;
  }

  return localItems;
}

// Salva localmente E sincroniza assincronamente com o banco de dados Supabase
export async function saveCodeItem(item: QRCodeItem): Promise<QRCodeItem[]> {
  const current = await getStoredCodes();
  const existingIdx = current.findIndex(c => c.id === item.id);
  let updated: QRCodeItem[];

  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = item;
  } else {
    updated = [item, ...current];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Tentar persistir no banco Supabase
  try {
    const supabase = createClient();
    await supabase.from("codes").upsert({
      slug: item.slug,
      target_url: item.target_url,
      label: item.label,
      type: item.type,
      active: item.active,
      color: item.color,
      bg_color: item.bg_color,
      icon: item.icon,
      shape: item.shape,
      corner_style: item.corner_style,
      cta_frame: item.cta_frame,
      cta_text: item.cta_text
    }, { onConflict: "slug" });
  } catch (e) {
    console.warn("Sem conexão direta ao Supabase no momento, mantendo em cache local:", e);
  }

  return updated;
}

export async function updateCodeTarget(id: string, newTarget: string): Promise<QRCodeItem[]> {
  const current = await getStoredCodes();
  const itemToUpdate = current.find(c => c.id === id);
  const updated = current.map(c => c.id === id ? { ...c, target_url: newTarget, label: newTarget } : c);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  if (itemToUpdate) {
    try {
      const supabase = createClient();
      await supabase.from("codes").update({ target_url: newTarget, label: newTarget }).eq("slug", itemToUpdate.slug);
    } catch (e) {
      console.warn("Erro ao sincronizar update com Supabase:", e);
    }
  }

  return updated;
}

export async function toggleCodeActive(id: string): Promise<QRCodeItem[]> {
  const current = await getStoredCodes();
  const itemToUpdate = current.find(c => c.id === id);
  const updated = current.map(c => c.id === id ? { ...c, active: !c.active } : c);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  if (itemToUpdate) {
    try {
      const supabase = createClient();
      await supabase.from("codes").update({ active: !itemToUpdate.active }).eq("slug", itemToUpdate.slug);
    } catch (e) {
      console.warn("Erro ao atualizar status no Supabase:", e);
    }
  }

  return updated;
}

export async function deleteCodeItem(id: string): Promise<QRCodeItem[]> {
  const current = await getStoredCodes();
  const itemToDelete = current.find(c => c.id === id);
  const updated = current.filter(c => c.id !== id);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  if (itemToDelete) {
    try {
      const supabase = createClient();
      await supabase.from("codes").delete().eq("slug", itemToDelete.slug);
    } catch (e) {
      console.warn("Erro ao remover no Supabase:", e);
    }
  }

  return updated;
}
