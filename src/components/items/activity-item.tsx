import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { ComponentStyles } from "@/constants/component-styles";
import { EditActivityModal } from "@/components/modals/edit-activity-modal";
import { AddTaskModal } from "@/components/modals/add-task-modal";
import { TaskItem, type Task } from "@/components/items/task-item";
import { updateActivity } from "@/services/activities.repository";
import { createTask } from "@/services/tasks.repository";
import { createActivityLog } from "@/services/activity-logs.repository";

export type Activity =
  | {
      id: string;
      name: string;
      type: "PROGRESSIVE";
      desc: string;
      tasks?: Task[];
    }
  | {
      id: string;
      name: string;
      type: "BOOLEAN";
      desc: string;
      done: boolean;
      tasks?: Task[];
    }
  | {
      id: string;
      name: string;
      type: "FINITE";
      desc: string;
      progress: number;
      tasks?: Task[];
    };

type ActivityItemProps = {
  activity: Activity;
  isLast: boolean;
  styles: ComponentStyles;
  theme: any;
  onRefresh?: () => void;
};

export function ActivityItem({
  activity,
  isLast,
  styles,
  theme,
  onRefresh,
}: ActivityItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSaveTask(taskData: {
    title: string;
    description: string;
    type: "BOOLEAN" | "PROGRESSIVE" | "FINITE";
    xpReward: number;
    frequence?: number;
    targetWeight?: number;
    targetReps?: number;
    targetSets?: number;
    targetDistance?: number;
    targetDuration?: number;
  }) {
    setLoading(true);
    try {
      await createTask({
        subcategoryId: activity.id,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        xpReward: taskData.xpReward,
        frequence: taskData.frequence,
        targetWeight: taskData.targetWeight,
        targetRepetitions: taskData.targetReps,
        targetDistanceKm: taskData.targetDistance,
        targetDurationMin: taskData.targetDuration,
      });
      setIsAddTaskModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteTask(taskId: string, xpReward: number) {
    try {
      await createActivityLog({
        taskId: taskId,
        xpGained: xpReward,
      });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erro ao concluir task:", error);
    }
  }

  async function handleSaveActivity(
    id: string,
    name: string,
    type: Activity["type"],
  ) {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await updateActivity({ id, name: name.trim(), type });
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erro ao atualizar subcategoria:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <View
        style={[
          styles.activityItem,
          isLast && !activity.tasks?.length && styles.noBorder,
        ]}
      >
        <TouchableOpacity
          style={[styles.activityInfo, { flex: 1 }]}
          onPress={() => setIsEditModalOpen(true)}
        >
          <Text style={styles.activityName}>{activity.name} ✏️</Text>
          <Text style={styles.activityDesc}>{activity.desc}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ padding: 8, marginRight: 8 }}
          onPress={() => setIsAddTaskModalOpen(true)}
        >
          <Text style={{ fontSize: 16 }}>➕📋</Text>
        </TouchableOpacity>
      </View>

      {/* Renderização da listagem de Tasks vinculadas a esta subcategoria */}
      {activity.tasks && activity.tasks.length > 0 && (
        <View style={{ paddingLeft: 12, paddingBottom: 8 }}>
          {activity.tasks.map((task) => (
            <TaskItem key={task.id} task={task} styles={styles} />
          ))}
        </View>
      )}

      <EditActivityModal
        visible={isEditModalOpen}
        activity={activity}
        theme={theme}
        styles={styles}
        loading={loading}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveActivity}
      />

      <AddTaskModal
        visible={isAddTaskModalOpen}
        subcategoryId={activity.id}
        theme={theme}
        styles={styles}
        loading={loading}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSave={handleSaveTask}
      />
    </>
  );
}
