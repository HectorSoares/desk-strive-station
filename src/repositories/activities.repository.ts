import { Activity } from "@/components/types/activity.types";
import { Task } from "@/components/types/task.types";
import { supabase } from "@/services/supabase";

type TaskRow = {
  id: string;
  activity_id: string;
  title: string;
  description: string | null;
  type: Task["type"];
  goal_type: Task["goal_type"];
  periodicity: Task["periodicity"] | null;
  status: "PENDING" | "COMPLETED";
  xp_base: number;
  target_weight: number | null;
  target_repetitions: number | null;
  target_sets: number | null;
  target_value: number | null;
  unit_of_measurement: string | null;
  current_progress: number | null;
  metadata: Record<string, any> | null;
  frequency_quantity: number | null;
  created_at: string;
  task_logs: TaskLogRow[] | null;
};

type TaskLogRow = {
  id: string;
  task_id: string;
  xp_gained: number;
  executed_weight: number | null;
  executed_repetitions: number | null;
  executed_sets: number | null;
  executed_value: number | null;
  current_progress: number | null;
  metadata: Record<string, any> | null;
  created_at: string;
};

export type ActivityRow = {
  id: string;
  name: string;
  description: string | null;
  tasks: TaskRow[] | null;
};

export type NewActivity = {
  categoryId: string;
  name: string;
};

export type ActivityUpdate = {
  id: string;
  name: string;
};

function toTask(task: TaskRow): Task {
  return {
    id: task.id,
    activity_id: task.activity_id,
    title: task.title,
    description: task.description ?? undefined,
    type: task.type,
    goal_type: task.goal_type,
    periodicity: task.periodicity ?? undefined,
    status: task.status,
    xp_base: task.xp_base,
    target_weight: task.target_weight ?? undefined,
    target_repetitions: task.target_repetitions ?? undefined,
    target_sets: task.target_sets ?? undefined,
    target_value: task.target_value ?? undefined,
    unit_of_measurement: task.unit_of_measurement ?? undefined,
    current_progress: task.current_progress ?? undefined,
    frequency_quantity: task.frequency_quantity || 0,
    metadata: task.metadata ?? {},
    created_at: task.created_at,
    task_logs: (task.task_logs ?? []).map((log) => ({
      id: log.id,
      task_id: log.task_id,
      xp_gained: log.xp_gained,
      executed_weight: log.executed_weight ?? undefined,
      executed_repetitions: log.executed_repetitions ?? undefined,
      executed_sets: log.executed_sets ?? undefined,
      executed_value: log.executed_value ?? undefined,
      current_progress: log.current_progress ?? undefined,
      metadata: log.metadata ?? {},
      created_at: log.created_at,
    })),
  };
}

export function toActivity(activity: ActivityRow): Activity {
  const tasks = (activity.tasks ?? []).map(toTask);

  const primaryType = tasks[0]?.type ?? "BOOLEAN";

  const descriptions: Record<Task["type"], string> = {
    BOOLEAN: "Hábito / Consistência",
    PROGRESS: "Métrica Progressiva",
    EXERCISE: "Exercício",
    COMPOSITE: "Meta Composta",
  };

  return {
    id: activity.id,
    name: activity.name,
    desc: descriptions[primaryType],
    tasks,
  };
}

export async function getActivitiesByCategory(
  categoryId: string,
): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select(`
      id,
      name,
      description,
      tasks (
        id,
        activity_id,
        title,
        description,
        type,
        goal_type,
        periodicity,
        status,
        xp_base,
        target_weight,
        target_repetitions,
        target_sets,
        target_value,
        unit_of_measurement,
        current_progress,
        metadata,
        task_logs (
          id,
          task_id,
          xp_gained,
          executed_weight,
          executed_repetitions,
          executed_sets,
          executed_value,
          current_progress,
          metadata,
          created_at
        )
      )
    `)
    .eq("category_id", categoryId)
    .order("name")
    .order("title", { referencedTable: "tasks" })
    .order("created_at", {
      referencedTable: "tasks.task_logs",
      ascending: false,
    })
    .limit(1, { referencedTable: "tasks.task_logs" });

  if (error) {
    console.error("Erro ao buscar atividades:", error);
    throw error;
  }

  return ((data ?? []) as ActivityRow[]).map(toActivity);
}

export async function createActivity({
  categoryId,
  name,
}: NewActivity) {
  const { data, error } = await supabase
    .from("activities")
    .insert({
      category_id: categoryId,
      name: name.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar atividade:", error);
    throw error;
  }

  return data;
}

export async function updateActivity({
  id,
  name,
}: ActivityUpdate) {
  const { error } = await supabase
    .from("activities")
    .update({
      name: name.trim(),
    })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar atividade:", error);
    throw error;
  }
}

export async function deleteActivity(activityId: string) {
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", activityId);

  if (error) {
    console.error("Erro ao excluir atividade:", error);
    throw error;
  }
}