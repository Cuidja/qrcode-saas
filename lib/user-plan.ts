import { createClient } from "./supabase/client";

export type UserPlan = "free" | "pro" | "agency";

export interface PlanDetails {
  plan: UserPlan;
  isPro: boolean;
  isAgency: boolean;
  limit: number; // 2 for free, Infinity for pro/agency
  name: string;
}

export async function getUserPlan(): Promise<PlanDetails> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const plan = (user?.user_metadata?.plan as UserPlan) || "free";
    const isPro = plan === "pro" || plan === "agency";
    const isAgency = plan === "agency";
    const limit = isPro ? Infinity : 2;

    const names: Record<UserPlan, string> = {
      free: "Plano Free (Gratuito)",
      pro: "Plano PRO 🌟",
      agency: "Plano Agência 🏢"
    };

    return {
      plan,
      isPro,
      isAgency,
      limit,
      name: names[plan] || "Plano Free"
    };
  } catch {
    return {
      plan: "free",
      isPro: false,
      isAgency: false,
      limit: 2,
      name: "Plano Free (Gratuito)"
    };
  }
}

export async function setUserPlan(plan: UserPlan): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { 
        plan, 
        plan_updated_at: new Date().toISOString() 
      }
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
