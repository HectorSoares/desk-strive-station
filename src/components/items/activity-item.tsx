import { TaskItem } from "@/components/items/task-item";
import { AddTaskModal } from "@/components/modals/add-task-modal";
import { ConfirmationModal } from "@/components/modals/confirmation-modal";
import { EditActivityModal } from "@/components/modals/edit-activity-modal";
import { SwipeToDelete } from "@/components/ui/swipe-to-delete";
import type { ComponentStyles } from "@/constants/component-styles";
import {
  deleteActivity,
  updateActivity,
} from "@/repositories/activities.repository";
import { createTask } from "@/repositories/tasks.repository";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Activity } from "../types/activity.types";
import { GoalType, Periodicity, TaskType } from "../types/task.types";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSaveTask(taskData: {
    title: string;
    description: string;
    type: TaskType;
    goalType: GoalType;
    periodicity?: Periodicity;
    xpBase: number;
    targetValue?: number;
    unitOfMeasurement?: string;
    currentProgress?: number;
    targetWeight?: number;
    targetRepetitions?: number;
    targetSets?: number;
  }) {
    setLoading(true);

    try {
      await createTask({
        activityId: activity.id,
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        goalType: taskData.goalType,
        periodicity: taskData.periodicity,
        xpBase: taskData.xpBase,
        targetValue: taskData.targetValue,
        unitOfMeasurement: taskData.unitOfMeasurement,
        currentProgress: taskData.currentProgress,
        targetWeight: taskData.targetWeight,
        targetRepetitions: taskData.targetRepetitions,
        targetSets: taskData.targetSets,
        metadata: {},
      });

      setIsAddTaskModalOpen(false);
      onRefresh?.();
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
      await updateActivity({
        id,
        name: name.trim(),
      });

      setIsEditModalOpen(false);
      onRefresh?.();
    } catch (error) {
      console.error("Erro ao atualizar atividade:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteActivity() {
    setLoading(true);

    try {
      await deleteActivity(activity.id);
      setIsDeleteModalOpen(false);
      onRefresh?.();
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SwipeToDelete
        theme={theme}
        title="Excluir atividade?"
        message={`A atividade "${activity.name}" será excluída permanentemente, junto com todas as tarefas e históricos de execução associados.`}
        onDelete={handleDeleteActivity}
      >
        <View
          style={[
            styles.activityItem,
            isLast &&
              (!isExpanded || !activity.tasks?.length) &&
              styles.noBorder,
          ]}
        >
          <TouchableOpacity
            style={[styles.activityInfo, { flex: 1 }]}
            onPress={() => setIsEditModalOpen(true)}
          >
            <Text style={styles.activityName}>{activity.name}</Text>
            <Text style={styles.activityDesc}>{activity.desc}</Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Botão de Adicionar Tarefa */}
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => setIsAddTaskModalOpen(true)}
              disabled={loading}
            >
              <Feather name="plus-circle" size={18} color={theme.ink} />
            </TouchableOpacity>

            {/* Botão de Excluir visível apenas na Web (no mobile usa o Swipe) */}
            {Platform.OS === "web" && (
              <TouchableOpacity
                style={{ padding: 8 }}
                onPress={() => setIsDeleteModalOpen(true)}
                disabled={loading}
              >
                <Feather name="trash-2" size={18} color={theme.ink} />
              </TouchableOpacity>
            )}

            {/* Botão de Expandir / Recolher */}
            <TouchableOpacity
              style={{ padding: 8, marginRight: 2 }}
              onPress={() => setIsExpanded((current) => !current)}
              disabled={loading}
            >
              <Feather
                name={isExpanded ? "chevron-down" : "chevron-right"}
                size={18}
                color={theme.ink}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SwipeToDelete>

      {/* Renderização das Tasks filhas */}
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

      {/* Modais */}
      <EditActivityModal
        visible={isEditModalOpen}
        activity={activity}
        theme={theme}
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

      <ConfirmationModal
        visible={isDeleteModalOpen}
        title="Excluir atividade?"
        message={`A atividade "${activity.name}" será excluída permanentemente, junto com todas as tarefas e históricos de execução associados.`}
        theme={theme}
        loading={loading}
        icon="trash-2"
        confirmText="Excluir"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteActivity}
      />
    </>
  );
}
