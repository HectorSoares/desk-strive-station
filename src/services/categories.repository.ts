
import { Activity } from '@/components/types/activity.types';
import { Category } from '@/components/types/category.type';
import { TaskLog } from '@/components/types/task-log.type';
import { Task } from '@/components/types/task.types';
import { supabase } from '@/services/supabase';

type TaskRow = {
  id: string;
  activity_id: string;
  title: string;
  description: string | null;
  type: Task['type'];
  status: 'PENDING' | 'COMPLETED';
  xp_reward: number;
  frequence: number | null;
  target_weight: number | null;
  target_repetitions: number | null;
  target_distance_km: number | null;
  target_duration_min: number | null;
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

// Converte a subcategoria e mapeia suas tasks para o formato esperado pelo frontend
function toActivity(activity: ActivityRow): Activity {
  const rawTasks = activity.tasks ?? [];

  // Transforma as tarefas do banco para o formato do componente TaskItem
  const tasks: Task[] = rawTasks.map((t) => ({
    id: t.id,
    activity_id: t.activity_id,
    title: t.title,
    description: t.description ?? undefined,
    type: t.type,
    status: t.status,
    xp_reward: t.xp_reward,
    frequence: t.frequence ?? undefined,
    target_weight: t.target_weight ?? undefined,
    target_repetitions: t.target_repetitions ?? undefined,
    target_distance_km: t.target_distance_km ?? undefined,
    target_duration_min: t.target_duration_min ?? undefined,
    target_value: t.target_value ?? undefined,
    unit_of_measurement: t.unit_of_measurement ?? undefined,
    current_progress: t.current_progress ?? undefined,
    task_logs: t.task_logs ?? [], // Inicializa como um array vazio; os logs podem ser carregados separadamente
  }));

  // Como a subcategoria agrupa tarefas, podemos pegar o tipo da primeira tarefa ou usar um padrão
  const primaryType = rawTasks[0]?.type ?? 'PROGRESSIVE';

  const descriptions: Record<string, string> = {
    PROGRESSIVE: 'Métrica Progressiva',
    BOOLEAN: 'Hábito (Consistência)',
    FINITE: 'Meta Finita',
  };

  const baseActivity = {
    id: activity.id,
    name: activity.name,
    desc: descriptions[primaryType] || 'Atividade',
    tasks,
  };

  if (primaryType === 'BOOLEAN') {
    return { ...baseActivity, done: false };
  }
  if (primaryType === 'FINITE') {
    return { ...baseActivity, progress: 0 };
  }
  return { ...baseActivity };
}

/** Operações de categorias e atividades persistidas no Supabase. */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select(`
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
        status,
        xp_reward,
        frequence,
        target_weight,
        target_repetitions,
        target_distance_km,
        target_duration_min,
        target_value,
        unit_of_measurement,
        current_progress,
        metadata,
        task_logs (
          id,
          xp_gained,
          executed_weight,
          executed_repetitions,
          executed_distance_km,
          executed_duration_min,
          current_progress,
          created_at
        )
      )
    )
  `)
    // Ordena os logs de forma decrescente pela data e limita a 1 por task
    .order('created_at', { referencedTable: 'activities.tasks.task_logs', ascending: false })
    .limit(1, { referencedTable: 'activities.tasks.task_logs' });

  if (error) throw error;

  return ((data ?? []) as CategoryRow[]).map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    level: category.level,
    activities: (category.activities ?? []).map(toActivity),
  }));
}
export async function updateCategory({ id, name, icon }: CategoryUpdate) {
  const { error } = await supabase.from('categories').update({ name, icon }).eq('id', id);

  if (error) throw error;
}