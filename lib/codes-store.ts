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
    expires_at: "Expires in 13 days",
    created_at: "Sep 24, 2026"
  }
];

export function getStoredCodes(): QRCodeItem[] {
  if (typeof window === "undefined") return INITIAL_MOCK_CODES;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_CODES));
      return INITIAL_MOCK_CODES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_MOCK_CODES;
  }
}

// Salva localmente E sincroniza assincronamente com o banco de dados Supabase
export async function saveCodeItem(item: QRCodeItem): Promise<QRCodeItem[]> {
  const current = getStoredCodes();
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
  const current = getStoredCodes();
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
  const current = getStoredCodes();
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
  const current = getStoredCodes();
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
