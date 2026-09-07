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
  const { data, error } = await supabase.from("activity_logs").insert([
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