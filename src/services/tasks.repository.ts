import { supabase } from "@/services/supabase";

export type CreateTaskDTO = {
  activityId: string;
  title: string;
  description?: string;
  type: "BOOLEAN" | "PROGRESSIVE" | "FINITE";
  xpReward?: number;
  frequence?: number;
  targetWeight?: number;
  targetRepetitions?: number;
  targetDistanceKm?: number;
  targetDurationMin?: number;
  targetValue?: number;
  unitOfMeasurement?: string;
  currentProgress?: number;
  metadata?: Record<string, any>;
};

export async function createTask({
  activityId,
  title,
  description,
  type,
  xpReward = 50,
  frequence = 1,
  targetWeight,
  targetRepetitions,
  targetDistanceKm,
  targetDurationMin,
  targetValue,
  unitOfMeasurement,
  currentProgress,
  metadata
}: CreateTaskDTO) {
  const { data, error } = await supabase.from("tasks").insert([
    {
      activity_id: activityId,
      title: title.trim(),
      description: description?.trim() || null,
      type,
      xp_reward: xpReward,
      frequence: frequence ?? null,
      target_weight: targetWeight ?? null,
      target_repetitions: targetRepetitions ?? null,
      target_distance_km: targetDistanceKm ?? null,
      target_duration_min: targetDurationMin ?? null,
      target_value: targetValue ?? null,
      unit_of_measurement: unitOfMeasurement ?? null,
      current_progress: currentProgress ?? null,
      metadata: metadata ?? null,
    },
  ]);

  if (error) {
    console.error("Erro ao criar tarefa/objetivo:", error);
    throw error;
  }

  return data;
}