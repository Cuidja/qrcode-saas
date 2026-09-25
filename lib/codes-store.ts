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
  },
  {
    id: "2",
    label: "https://cuidja.com/lead",
    slug: "bh1ui8",
    target_url: "https://cuidja.com/lead",
    type: "website",
    business_name: "Cuidja Leads",
    color: "#0284c7",
    bg_color: "#ffffff",
    icon: "google",
    shape: "rounded",
    corner_style: "rounded",
    cta_frame: "bottom_banner",
    cta_text: "Scan Me",
    scans: 2,
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
  const updated = current.map(c => c.id === id ? { ...c, target_url: newTarget, label: newTarget } : c);
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

export function deleteCodeItem(id: string): QRCodeItem[] {
  const current = getStoredCodes();
  const updated = current.filter(c => c.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
