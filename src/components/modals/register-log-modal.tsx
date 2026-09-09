import { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { ComponentStyles } from "@/constants/component-styles";
import { Task, TASK_TYPES, GOAL_TYPES } from "../types/task.types";

type ProgressMode = "INCREMENT" | "ABSOLUTE";

type RegisterLogModalProps = {
  visible: boolean;
  task: Task;
  styles: ComponentStyles;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (metrics: {
    executedWeight?: number;
    executedRepetitions?: number;
    executedSets?: number;
    executedValue?: number;
    currentProgress?: number;
    progressMode?: ProgressMode;
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
  const [series, setSeries] = useState("");
  const [executedValue, setExecutedValue] = useState("");
  const [currentProgress, setCurrentProgress] = useState("");
  const [progressMode, setProgressMode] = useState<ProgressMode>("INCREMENT");

  useEffect(() => {
    if (!visible) return;

    setWeight("");
    setReps("");
    setSeries("");
    setExecutedValue("");
    setCurrentProgress("");
    setProgressMode("INCREMENT");
  }, [visible, task.id]);

  if (!visible) return null;

  const isBoolean = task.type === TASK_TYPES.BOOLEAN;
  const isQuantity = task.type === TASK_TYPES.QUANTITY;
  const isProgress = task.type === TASK_TYPES.PROGRESS;
  const isExercise = task.type === TASK_TYPES.EXERCISE;
  const isComposite = task.type === TASK_TYPES.COMPOSITE;

  const unit = task.unit_of_measurement ? ` (${task.unit_of_measurement})` : "";

  function handleSubmit() {
    onSubmit({
      executedWeight: weight ? Number(weight) : undefined,
      executedRepetitions: reps ? Number(reps) : undefined,
      executedSets: series ? Number(series) : undefined,
      executedValue: executedValue ? Number(executedValue) : undefined,
      currentProgress: currentProgress ? Number(currentProgress) : undefined,
      progressMode: isProgress ? progressMode : undefined,
    });
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={localStyles.overlay}>
        <View style={[localStyles.content, { backgroundColor: "#fff" }]}>
          <Text style={localStyles.title}>Registrar Execução</Text>
          <Text style={localStyles.subtitle}>{task.title}</Text>

          {/* BOOLEAN */}
          {isBoolean ? (
            <View style={localStyles.infoBox}>
              <Text style={localStyles.infoTitle}>Concluir tarefa</Text>
              <Text style={localStyles.infoText}>
                Confirme a execução desta tarefa para receber {task.xp_base} XP.
              </Text>
            </View>
          ) : null}

          {/* QUANTITY */}
          {isQuantity ? (
            <View>
              <Text style={localStyles.label}>Quantidade{unit}</Text>
              <TextInput
                style={localStyles.input}
                keyboardType="numeric"
                placeholder={`Ex: ${task.target_value ?? 10}`}
                value={executedValue}
                onChangeText={setExecutedValue}
              />

              {task.target_value !== undefined ? (
                <Text style={localStyles.hint}>
                  Meta: {task.target_value}
                  {unit}
                </Text>
              ) : null}
            </View>
          ) : null}

          {/* PROGRESS */}
          {isProgress ? (
            <View>
              <Text style={localStyles.label}>Registrar progresso</Text>

              <View style={localStyles.modeRow}>
                <TouchableOpacity
                  style={[
                    localStyles.modeButton,
                    progressMode === "INCREMENT" &&
                      localStyles.modeButtonActive,
                  ]}
                  onPress={() => setProgressMode("INCREMENT")}
                >
                  <Text
                    style={[
                      localStyles.modeText,
                      progressMode === "INCREMENT" &&
                        localStyles.modeTextActive,
                    ]}
                  >
                    Adicionar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    localStyles.modeButton,
                    progressMode === "ABSOLUTE" && localStyles.modeButtonActive,
                  ]}
                  onPress={() => setProgressMode("ABSOLUTE")}
                >
                  <Text
                    style={[
                      localStyles.modeText,
                      progressMode === "ABSOLUTE" && localStyles.modeTextActive,
                    ]}
                  >
                    Informar total
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={localStyles.modeDescription}>
                {progressMode === "INCREMENT"
                  ? "O valor será somado ao progresso atual."
                  : "O valor informado será o seu progresso atual."}
              </Text>

              <Text style={localStyles.label}>
                {progressMode === "INCREMENT"
                  ? `Quanto você executou${unit}`
                  : `Progresso atual${unit}`}
              </Text>

              <TextInput
                style={localStyles.input}
                keyboardType="numeric"
                placeholder={
                  progressMode === "INCREMENT"
                    ? "Ex: 10"
                    : `Ex: ${task.current_progress ?? 0}`
                }
                value={
                  progressMode === "INCREMENT" ? executedValue : currentProgress
                }
                onChangeText={
                  progressMode === "INCREMENT"
                    ? setExecutedValue
                    : setCurrentProgress
                }
              />

              {task.target_value !== undefined ? (
                <Text style={localStyles.hint}>
                  Progresso: {task.current_progress ?? 0} / {task.target_value}
                  {unit}
                </Text>
              ) : null}
            </View>
          ) : null}

          {/* EXERCISE */}
          {isExercise ? (
            <View>
              <View style={localStyles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={localStyles.label}>Peso (kg)</Text>
                  <TextInput
                    style={localStyles.input}
                    keyboardType="numeric"
                    placeholder={`Ex: ${task.target_weight ?? 10}`}
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={localStyles.label}>Repetições</Text>
                  <TextInput
                    style={localStyles.input}
                    keyboardType="numeric"
                    placeholder={`Ex: ${task.target_repetitions ?? 12}`}
                    value={reps}
                    onChangeText={setReps}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={localStyles.label}>Séries</Text>
                  <TextInput
                    style={localStyles.input}
                    keyboardType="numeric"
                    placeholder={`Ex: ${task.target_sets ?? 3}`}
                    value={series}
                    onChangeText={setSeries}
                  />
                </View>
              </View>

              <View style={localStyles.targetBox}>
                <Text style={localStyles.targetText}>
                  Meta: {task.target_weight ? `${task.target_weight}kg` : "-"} •{" "}
                  {task.target_repetitions
                    ? `${task.target_repetitions} reps`
                    : "-"}{" "}
                  • {task.target_sets ? `${task.target_sets} séries` : "-"}
                </Text>
              </View>
            </View>
          ) : null}

          {/* COMPOSITE */}
          {isComposite ? (
            <View>
              <Text style={localStyles.label}>Valor executado{unit}</Text>
              <TextInput
                style={localStyles.input}
                keyboardType="numeric"
                placeholder={`Ex: ${task.target_value ?? 1}`}
                value={executedValue}
                onChangeText={setExecutedValue}
              />

              {task.target_value !== undefined ? (
                <Text style={localStyles.hint}>
                  Meta: {task.target_value}
                  {unit}
                </Text>
              ) : null}
            </View>
          ) : null}

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
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                {loading
                  ? "Salvando..."
                  : isBoolean
                    ? "Concluir & Ganhar XP"
                    : "Registrar & Ganhar XP"}
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    opacity: 0.65,
    lineHeight: 19,
  },
  hint: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 6,
  },
  targetBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  targetText: {
    fontSize: 11,
    opacity: 0.65,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
  },
  modeButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  modeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modeTextActive: {
    color: "#fff",
  },
  modeDescription: {
    fontSize: 11,
    opacity: 0.55,
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
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
