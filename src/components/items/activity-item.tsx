import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons"; // 👈 Importação dos ícones
import type { ComponentStyles } from "@/constants/component-styles";
import { EditActivityModal } from "@/components/modals/edit-activity-modal";
import { AddTaskModal } from "@/components/modals/add-task-modal";
import { TaskItem } from "@/components/items/task-item";
import { updateActivity } from "@/services/activities.repository";
import { createTask } from "@/services/tasks.repository";
import { createActivityLog } from "@/services/activity-logs.repository";
import { Activity } from "../types/activity.types";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSaveTask(taskData: {
    title: string;
    description: string;
    type: "BOOLEAN" | "PROGRESSIVE" | "FINITE";
    xpReward: number;
    frequence?: number;
    targetWeight?: number;
    targetRepetitions?: number;
    targetSets?: number;
    targetDistanceKm?: number;
    targetDurationMin?: number;
    targetValue?: number;
    unitOfMeasurement?: string;
    currentProgress?: number;
  }) {
    setLoading(true);
    try {
      await createTask({
        activityId: activity.id,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        xpReward: taskData.xpReward,
        frequence: taskData.frequence,
        targetWeight: taskData.targetWeight,
        targetRepetitions: taskData.targetRepetitions,
        targetDistanceKm: taskData.targetDistanceKm,
        targetDurationMin: taskData.targetDurationMin,
        targetValue: taskData.targetValue,
        unitOfMeasurement: taskData.unitOfMeasurement,
        currentProgress: taskData.currentProgress,
        metadata: {},
      });
      setIsAddTaskModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveActivity(id: string, name: string) {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await updateActivity({ id, name: name.trim() });
      setIsEditModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <View
        style={[
          styles.activityItem,
          isLast && (!isExpanded || !activity.tasks?.length) && styles.noBorder,
        ]}
      >
        <TouchableOpacity
          style={[styles.activityInfo, { flex: 1 }]}
          onPress={() => setIsEditModalOpen(true)}
        >
          <Text style={styles.activityName}>{activity.name}</Text>
          <Text style={styles.activityDesc}>{activity.desc}</Text>
        </TouchableOpacity>

        {/* Grupo de Ações com Ícones Reais */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <TouchableOpacity
            style={{ padding: 8 }}
            onPress={() => setIsAddTaskModalOpen(true)}
          >
            <Feather name="plus-circle" size={18} color={theme.ink} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 8, marginRight: 2 }}
            onPress={() => setIsExpanded((current) => !current)}
          >
            <Feather
              name={isExpanded ? "chevron-down" : "chevron-right"}
              size={18}
              color={theme.ink}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Renderização condicional da listagem de Tasks vinculadas */}
      {isExpanded && activity.tasks && activity.tasks.length > 0 && (
        <View style={{ paddingLeft: 12, paddingBottom: 8 }}>
          {activity.tasks.map((task) => (
            <TaskItem
              theme={theme}
              key={task.id}
              task={task}
              styles={styles}
              onRefresh={onRefresh}
            />
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
        activityId={activity.id}
        theme={theme}
        styles={styles}
        loading={loading}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSave={handleSaveTask}
      />
    </>
  );
}
