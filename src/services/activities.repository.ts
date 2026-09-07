import type { Activity } from '@/components/cards/category-card';
import type { Task } from '@/components/items/task-item';
import { supabase } from '@/services/supabase';

type SubcategoryType = Activity['type'];

type TaskRow = {
  id: string;
  subcategory_id: string;
  title: string;
  description: string | null;
  type: 'BOOLEAN' | 'PROGRESSIVE' | 'FINITE';
  status: 'PENDING' | 'COMPLETED';
  xp_reward: number;
};

export type SubcategoryRow = {
  id: string;
  name: string;
  tasks_or_goals: TaskRow[] | null;
};

export type NewActivity = {
  categoryId: string;
  name: string;
};

export function toActivity(subcategory: SubcategoryRow): Activity {
  const rawTasks = subcategory.tasks_or_goals ?? [];

  const tasks: Task[] = rawTasks.map((t) => ({
    id: t.id,
    subcategory_id: t.subcategory_id,
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
    id: subcategory.id,
    name: subcategory.name,
    desc: descriptions[primaryType] || 'Subcategoria',
    tasks,
  };

  if (primaryType === 'BOOLEAN') {
    return { ...baseActivity, type: 'BOOLEAN', done: false };
  }
  if (primaryType === 'FINITE') {
    return { ...baseActivity, type: 'FINITE', progress: 0 };
  }
  return { ...baseActivity, type: 'PROGRESSIVE' };
}

export async function createActivity({ categoryId, name }: NewActivity) {
  const { error } = await supabase.from('subcategories').insert({
    category_id: categoryId,
    name,
  });

  if (error) throw error;
}

export async function updateActivity({ id, name }: { id: string; name: string; type?: string }) {
  const { error } = await supabase.from('subcategories').update({ name }).eq('id', id);

  if (error) throw error;
}