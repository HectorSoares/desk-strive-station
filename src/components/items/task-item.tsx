import { Text, TouchableOpacity, View } from "react-native";
import type { ComponentStyles } from "@/constants/component-styles";

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
  onCompleteTask?: (taskId: string, xp: number) => void;
};

export function TaskItem({ task, styles, onCompleteTask }: TaskItemProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 6,
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
          <Text style={{ fontSize: 11, opacity: 0.6 }}>{task.description}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[
          styles.buttonOutline,
          { paddingVertical: 4, paddingHorizontal: 8 },
        ]}
        onPress={() =>
          onCompleteTask && onCompleteTask(task.id, task.xp_reward)
        }
      >
        <Text style={{ fontSize: 11 }}>
          {task.status === "COMPLETED" ? "Concluído" : "Executar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
