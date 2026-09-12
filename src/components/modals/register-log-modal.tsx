import type { AppColorPalette } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Task, TASK_TYPES } from "../types/task.types";
import { modalStyles } from "./modal-styles";

type ProgressMode = "INCREMENT" | "ABSOLUTE";

type RegisterLogModalProps = {
  visible: boolean;
  task: Task;
  theme: AppColorPalette;
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
  theme,
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
      <View style={modalStyles.overlay}>
        <View
          style={[
            modalStyles.content,
            {
              backgroundColor: theme.paper,
              borderColor: theme.hairline,
            },
          ]}
        >
          <Text style={[modalStyles.title, { color: theme.ink }]}>
            Registrar Execução
          </Text>

          <Text style={[modalStyles.subtitle, { color: theme.midGray }]}>
            {task.title}
          </Text>

          {isBoolean ? (
            <View style={modalStyles.infoBox}>
              <Text style={[modalStyles.infoTitle, { color: theme.ink }]}>
                Concluir tarefa
              </Text>

              <Text style={[modalStyles.infoText, { color: theme.midGray }]}>
                Confirme a execução desta tarefa para receber {task.xp_base} XP.
              </Text>
            </View>
          ) : null}

          {isQuantity ? (
            <View>
              <Text style={[modalStyles.label, { color: theme.midGray }]}>
                Quantidade{unit}
              </Text>

              <TextInput
                style={[
                  modalStyles.input,
                  {
                    backgroundColor: theme.canvas,
                    color: theme.ink,
                    borderColor: theme.hairline,
                  },
                ]}
                keyboardType="numeric"
                placeholder={`Ex: ${task.target_value ?? 10}`}
                placeholderTextColor={theme.midGray}
                value={executedValue}
                onChangeText={setExecutedValue}
              />

              {task.target_value !== undefined ? (
                <Text style={[modalStyles.hint, { color: theme.midGray }]}>
                  Meta: {task.target_value}
                  {unit}
                </Text>
              ) : null}
            </View>
          ) : null}

          {isProgress ? (
            <View>
              <Text style={[modalStyles.label, { color: theme.midGray }]}>
                Registrar progresso
              </Text>

              <View style={modalStyles.modeRow}>
                <TouchableOpacity
                  style={[
                    modalStyles.modeButton,
                    { borderColor: theme.hairline },
                    progressMode === "INCREMENT" && {
                      backgroundColor: theme.ink,
                      borderColor: theme.ink,
                    },
                  ]}
                  onPress={() => setProgressMode("INCREMENT")}
                >
                  <Text
                    style={[
                      modalStyles.modeText,
                      { color: theme.ink },
                      progressMode === "INCREMENT" && {
                        color: theme.paper,
                      },
                    ]}
                  >
                    Adicionar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    modalStyles.modeButton,
                    { borderColor: theme.hairline },
                    progressMode === "ABSOLUTE" && {
                      backgroundColor: theme.ink,
                      borderColor: theme.ink,
                    },
                  ]}
                  onPress={() => setProgressMode("ABSOLUTE")}
                >
                  <Text
                    style={[
                      modalStyles.modeText,
                      { color: theme.ink },
                      progressMode === "ABSOLUTE" && {
                        color: theme.paper,
                      },
                    ]}
                  >
                    Informar total
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={[modalStyles.modeDescription, { color: theme.midGray }]}
              >
                {progressMode === "INCREMENT"
                  ? "O valor será somado ao progresso atual."
                  : "O valor informado será o seu progresso atual."}
              </Text>

              <Text style={[modalStyles.label, { color: theme.midGray }]}>
                {progressMode === "INCREMENT"
                  ? `Quanto você executou${unit}`
                  : `Progresso atual${unit}`}
              </Text>

              <TextInput
                style={[
                  modalStyles.input,
                  {
                    backgroundColor: theme.canvas,
                    color: theme.ink,
                    borderColor: theme.hairline,
                  },
                ]}
                keyboardType="numeric"
                placeholder={
                  progressMode === "INCREMENT"
                    ? "Ex: 10"
                    : `Ex: ${task.current_progress ?? 0}`
                }
                placeholderTextColor={theme.midGray}
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
                <Text style={[modalStyles.hint, { color: theme.midGray }]}>
                  Progresso: {task.current_progress ?? 0} / {task.target_value}
                  {unit}
                </Text>
              ) : null}
            </View>
          ) : null}

          {isExercise ? (
            <View>
              <View style={modalStyles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={[modalStyles.label, { color: theme.midGray }]}>
                    Peso (kg)
                  </Text>

                  <TextInput
                    style={[
                      modalStyles.input,
                      {
                        backgroundColor: theme.canvas,
                        color: theme.ink,
                        borderColor: theme.hairline,
                      },
                    ]}
                    keyboardType="numeric"
                    placeholder={`Ex: ${task.target_weight ?? 10}`}
                    placeholderTextColor={theme.midGray}
                    value={weight}
                    onChangeText={setWeight}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[modalStyles.label, { color: theme.midGray }]}>
                    Repetições
                  </Text>

                  <TextInput
                    style={[
                      modalStyles.input,
                      {
                        backgroundColor: theme.canvas,
                        color: theme.ink,
                        borderColor: theme.hairline,
                      },
                    ]}
                    keyboardType="numeric"
                    placeholder={`Ex: ${task.target_repetitions ?? 12}`}
                    placeholderTextColor={theme.midGray}
                    value={reps}
                    onChangeText={setReps}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[modalStyles.label, { color: theme.midGray }]}>
                    Séries
                  </Text>

                  <TextInput
                    style={[
                      modalStyles.input,
                      {
                        backgroundColor: theme.canvas,
                        color: theme.ink,
                        borderColor: theme.hairline,
                      },
                    ]}
                    keyboardType="numeric"
                    placeholder={`Ex: ${task.target_sets ?? 3}`}
                    placeholderTextColor={theme.midGray}
                    value={series}
                    onChangeText={setSeries}
                  />
                </View>
              </View>

              <View
                style={[
                  modalStyles.targetBox,
                  { backgroundColor: theme.canvas },
                ]}
              >
                <Text
                  style={[modalStyles.targetText, { color: theme.midGray }]}
                >
                  Meta: {task.target_weight ? `${task.target_weight}kg` : "-"} •{" "}
                  {task.target_repetitions
                    ? `${task.target_repetitions} reps`
                    : "-"}{" "}
                  • {task.target_sets ? `${task.target_sets} séries` : "-"}
                </Text>
              </View>
            </View>
          ) : null}

          {isComposite ? (
            <View>
              <Text style={[modalStyles.label, { color: theme.midGray }]}>
                Valor executado{unit}
              </Text>

              <TextInput
                style={[
                  modalStyles.input,
                  {
                    backgroundColor: theme.canvas,
                    color: theme.ink,
                    borderColor: theme.hairline,
                  },
                ]}
                keyboardType="numeric"
                placeholder={`Ex: ${task.target_value ?? 1}`}
                placeholderTextColor={theme.midGray}
                value={executedValue}
                onChangeText={setExecutedValue}
              />

              {task.target_value !== undefined ? (
                <Text style={[modalStyles.hint, { color: theme.midGray }]}>
                  Meta: {task.target_value}
                  {unit}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View style={modalStyles.actions}>
            <TouchableOpacity
              style={[
                modalStyles.actionButton,
                { backgroundColor: theme.canvas },
              ]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={{ color: theme.ink, fontWeight: "500" }}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                modalStyles.actionButton,
                {
                  backgroundColor: theme.ink,
                  opacity: loading ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={{ color: theme.paper, fontWeight: "500" }}>
                {loading ? "Salvando..." : isBoolean ? "Concluir" : "Registrar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
