import { TaskLog } from "./task-log.type";

export enum TaskType {
  BOOLEAN = "BOOLEAN",
  PROGRESSIVE = "PROGRESSIVE",
  FINITE = "FINITE",
}

export type Task = {
  id: string;
  activity_id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: "PENDING" | "COMPLETED";
  xp_reward: number;
  frequence?: number;
  target_weight?: number;
  target_repetitions?: number;
  target_distance_km?: number;
  target_duration_min?: number;
  target_value?: number;
  unit_of_measurement?: string;
  current_progress?: number;
  task_logs?: TaskLog[];
};

export type CreateTaskDTO = {
  activityId: string;
  title: string;
  description?: string;
  type: TaskType;
  xpReward: number;
  frequence?: number;
  targetWeight?: number;
  targetRepetitions?: number;
  targetDistanceKm?: number;
  targetDurationMin?: number;
  targetValue?: number;
  unitOfMeasurement?: string;
  currentProgress?: number;
};

