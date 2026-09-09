export type TaskLog = {
  id: string;
  task_id: string;
  xp_gained: number;
  executed_weight?: number;
  executed_repetitions?: number;
  executed_sets?: number;
  executed_value?: number;
  current_progress?: number;
  metadata?: Record<string, any>;
  created_at: string;
};