import type { Activity, Category } from '@/components/cards/category-card';
import type { Task } from '@/components/task-item';
import { supabase } from '@/services/supabase';

type TaskRow = {
  id: string;
  subcategory_id: string;
  title: string;
  description: string | null;
  type: 'BOOLEAN' | 'PROGRESSIVE' | 'FINITE';
  status: 'PENDING' | 'COMPLETED';
  xp_reward: number;
};

type SubcategoryRow = {
  id: string;
  name: string;
  tasks_or_goals: TaskRow[] | null;
};

type CategoryRow = {
  id: string;
  name: string;
  icon: string;
  level: number;
  subcategories: SubcategoryRow[] | null;
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
function toActivity(subcategory: SubcategoryRow): Activity {
  const rawTasks = subcategory.tasks_or_goals ?? [];

  // Transforma as tarefas do banco para o formato do componente TaskItem
  const tasks: Task[] = rawTasks.map((t) => ({
    id: t.id,
    subcategory_id: t.subcategory_id,
    title: t.title,
    description: t.description ?? undefined,
    type: t.type,
    status: t.status,
    xp_reward: t.xp_reward,
  }));

  // Como a subcategoria agrupa tarefas, podemos pegar o tipo da primeira tarefa ou usar um padrão
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

/** Operações de categorias e atividades persistidas no Supabase. */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select(`
    id,
    name,
    icon,
    level,
    subcategories (
      id,
      name,
      tasks_or_goals (
        id,
        subcategory_id,
        title,
        description,
        type,
        status,
        xp_reward
      )
    )
  `);

  if (error) throw error;

  return ((data ?? []) as CategoryRow[]).map((category) => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    level: category.level,
    activities: (category.subcategories ?? []).map(toActivity),
  }));
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

export async function updateCategory({ id, name, icon }: CategoryUpdate) {
  const { error } = await supabase.from('categories').update({ name, icon }).eq('id', id);

  if (error) throw error;
}