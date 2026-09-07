import { Task } from "./task.types";

export type Activity = {
  id: string;
  name: string;
  desc?: string;
  done?: boolean;
  progress?: number;
  tasks?: Task[];
};