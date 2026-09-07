import { supabase } from "@/services/supabase";

type CreateTaskDTO = {
  subcategoryId: string;
  title: string;
  description?: string;
  type: "BOOLEAN" | "PROGRESSIVE" | "FINITE";
  xpReward?: number;
  frequence?: number;
  targetWeight?: number;
  targetRepetitions?: number;
  targetDistanceKm?: number;
  targetDurationMin?: number;
};

export async function createTask({
  subcategoryId,
  title,
  description,
  type,
  xpReward = 50,
  frequence = 1,
  targetWeight,
  targetRepetitions,
  targetDistanceKm,
  targetDurationMin,
}: CreateTaskDTO) {
  const { data, error } = await supabase.from("tasks_or_goals").insert([
    {
      subcategory_id: subcategoryId,
      title: title.trim(),
      description: description?.trim() || null,
      type,
      xp_reward: xpReward,
      frequence: frequence ?? null,
      target_weight: targetWeight ?? null,
      target_repetitions: targetRepetitions ?? null,
      target_distance_km: targetDistanceKm ?? null,
      target_duration_min: targetDurationMin ?? null,
    },
  ]);

  if (error) {
    console.error("Erro ao criar tarefa/objetivo:", error);
    throw error;
  }

  return data;
}