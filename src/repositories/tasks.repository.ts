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
    .insert([{
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
    }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar tarefa/objetivo:", error);
    throw error;
  }

  return data;
}

export type UpdateTaskDTO = {
  title: string;
  description?: string;
  type: CreateTaskDTO["type"];
  goalType: CreateTaskDTO["goalType"];
  periodicity?: CreateTaskDTO["periodicity"];
  frequencyQuantity?: number;
  xpBase: number;
  targetValue?: number;
  unitOfMeasurement?: string;
  targetWeight?: number;
  targetRepetitions?: number;
  targetSets?: number;
  metadata?: Record<string, any>;
};

export async function updateTask(taskId: string, {
  title,
  description,
  type,
  goalType,
  periodicity,
  frequencyQuantity = 1,
  xpBase = 1,
  targetValue,
  unitOfMeasurement,
  targetWeight,
  targetRepetitions,
  targetSets,
  metadata = {},
}: UpdateTaskDTO) {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: title.trim(),
      description: description?.trim() || null,
      type,
      goal_type: goalType,
      periodicity: periodicity ?? null,
      frequency_quantity: frequencyQuantity,
      xp_base: xpBase,
      target_value: targetValue ?? null,
      unit_of_measurement: unitOfMeasurement?.trim() || null,
      target_weight: targetWeight ?? null,
      target_repetitions: targetRepetitions ?? null,
      target_sets: targetSets ?? null,
      metadata,
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar tarefa:", error);
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