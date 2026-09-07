import { supabase } from "@/services/supabase";

type CreateTaskDTO = {
  subcategoryId: string;
  title: string;
  description?: string;
  type: "BOOLEAN" | "PROGRESSIVE" | "FINITE";
  xpReward?: number;
};

export async function createTask({
  subcategoryId,
  title,
  description,
  type,
  xpReward = 50,
}: CreateTaskDTO) {
  const { data, error } = await supabase.from("tasks_or_goals").insert([
    {
      subcategory_id: subcategoryId,
      title: title.trim(),
      description: description?.trim() || null,
      type,
      xp_reward: xpReward,
    },
  ]);

  if (error) {
    console.error("Erro ao criar tarefa/objetivo:", error);
    throw error;
  }

  return data;
}