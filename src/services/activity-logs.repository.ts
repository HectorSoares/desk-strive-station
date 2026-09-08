import { supabase } from "@/services/supabase";

type CreateActivityLogDTO = {
  taskId: string;
  xpGained?: number;
  metadata?: Record<string, any>;
};

export async function createActivityLog({
  taskId,
  xpGained = 50,
  metadata = {},
}: CreateActivityLogDTO) {
  const { data, error } = await supabase.from("task_logs").insert([
    {
      task_id: taskId,
      xp_gained: xpGained,
      metadata: metadata,
    },
  ]);

  if (error) {
    console.error("Erro ao inserir log da atividade:", error);
    throw error;
  }

  return data;
}

type RegisterLogDTO = {
  taskId: string;
  executedWeight?: number;
  executedRepetitions?: number;
  executedDistanceKm?: number;
  executedDurationMin?: number;
};

export async function registerActivityLog({
  taskId,
  executedWeight,
  executedRepetitions,
  executedDistanceKm,
  executedDurationMin,
}: RegisterLogDTO) {
  const { data, error } = await supabase.rpc("register_activity_log", {
    p_task_id: taskId,
    p_executed_weight: executedWeight ?? null,
    p_executed_repetitions: executedRepetitions ?? null,
    p_executed_distance_km: executedDistanceKm ?? null,
    p_executed_duration_min: executedDurationMin ?? null,
  });

  if (error) {
    console.error("Erro ao registrar log de atividade:", error);
    throw error;
  }

  return data;
}