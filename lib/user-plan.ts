import { createClient } from "./supabase/client";

export type UserPlan = "free" | "pro" | "agency" | "admin";

export interface PlanDetails {
  plan: UserPlan;
  isPro: boolean;
  isAgency: boolean;
  isAdmin: boolean;
  limit: number; // 2 for free, Infinity for pro/agency/admin
  name: string;
}

/**
 * Lista de e-mails com permissões de Administrador Master.
 * Qualquer administrador possui QR Codes ilimitados e acesso total irrestrito.
 */
export const ADMIN_EMAILS: string[] = [
  "alfelixoliveira@gmail.com",
];

/**
 * Verifica se um usuário possui privilégios de Administrador.
 * Checa a lista fixa de administradores, variáveis de ambiente e metadados no Supabase.
 */
export function isUserAdmin(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
} | null | undefined): boolean {
  if (!user) return false;

  const email = user.email?.toLowerCase().trim();
  if (email && ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(email)) {
    return true;
  }

  // Verifica variável de ambiente opcional NEXT_PUBLIC_ADMIN_EMAILS ou ADMIN_EMAILS
  const envAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "")
    .toLowerCase()
    .split(",")
    .map(e => e.trim())
    .filter(Boolean);

  if (email && envAdmins.includes(email)) {
    return true;
  }

  // Checa roles salvas em metadata do Supabase Auth
  if (user.user_metadata?.role === "admin" || user.user_metadata?.is_admin === true) {
    return true;
  }
  if (user.app_metadata?.role === "admin" || user.app_metadata?.is_admin === true) {
    return true;
  }

  return false;
}

export async function getUserPlan(): Promise<PlanDetails> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const isAdmin = isUserAdmin(user);
    const rawPlan = (user?.user_metadata?.plan as UserPlan) || "free";

    // Qualquer administrador tem QR Codes infinitos e status PRO/Agência garantidos
    const isPro = isAdmin || rawPlan === "pro" || rawPlan === "agency";
    const isAgency = isAdmin || rawPlan === "agency";
    const limit = (isAdmin || isPro) ? Infinity : 2;
    const plan: UserPlan = isAdmin ? "agency" : rawPlan;

    const names: Record<UserPlan, string> = {
      free: "Plano Free (Gratuito)",
      pro: "Plano PRO 🌟",
      agency: "Plano Agência 🏢",
      admin: "Administrador Master 👑"
    };

    const displayName = isAdmin 
      ? "Administrador (Ilimitado ∞) 👑" 
      : (names[plan] || "Plano Free");

    // Sincroniza metadados do Supabase se o usuário for admin e ainda não tiver a flag
    if (isAdmin && user && (user.user_metadata?.role !== "admin" || user.user_metadata?.is_admin !== true)) {
      supabase.auth.updateUser({
        data: {
          role: "admin",
          is_admin: true,
          plan: "agency"
        }
      }).catch(() => {
        // Ignora erros em background de sincronização
      });
    }

    return {
      plan,
      isPro,
      isAgency,
      isAdmin,
      limit,
      name: displayName
    };
  } catch {
    return {
      plan: "free",
      isPro: false,
      isAgency: false,
      isAdmin: false,
      limit: 2,
      name: "Plano Free (Gratuito)"
    };
  }
}

export async function setUserPlan(plan: UserPlan): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Se o usuário for admin, mantemos o papel de admin ativo
    const isAdmin = isUserAdmin(user);
    const updateData: Record<string, unknown> = {
      plan,
      plan_updated_at: new Date().toISOString()
    };

    if (isAdmin) {
      updateData.role = "admin";
      updateData.is_admin = true;
    }

    const { error } = await supabase.auth.updateUser({
      data: updateData
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return { success: false, error: message };
  }
}
