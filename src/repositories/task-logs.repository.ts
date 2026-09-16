import { supabase } from "@/services/supabase";

export type CreateTaskLogDTO = {
  taskId: string;
  xpGained?: number;
  executedWeight?: number;
  executedRepetitions?: number;
  executedSets?: number;
  executedValue?: number;
  currentProgress?: number;
  metadata?: Record<string, any>;
  executedAt?: string;
};

export async function createTaskLog({
  taskId,
  xpGained = 0,
  executedWeight,
  executedRepetitions,
  executedSets,
  executedValue,
  currentProgress,
  metadata = {},
  executedAt,
}: CreateTaskLogDTO) {
  const { data, error } = await supabase
    .from("task_logs")
    .insert([
      {
        task_id: taskId,
        xp_gained: xpGained,
        executed_weight: executedWeight ?? null,
        executed_repetitions: executedRepetitions ?? null,
        executed_sets: executedSets ?? null,
        executed_value: executedValue ?? null,
        current_progress: currentProgress ?? null,
        executed_at: executedAt ?? new Date().toISOString(),
        metadata,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao inserir log da tarefa:", error);
    throw error;
  }

  return data;
}

export type RegisterTaskLogDTO = {
  taskId: string;
  executedWeight?: number;
  executedRepetitions?: number;
  executedSets?: number;
  executedValue?: number;
  currentProgress?: number;
  executedAt?: string;
  progressMode?: "INCREMENT" | "ABSOLUTE";
};

export async function registerTaskLog({
  taskId,
  executedWeight,
  executedRepetitions,
  executedSets,
  executedValue,
  currentProgress,
  progressMode,
  executedAt,
}: RegisterTaskLogDTO) {
  const { data, error } = await supabase.rpc("register_task_log", {
    p_task_id: taskId,
    p_executed_weight: executedWeight ?? null,
    p_executed_repetitions: executedRepetitions ?? null,
    p_executed_sets: executedSets ?? null,
    p_executed_value: executedValue ?? null,
    p_current_progress: currentProgress ?? null,
    p_progress_mode: progressMode ?? null,
    p_executed_at: executedAt ?? new Date().toISOString(),
  });

  if (error) {
    console.error("Erro ao registrar log da tarefa:", error);
    throw error;
  }

  return data;
}