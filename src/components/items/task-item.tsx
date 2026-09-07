import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { ComponentStyles } from "@/constants/component-styles";
import { RegisterLogModal } from "@/components/modals/register-log-modal";
import { registerActivityLog } from "@/services/activity-logs.repository";

export type Task = {
  id: string;
  subcategory_id: string;
  title: string;
  description?: string;
  type: "BOOLEAN" | "PROGRESSIVE" | "FINITE";
  status: "PENDING" | "COMPLETED";
  xp_reward: number;
};

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

export function TaskItem({ task, styles, theme, onRefresh }: TaskItemProps) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const taskDetails = getTaskTypeDetails(task.type);

  async function handleRegisterLog(metrics: {
    executedWeight?: number;
    executedRepetitions?: number;
    executedDistanceKm?: number;
    executedDurationMin?: number;
  }) {
    setLoading(true);
    try {
      await registerActivityLog({
        taskId: task.id,
        executedWeight: metrics.executedWeight,
        executedRepetitions: metrics.executedRepetitions,
        executedDistanceKm: metrics.executedDistanceKm,
        executedDurationMin: metrics.executedDurationMin,
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
              justifyContent: "space-between",
            }}
          >
            {task.description ? (
              <Text style={styles.taskDesc}>{task.description}</Text>
            ) : null}
            <Text style={styles.taskTag}>+{task.xp_reward} XP</Text>
          </View>
        </View>

        {/* Botão para registrar métricas reais via RPC */}
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
          <Text style={{ fontSize: 11, fontWeight: "600", color: theme.ink }}>
            ⚡ Registrar
          </Text>
        </TouchableOpacity>
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
