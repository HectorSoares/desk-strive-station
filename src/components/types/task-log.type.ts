export type TaskLog = {
  id: string;
  task_id: string;
  executed_weight?: number;
  executed_distance_km?: number;
  executed_repetitions?: number;
  executed_duration_min?: number;
  executed_value?: number;
  created_at: string;
  xp_gained: number;
};