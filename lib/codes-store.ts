export interface QRCodeItem {
  id: string;
  label: string;
  slug: string;
  target_url: string;
  business_name?: string;
  color: string;
  bg_color: string;
  icon: string;
  cta_frame: "badge" | "banner" | "simple";
  cta_text: string;
  scans: number;
  active: boolean;
  created_at: string;
}

const STORAGE_KEY = "qrhub_codes_store";

export const INITIAL_MOCK_CODES: QRCodeItem[] = [
  {
    id: "1",
    label: "Placa Mesa 01 - Restaurante",
    slug: "rest-ctr",
    target_url: "https://g.page/r/seu-negocio/review",
    business_name: "Restaurante Bom Sabor",
    color: "#2563eb",
    bg_color: "#ffffff",
    icon: "google",
    cta_frame: "banner",
    cta_text: "SCAN ME",
    scans: 247,
    active: true,
    created_at: "10/09/2026"
  },
  {
    id: "2",
    label: "Balcão Atendimento",
    slug: "lj-bvista",
    target_url: "https://instagram.com/modafashion",
    business_name: "Moda Fashion Store",
    color: "#7c3aed",
    bg_color: "#ffffff",
    icon: "star",
    cta_frame: "badge",
    cta_text: "AVALIE AQUI",
    scans: 89,
    active: true,
    created_at: "08/09/2026"
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

export function saveCodeItem(item: QRCodeItem): QRCodeItem[] {
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
  return updated;
}

export function updateCodeTarget(id: string, newTarget: string): QRCodeItem[] {
  const current = getStoredCodes();
  const updated = current.map(c => c.id === id ? { ...c, target_url: newTarget } : c);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function toggleCodeActive(id: string): QRCodeItem[] {
  const current = getStoredCodes();
  const updated = current.map(c => c.id === id ? { ...c, active: !c.active } : c);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
