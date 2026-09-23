import { RegisterLogModal } from "@/components/modals/register-log-modal";
import { ConfirmationModal } from "@/components/modals/confirmation-modal";
import { SwipeToDelete } from "@/components/ui/swipe-to-delete";
import type { ComponentStyles } from "@/constants/component-styles";
import { EditTaskModal } from "@/components/modals/edit-task-modal";
import { registerTaskLog } from "@/repositories/task-logs.repository";
import { deleteTask, updateTask } from "@/repositories/tasks.repository";
import { getColorByPercentage } from "@/utils/color.utils";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import {
  GOAL_TYPES,
  PERIODICITIES,
  Periodicity,
  Task,
  TASK_TYPES,
} from "../types/task.types";
import { Icon } from "../ui/icon";

type TaskItemProps = {
  task: Task;
  styles: ComponentStyles;
  theme: any;
  onRefresh?: () => void;
};

const TASK_TYPE_DETAILS: Record<Task["type"], { icon: any; label: string }> = {
  [TASK_TYPES.BOOLEAN]: { icon: "check-circle", label: "Check" },
  [TASK_TYPES.PROGRESS]: { icon: "trending-up", label: "Progresso" },
  [TASK_TYPES.EXERCISE]: { icon: "activity", label: "Exercício" },
  [TASK_TYPES.COMPOSITE]: { icon: "layers", label: "Composta" },
};

const PERIOD_DAYS = 30;

function formatLastUpdate(dateString?: string) {
  if (!dateString) return "Nenhuma execução";

  const date = new Date(dateString);

  return `Últ. alt.: ${date.toLocaleDateString()} às ${date.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  )}`;
}

function getPeriodicityLabel(periodicity?: Task["periodicity"]) {
  switch (periodicity) {
    case PERIODICITIES.DAILY:
      return "Diário";
    case PERIODICITIES.WEEKLY:
      return "Semanal";
    case PERIODICITIES.MONTHLY:
      return "Mensal";
    case PERIODICITIES.YEARLY:
      return "Anual";
    default:
      return null;
  }
}

export function TaskItem({ task, styles, theme, onRefresh }: TaskItemProps) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const taskDetails = TASK_TYPE_DETAILS[task.type];
  const latestLog = task.task_logs?.[0];

  const currentProg = task.current_progress ?? 0;
  const targetVal = task.target_value ?? 0;
  const unit = task.unit_of_measurement ?? "";

  const isProgressTask = task.type === TASK_TYPES.PROGRESS && targetVal > 0;
  const isHabitTask = task.goal_type === GOAL_TYPES.HABIT;

  const progressPercentage = isProgressTask
    ? Math.min(Math.round((currentProg / targetVal) * 100), 100)
    : 0;

  function getExpectedOccurrences(
    periodicity: Periodicity,
    frequencyQuantity: number,
    days: number = PERIOD_DAYS,
  ) {
    switch (periodicity) {
      case "DAILY":
        return frequencyQuantity * days;
      case "WEEKLY":
        return frequencyQuantity * (days / 7);
      case "MONTHLY":
        return frequencyQuantity * (days / 30);
      default:
        return 0;
    }
  }

  function getHabitLevel(
    logsCount: number,
    periodicity: Periodicity,
    frequencyQuantity: number,
  ) {
    const expected = getExpectedOccurrences(
      periodicity,
      frequencyQuantity,
      PERIOD_DAYS,
    );

    if (expected <= 0) return 0;

    return Math.min(14, Math.round((logsCount / expected) * 14));
  }

  function getDefaultLevel(): number {
    const createdAt = new Date(task.created_at);
    const now = new Date();
    console.log(createdAt, now);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return 14 - Math.min(14, Math.max(0, Math.floor(diffDays / 2)));
  }

  function getStatusColor(): string {
    if (isProgressTask)
      return getColorByPercentage(progressPercentage, theme.progressGradient);

    if (isHabitTask) {
      return theme.progressGradient[
        getHabitLevel(
          task.task_logs?.length || 0,
          task.periodicity!,
          task.frequency_quantity,
        )
      ];
    }

    return theme.progressGradient[getDefaultLevel()];
  }

  const exerciseTargetDetails =
    task.type === TASK_TYPES.EXERCISE
      ? [
          task.target_weight ? `${task.target_weight}kg` : null,
          task.target_repetitions ? `${task.target_repetitions} reps` : null,
          task.target_sets ? `${task.target_sets} séries` : null,
        ]
          .filter(Boolean)
          .join(" • ")
      : null;

  const exerciseCurrentDetails =
    task.type === TASK_TYPES.EXERCISE && latestLog
      ? [
          latestLog.executed_weight ? `${latestLog.executed_weight}kg` : null,
          latestLog.executed_repetitions
            ? `${latestLog.executed_repetitions} reps`
            : null,
          latestLog.executed_sets ? `${latestLog.executed_sets} séries` : null,
        ]
          .filter(Boolean)
          .join(" • ")
      : null;

  async function handleRegisterLog(metrics: {
    executedWeight?: number;
    executedRepetitions?: number;
    executedSets?: number;
    executedValue?: number;
    currentProgress?: number;
    progressMode?: "INCREMENT" | "ABSOLUTE";
  }) {
    setLoading(true);

    try {
      await registerTaskLog({
        taskId: task.id,
        executedWeight: metrics.executedWeight,
        executedRepetitions: metrics.executedRepetitions,
        executedSets: metrics.executedSets,
        executedValue: metrics.executedValue,
        currentProgress: metrics.currentProgress,
        progressMode: metrics.progressMode,
      });

      setIsLogModalOpen(false);
      onRefresh?.();
    } catch (error) {
      console.error("Erro ao registrar log da task:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask() {
    setLoading(true);

    try {
      await deleteTask(task.id);
      setIsDeleteModalOpen(false);
      onRefresh?.();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditTask(taskData: {
    title: string;
    description: string;
    type: Task["type"];
    goalType: Task["goal_type"];
    periodicity?: Task["periodicity"];
    xpBase: number;
    frequencyQuantity?: number;
    targetValue?: number;
    unitOfMeasurement?: string;
    targetWeight?: number;
    targetRepetitions?: number;
    targetSets?: number;
  }) {
    setLoading(true);

    try {
      await updateTask(task.id, taskData);
      setIsEditModalOpen(false);
      onRefresh?.();
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    } finally {
      setLoading(false);
    }
  }

  const periodicityLabel = getPeriodicityLabel(task.periodicity);

  return (
    <>
      <SwipeToDelete
        theme={theme}
        title="Excluir tarefa?"
        message={`A tarefa "${task.title}" será excluída permanentemente, junto com seu histórico de execuções.`}
        onDelete={handleDeleteTask}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            paddingLeft: 6,
            paddingRight: 8,
            backgroundColor: theme.background,
          }}
        >
          <View style={{ flex: 1, paddingRight: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  flex: 1,
                  paddingRight: 8,
                }}
              >
                <Icon name={taskDetails.icon} size={15} color={theme.ink} />

                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setIsEditModalOpen(true)}
                  disabled={loading}
                >
                  <Text style={styles.taskName} numberOfLines={1}>
                    {task.title}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 6,
                    backgroundColor: getStatusColor(),
                    borderWidth: 1,
                    borderColor: theme.inkSoft,
                  }}
                />

                <Text style={styles.taskTag}>+{task.xp_base} XP</Text>

                <TouchableOpacity
                  style={[
                    styles.buttonOutline,
                    {
                      paddingVertical: 6,
                      paddingHorizontal: 8,
                      borderColor: theme.hairline,
                    },
                  ]}
                  onPress={() => setIsLogModalOpen(true)}
                  disabled={loading}
                >
                  <Icon name="zap" size={14} color={theme.yellow} />
                </TouchableOpacity>

                {Platform.OS === "web" && (
                  <TouchableOpacity
                    style={[
                      styles.buttonOutline,
                      {
                        paddingVertical: 6,
                        paddingHorizontal: 8,
                        borderColor: theme.hairline,
                      },
                    ]}
                    onPress={() => setIsDeleteModalOpen(true)}
                    disabled={loading}
                  >
                    <Icon name="trash-2" size={14} color={theme.ink} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: isProgressTask ? 6 : 0,
              }}
            >
              {task.description ? (
                <Text style={styles.taskDesc}>{task.description}</Text>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <Text style={styles.infoDesc}>{taskDetails.label}</Text>

              {task.goal_type === GOAL_TYPES.HABIT && periodicityLabel ? (
                <Text style={styles.infoDesc}>• {periodicityLabel}</Text>
              ) : task.goal_type === GOAL_TYPES.FINITE ? (
                <Text style={styles.infoDesc}>• Finita</Text>
              ) : null}
            </View>

            {task.type === TASK_TYPES.EXERCISE && exerciseTargetDetails ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: theme.ink,
                      opacity: 0.7,
                      marginBottom: 4,
                    }}
                  >
                    Meta: {exerciseTargetDetails}
                  </Text>

                  {exerciseCurrentDetails ? (
                    <Text
                      style={{
                        fontSize: 11,
                        color: theme.ink,
                        opacity: 0.7,
                        marginBottom: 4,
                      }}
                    >
                      Últ.: {exerciseCurrentDetails}
                    </Text>
                  ) : null}
                </View>

                <Text style={styles.infoDesc}>
                  {formatLastUpdate(latestLog?.created_at)}
                </Text>
              </View>
            ) : null}

            {isProgressTask ? (
              <View style={{ marginTop: 2 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <Text style={styles.infoDesc}>
                    Prog: {currentProg} / {targetVal} {unit}
                  </Text>

                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: theme.ink,
                    }}
                  >
                    {progressPercentage}%
                  </Text>
                </View>

                <View
                  style={{
                    height: 4,
                    backgroundColor: theme.hairline,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${progressPercentage}%`,
                      backgroundColor: theme.ink,
                    }}
                  />
                </View>

                {latestLog ? (
                  <Text style={styles.infoDesc}>
                    {formatLastUpdate(latestLog.created_at)}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      </SwipeToDelete>

      <EditTaskModal
        visible={isEditModalOpen}
        task={task}
        theme={theme}
        styles={styles}
        loading={loading}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditTask}
      />

      <RegisterLogModal
        visible={isLogModalOpen}
        task={task}
        theme={theme}
        loading={loading}
        onClose={() => setIsLogModalOpen(false)}
        onSubmit={handleRegisterLog}
      />

      <ConfirmationModal
        visible={isDeleteModalOpen}
        title="Excluir tarefa?"
        message={`A tarefa "${task.title}" será excluída permanentemente, junto com seu histórico de execuções.`}
        theme={theme}
        loading={loading}
        icon="trash-2"
        confirmText="Excluir"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
      />
    </>
  );
}
