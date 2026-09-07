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
  onRefresh?: () => void;
};

export function TaskItem({ task, styles, onRefresh }: TaskItemProps) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegisterLog(metrics: {
    executedWeight?: number;
    executedRepetitions?: number;
    executedDistanceKm?: number;
    executedDurationMin?: number;
  }) {
    setLoading(true);
    try {
      // Chama a função RPC do Supabase que criamos na migration
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
          paddingVertical: 8,
          paddingLeft: 16,
          paddingRight: 8,
          borderTopWidth: 1,
          borderTopColor: "rgba(0,0,0,0.05)",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "500" }}>
            📌 {task.title} (+{task.xp_reward} XP)
          </Text>
          {task.description ? (
            <Text style={{ fontSize: 11, opacity: 0.6 }}>
              {task.description}
            </Text>
          ) : null}
        </View>

        {/* Botão que abre o modal para registrar o log com as métricas reais */}
        <TouchableOpacity
          style={[
            styles.buttonOutline,
            { paddingVertical: 4, paddingHorizontal: 10 },
          ]}
          onPress={() => setIsLogModalOpen(true)}
        >
          <Text style={{ fontSize: 11, fontWeight: "600" }}>⚡ Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttonOutline,
            { paddingVertical: 4, paddingHorizontal: 10 },
          ]}
          onPress={() => setIsLogModalOpen(true)}
        >
          <Text style={{ fontSize: 11, fontWeight: "600" }}> Executar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para preencher peso, reps, km ou tempo antes de salvar o log */}
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
