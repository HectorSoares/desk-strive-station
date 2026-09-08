import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { ComponentStyles } from "@/constants/component-styles";
import { RegisterLogModal } from "@/components/modals/register-log-modal";
import { registerActivityLog } from "@/services/activity-logs.repository";
import { Task } from "../types/task.types";
import { Feather } from "@expo/vector-icons";
import { getColorByPercentage } from "@/utils/color.utils";

type TaskItemProps = {
  task: Task;
  styles: ComponentStyles;
  theme: any;
  onRefresh?: () => void;
};

// Helper para definir o ícone e o texto da tag baseado no tipo da task
function getTaskTypeDetails(type: Task["type"]) {
  switch (type) {
    case "PROGRESSIVE":
      return { icon: "📈", label: "Progressivo", badgeColor: "#3b82f6" }; // Azul
    case "FINITE":
      return { icon: "⏱️", label: "Tempo", badgeColor: "#10b981" }; // Verde
    case "BOOLEAN":
    default:
      return { icon: "🔄", label: "Check", badgeColor: "#8b5cf6" }; // Roxo
  }
}

// Helper simples para formatar a data do último log (Ex: "Há 2 dias" ou data legível)
function formatLastUpdate(dateString?: string) {
  if (!dateString) return "Nenhuma execução";
  const date = new Date(dateString);
  return `Últ. alt.: ${date.toLocaleDateString()} às ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function TaskItem({ task, styles, theme, onRefresh }: TaskItemProps) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const taskDetails = getTaskTypeDetails(task.type);
  console.log("TaskItem renderizado com task:", task);
  // Validação e cálculo para a barra de progresso de tarefas finitas
  const isFiniteWithTarget =
    task.type === "FINITE" &&
    task.target_value !== undefined &&
    task.target_value > 0;

  const currentProg = task.current_progress ?? 0;
  const targetVal = task.target_value ?? 1;
  const unit = task.unit_of_measurement ?? "";
  const progressPercentage = isFiniteWithTarget
    ? Math.min(Math.round((currentProg / targetVal) * 100), 100)
    : 0;

  // Informações extras para tarefas progressivas
  const progressiveDetails =
    task.type === "PROGRESSIVE"
      ? [
          task.target_weight ? `${task.target_weight}kg` : null,
          task.target_repetitions ? `${task.target_repetitions} reps` : null,
          task.target_distance_km ? `${task.target_distance_km} km` : null,
          task.target_duration_min ? `${task.target_duration_min} min` : null,
        ]
          .filter(Boolean)
          .join(" • ")
      : null;

  const currentProgressDetails =
    task.type === "PROGRESSIVE" && task?.task_logs?.length
      ? [
          task?.task_logs?.[0]?.executed_weight
            ? `${task.task_logs[0].executed_weight}kg`
            : null,
          task?.task_logs?.[0]?.executed_repetitions
            ? `${task.task_logs[0].executed_repetitions} reps`
            : null,
          task?.task_logs?.[0]?.executed_distance_km
            ? `${task.task_logs[0].executed_distance_km} km`
            : null,
          task?.task_logs?.[0]?.executed_duration_min
            ? `${task.task_logs[0].executed_duration_min} min`
            : null,
        ]
          .filter(Boolean)
          .join(" • ")
      : null;

  async function handleRegisterLog(metrics: {
    executedWeight?: number;
    executedRepetitions?: number;
    executedDistanceKm?: number;
    executedDurationMin?: number;
    executedSets?: number;
    currentProgress?: number;
  }) {
    setLoading(true);
    try {
      await registerActivityLog({
        taskId: task.id,
        executedWeight: metrics.executedWeight,
        executedRepetitions: metrics.executedRepetitions,
        executedDistanceKm: metrics.executedDistanceKm,
        executedDurationMin: metrics.executedDurationMin,
        executedSets: metrics.executedSets,
        currentProgress: metrics.currentProgress,
      });

      setIsLogModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erro ao registrar log da task:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingLeft: 16,
          paddingRight: 8,
          borderTopWidth: 1,
          borderTopColor: theme.hairline,
        }}
      >
        <View style={{ flex: 1, paddingRight: 8 }}>
          <View
            style={{
              flex: 1,
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
                marginBottom: 2,
              }}
            >
              <Text style={styles.taskName}>
                {taskDetails.icon} {task.title}
              </Text>
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
                  backgroundColor: getColorByPercentage(
                    progressPercentage,
                    theme.progressGradient,
                  ),
                  borderWidth: 1,
                  borderColor: theme.inkSoft,
                }}
              />
              <Text style={styles.taskTag}>+{task.xp_reward} XP</Text>
              <TouchableOpacity
                style={[
                  styles.buttonOutline,
                  {
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderColor: theme.hairline,
                  },
                ]}
                onPress={() => setIsLogModalOpen(true)}
              >
                <Feather name="zap" size={18} color={theme.yellow} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: isFiniteWithTarget ? 6 : 0,
            }}
          >
            {task.description ? (
              <Text style={styles.taskDesc}>{task.description}</Text>
            ) : null}
          </View>

          {/* Se for progressiva, exibe os valores das métricas */}
          {task.type === "PROGRESSIVE" && progressiveDetails ? (
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
                  Metas: {progressiveDetails}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: theme.ink,
                    opacity: 0.7,
                    marginBottom: 4,
                  }}
                >
                  Ult.: {currentProgressDetails}
                </Text>
              </View>
              {/* Informação da última alteração baseada no último task_log */}
              <Text style={styles.infoDesc}>
                {formatLastUpdate(task.task_logs?.[0]?.created_at)}
              </Text>
            </View>
          ) : null}

          {/* Barra de progresso para FINITE com target_value */}
          {isFiniteWithTarget ? (
            <View style={{ marginTop: 2 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <Text style={styles.infoDesc}>
                  Prog: {currentProg} / {targetVal} ({unit})
                </Text>
                <Text
                  style={{ fontSize: 10, fontWeight: "700", color: theme.ink }}
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
            </View>
          ) : null}
        </View>
      </View>

      <RegisterLogModal
        visible={isLogModalOpen}
        task={task}
        styles={styles}
        loading={loading}
        onClose={() => setIsLogModalOpen(false)}
        onSubmit={handleRegisterLog}
      />
    </>
  );
}
