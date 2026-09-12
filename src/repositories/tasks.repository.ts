import { CreateTaskDTO } from "@/components/types/task.types";
import { supabase } from "@/services/supabase";

export async function createTask({
  activityId,
  title,
  description,
  type,
  goalType,
  periodicity,
  frequencyQuantity = 1,
  xpBase = 1,
  targetValue,
  unitOfMeasurement,
  currentProgress = 0,
  targetWeight,
  targetRepetitions,
  targetSets,
  metadata = {},
}: CreateTaskDTO) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        activity_id: activityId,
        title: title.trim(),
        description: description?.trim() || null,
        type,
        goal_type: goalType,
        periodicity: periodicity ?? null,
        frequency_quantity: frequencyQuantity,
        xp_base: xpBase,
        target_value: targetValue ?? null,
        unit_of_measurement: unitOfMeasurement?.trim() || null,
        current_progress: currentProgress,
        target_weight: targetWeight ?? null,
        target_repetitions: targetRepetitions ?? null,
        target_sets: targetSets ?? null,
        metadata,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar tarefa/objetivo:", error);
    throw error;
  }

  return data;
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    console.error("Erro ao excluir tarefa:", error);
    throw error;
  }
}