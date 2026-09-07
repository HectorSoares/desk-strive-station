import { supabase } from "@/services/supabase"; // Ajuste o caminho do client do Supabase se necessário

export interface UserProfile {
  level: number;
  total_xp: number;
  streak_days: number;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_profile")
    .select("level, total_xp, streak_days")
    .single();

  if (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    return null;
  }

  return data;
}