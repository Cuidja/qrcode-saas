import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getSupabasePublicConfig } from "./supabase/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Indica se as variáveis públicas do Supabase estão definidas.
export const hasEnvVars = getSupabasePublicConfig() !== null;
