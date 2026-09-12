import { TaskLog } from "./task-log.type";

export const TASK_TYPES = {
  BOOLEAN: "BOOLEAN",
  QUANTITY: "QUANTITY",
  PROGRESS: "PROGRESS",
  EXERCISE: "EXERCISE",
  COMPOSITE: "COMPOSITE",
} as const;

export type TaskType = typeof TASK_TYPES[keyof typeof TASK_TYPES];

export const GOAL_TYPES = {
  HABIT: "HABIT",
  FINITE: "FINITE",
} as const;

export type GoalType = typeof GOAL_TYPES[keyof typeof GOAL_TYPES];

export const PERIODICITIES = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type Periodicity = typeof PERIODICITIES[keyof typeof PERIODICITIES];

export const STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
} as const;

export type Status = typeof STATUS[keyof typeof STATUS];

export type Task = {
  id: string;
  activity_id: string;
  title: string;
  description?: string;
  type: TaskType;
  goal_type: GoalType;
  periodicity?: Periodicity;
  status: Status;
  xp_base: number;
  frequency_quantity: number;
  target_weight?: number;
  target_repetitions?: number;
  target_sets?: number;
  target_value?: number;
  unit_of_measurement?: string;
  current_progress?: number;
  metadata?: Record<string, any>;
  task_logs?: TaskLog[];
};

export type CreateTaskDTO = {
  activityId: string;
  title: string;
  description?: string;
  type: TaskType;
  goalType: GoalType;
  periodicity?: Periodicity;
  frequencyQuantity?: number;
  xpBase?: number;
  targetValue?: number;
  unitOfMeasurement?: string;
  currentProgress?: number;
  targetWeight?: number;
  targetRepetitions?: number;
  targetSets?: number;
  metadata?: Record<string, any>;
};

