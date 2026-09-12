import { Activity } from "./activity.types";

export type Category = {
  id: string;
  name: string;
  icon: string;
  level: number;
  activities: Activity[];
};

export type CreateCategoryDTO = {
  name: string;
  icon: string;
};