import { Activity } from '@/components/types/activity.types';
import { Task, TaskType } from '@/components/types/task.types';
import { supabase } from '@/services/supabase';

type TaskRow = {
  id: string;
  activity_id: string;
  title: string;
  description: string | null;
  type: TaskType;
  status: 'PENDING' | 'COMPLETED';
  xp_reward: number;
};

export type ActivityRow = {
  id: string;
  name: string;
  tasks: TaskRow[] | null;
};

export type NewActivity = {
  categoryId: string;
  name: string;
};

export function toActivity(activity: ActivityRow): Activity {
  const rawTasks = activity.tasks ?? [];

  const tasks: Task[] = rawTasks.map((t) => ({
    id: t.id,
    activity_id: t.activity_id,
    title: t.title,
    description: t.description ?? undefined,
    type: t.type,
    status: t.status,
    xp_reward: t.xp_reward,
  }));

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
  return { ...baseActivity, };
}

export async function createActivity({ categoryId, name }: NewActivity) {
  const { error } = await supabase.from('activities').insert({
    category_id: categoryId,
    name,
  });

  if (error) throw error;
}

export async function updateActivity({ id, name }: { id: string; name: string; type?: string }) {
  const { error } = await supabase.from('activities').update({ name }).eq('id', id);

  if (error) throw error;
}