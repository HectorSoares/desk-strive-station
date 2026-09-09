import { Activity } from "@/components/types/activity.types";
import { Category } from "@/components/types/category.type";
import { TaskLog } from "@/components/types/task-log.type";
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
  task_logs: TaskLog[] | null;
};

type ActivityRow = {
  id: string;
  name: string;
  description: string | null;
  tasks: TaskRow[] | null;
};

type CategoryRow = {
  id: string;
  name: string;
  icon: string;
  level: number;
  activities: ActivityRow[] | null;
};

export type NewActivity = {
  categoryId: string;
  name: string;
};

export type CategoryUpdate = {
  id: string;
  name: string;
  icon: string;
};

function toActivity(activity: ActivityRow): Activity {
  const rawTasks = activity.tasks ?? [];

  const tasks: Task[] = rawTasks.map((t) => ({
    id: t.id,
    activity_id: t.activity_id,
    title: t.title,
    description: t.description ?? undefined,
    type: t.type,
    goal_type: t.goal_type,
    periodicity: t.periodicity ?? undefined,
    status: t.status,
    xp_base: t.xp_base,
    target_weight: t.target_weight ?? undefined,
    target_repetitions: t.target_repetitions ?? undefined,
    target_sets: t.target_sets ?? undefined,
    target_value: t.target_value ?? undefined,
    unit_of_measurement: t.unit_of_measurement ?? undefined,
    current_progress: t.current_progress ?? undefined,
    metadata: t.metadata ?? {},
    task_logs: t.task_logs ?? [],
  }));

  const primaryType = rawTasks[0]?.type ?? "BOOLEAN";

  const descriptions: Record<Task["type"], string> = {
    BOOLEAN: "Hábito / Consistência",
    QUANTITY: "Quantidade",
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

/** Operações de categorias e atividades persistidas no Supabase. */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      icon,
      level,
      activities (
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
            xp_gained,
            executed_weight,
            executed_repetitions,
            executed_sets,
            executed_value,
            current_progress,
            created_at
          )
        )
      )
    `)
    .order("name")
    .order("title", {
      referencedTable: "activities.tasks",
    })
    .order("created_at", {
      referencedTable: "activities.tasks.task_logs",
      ascending: false,
    })
    .limit(1, {
      referencedTable: "activities.tasks.task_logs",
    });

  if (error) throw error;

  return ((data ?? []) as CategoryRow[]).map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    level: category.level,
    activities: (category.activities ?? []).map(toActivity),
  }));
}

export async function updateCategory({
  id,
  name,
  icon,
}: CategoryUpdate) {
  const { error } = await supabase
    .from("categories")
    .update({ name, icon })
    .eq("id", id);

  if (error) throw error;
}