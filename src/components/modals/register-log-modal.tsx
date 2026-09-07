import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { ComponentStyles } from "@/constants/component-styles";
import type { Task } from "@/components/items/task-item";

type RegisterLogModalProps = {
  visible: boolean;
  task: Task;
  styles: ComponentStyles;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (metrics: {
    executedWeight?: number;
    executedRepetitions?: number;
    executedDistanceKm?: number;
    executedDurationMin?: number;
  }) => void;
};

export function RegisterLogModal({
  visible,
  task,
  loading,
  onClose,
  onSubmit,
}: RegisterLogModalProps) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={localStyles.overlay}>
        <View style={[localStyles.content, { backgroundColor: "#fff" }]}>
          <Text style={localStyles.title}>Registrar Execução</Text>
          <Text style={localStyles.subtitle}>{task.title}</Text>

          <View style={localStyles.row}>
            <View style={{ flex: 1 }}>
              <Text style={localStyles.label}>Peso Executado (kg)</Text>
              <TextInput
                style={localStyles.input}
                keyboardType="numeric"
                placeholder="Ex: 50"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={localStyles.label}>Repetições</Text>
              <TextInput
                style={localStyles.input}
                keyboardType="numeric"
                placeholder="Ex: 12"
                value={reps}
                onChangeText={setReps}
              />
            </View>
          </View>

          <View style={localStyles.row}>
            <View style={{ flex: 1 }}>
              <Text style={localStyles.label}>Distância (km)</Text>
              <TextInput
                style={localStyles.input}
                keyboardType="numeric"
                placeholder="Ex: 5"
                value={distance}
                onChangeText={setDistance}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={localStyles.label}>Duração (min)</Text>
              <TextInput
                style={localStyles.input}
                keyboardType="numeric"
                placeholder="Ex: 30"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
          </View>

          <View style={localStyles.actions}>
            <TouchableOpacity
              style={localStyles.btnCancel}
              onPress={onClose}
              disabled={loading}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[localStyles.btnSubmit, loading && { opacity: 0.7 }]}
              onPress={() => {
                onSubmit({
                  executedWeight: weight ? Number(weight) : undefined,
                  executedRepetitions: reps ? Number(reps) : undefined,
                  executedDistanceKm: distance ? Number(distance) : undefined,
                  executedDurationMin: duration ? Number(duration) : undefined,
                });
                setWeight("");
                setReps("");
                setDistance("");
                setDuration("");
              }}
              disabled={loading}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {loading ? "Salvando..." : "Concluir & Ganhar XP"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 14, opacity: 0.6, marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  row: { flexDirection: "row", gap: 12 },
  actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  btnCancel: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  btnSubmit: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
