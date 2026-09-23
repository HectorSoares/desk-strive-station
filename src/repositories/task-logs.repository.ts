import { supabase } from "@/services/supabase";

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

export async function registerTaskLog(payload: RegisterTaskLogDTO) {
  const { data, error } = await supabase.functions.invoke("register-task-log", {
    body: payload, 
  });

  if (error) {
    console.error("Erro ao registrar log via Edge Function:", error);
    throw error; 
  }

  return data; 
}