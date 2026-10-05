import { createClient } from "./supabase/client";

export interface ScanRow {
  id: string;
  code_id: string;
  scanned_at: string;
  user_agent: string | null;
}

export interface DailyPoint {
  date: string; // YYYY-MM-DD (fuso local)
  label: string; // DD/MM
  count: number;
}

export interface ScanStats {
  total: number;
  today: number;
  last7Days: number;
  last30Days: number;
  daily: DailyPoint[]; // últimos 14 dias
  devices: { label: string; count: number }[];
  perCode: Record<string, number>;
  truncated: boolean;
}

export interface ScanStatsResult {
  stats: ScanStats;
  error: string | null;
}

const MAX_ROWS = 5000;

export function detectDevice(userAgent: string | null): string {
  const ua = (userAgent || "").toLowerCase();
  if (!ua) return "Desconhecido";
  if (/bot|crawler|spider|preview|facebookexternalhit|slurp/.test(ua)) return "Bot / Preview";
  if (/iphone|ipad|ipod/.test(ua)) return "iOS";
  if (/android/.test(ua)) return "Android";
  if (/windows|macintosh|linux|cros/.test(ua)) return "Desktop";
  return "Outro";
}

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function emptyStats(): ScanStats {
  return {
    total: 0,
    today: 0,
    last7Days: 0,
    last30Days: 0,
    daily: [],
    devices: [],
    perCode: {},
    truncated: false,
  };
}

export function computeStats(rows: ScanRow[], truncated: boolean): ScanStats {
  const now = new Date();
  const todayKey = localDateKey(now);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const DAY = 24 * 60 * 60 * 1000;

  const dailyMap = new Map<string, number>();
  const daily: DailyPoint[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(startOfToday - i * DAY);
    const key = localDateKey(d);
    dailyMap.set(key, 0);
    daily.push({
      date: key,
      label: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      count: 0,
    });
  }

  let today = 0;
  let last7Days = 0;
  let last30Days = 0;
  const deviceMap = new Map<string, number>();
  const perCode: Record<string, number> = {};

  for (const row of rows) {
    const when = new Date(row.scanned_at);
    const key = localDateKey(when);
    const age = startOfToday + DAY - when.getTime();

    if (key === todayKey) today++;
    if (age <= 7 * DAY) last7Days++;
    if (age <= 30 * DAY) last30Days++;

    if (dailyMap.has(key)) dailyMap.set(key, (dailyMap.get(key) || 0) + 1);

    const device = detectDevice(row.user_agent);
    deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    perCode[row.code_id] = (perCode[row.code_id] || 0) + 1;
  }

  for (const point of daily) point.count = dailyMap.get(point.date) || 0;

  return {
    total: rows.length,
    today,
    last7Days,
    last30Days,
    daily,
    devices: Array.from(deviceMap.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    perCode,
    truncated,
  };
}

/** Busca os scans do usuário logado (RLS já restringe aos QR Codes dele). */
export async function getScanStats(codeId?: string): Promise<ScanStatsResult> {
  let supabase;
  try {
    supabase = createClient();
  } catch {
    return { stats: emptyStats(), error: "Supabase não está configurado neste ambiente." };
  }

  let query = supabase
    .from("scans")
    .select("id, code_id, scanned_at, user_agent")
    .order("scanned_at", { ascending: false })
    .limit(MAX_ROWS);

  if (codeId) query = query.eq("code_id", codeId);

  const { data, error } = await query;
  if (error) return { stats: emptyStats(), error: error.message || "Falha ao carregar analytics." };

  const rows = (data ?? []) as ScanRow[];
  return { stats: computeStats(rows, rows.length >= MAX_ROWS), error: null };
}
