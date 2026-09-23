import type { ComponentStyles } from "@/constants/component-styles";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GOAL_TYPES,
  PERIODICITIES,
  TASK_TYPES,
  GoalType,
  Periodicity,
  Task,
  TaskType,
} from "../types/task.types";

type EditTaskModalProps = {
  visible: boolean;
  task: Task;
  theme: any;
  styles: ComponentStyles;
  loading?: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description: string;
    type: TaskType;
    goalType: GoalType;
    periodicity?: Periodicity;
    xpBase: number;
    frequencyQuantity?: number;
    targetValue?: number;
    unitOfMeasurement?: string;
    targetWeight?: number;
    targetRepetitions?: number;
    targetSets?: number;
  }) => void;
};

export function EditTaskModal({
  visible,
  task,
  theme,
  loading,
  onClose,
  onSave,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TaskType>(TASK_TYPES.BOOLEAN);
  const [goalType, setGoalType] = useState<GoalType>(GOAL_TYPES.HABIT);
  const [periodicity, setPeriodicity] = useState<Periodicity>(
    PERIODICITIES.DAILY,
  );
  const [xpBase, setXpBase] = useState("1");
  const [frequencyQuantity, setFrequencyQuantity] = useState("1");
  const [targetValue, setTargetValue] = useState("");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [targetRepetitions, setTargetRepetitions] = useState("");
  const [targetSets, setTargetSets] = useState("");

  useEffect(() => {
    if (!visible) return;

    setTitle(task.title ?? "");
    setDescription(task.description ?? "");
    setType(task.type);
    setGoalType(task.goal_type);
    setPeriodicity(task.periodicity ?? PERIODICITIES.DAILY);
    setXpBase(String(task.xp_base ?? 1));
    setFrequencyQuantity(String(task.frequency_quantity ?? 1));
    setTargetValue(task.target_value != null ? String(task.target_value) : "");
    setUnitOfMeasurement(task.unit_of_measurement ?? "");
    setTargetWeight(
      task.target_weight != null ? String(task.target_weight) : "",
    );
    setTargetRepetitions(
      task.target_repetitions != null ? String(task.target_repetitions) : "",
    );
    setTargetSets(task.target_sets != null ? String(task.target_sets) : "");
  }, [visible, task.id]);

  const isBoolean = type === TASK_TYPES.BOOLEAN;
  const isProgress = type === TASK_TYPES.PROGRESS;
  const isExercise = type === TASK_TYPES.EXERCISE;

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      type,
      goalType,
      periodicity: goalType === GOAL_TYPES.HABIT ? periodicity : undefined,
      xpBase: Number(xpBase) || 1,
      frequencyQuantity:
        goalType === GOAL_TYPES.HABIT
          ? Number(frequencyQuantity) || 1
          : undefined,
      targetValue:
        !isBoolean && !isExercise && targetValue
          ? Number(targetValue)
          : undefined,
      unitOfMeasurement:
        !isBoolean && !isExercise && unitOfMeasurement.trim()
          ? unitOfMeasurement.trim()
          : undefined,
      targetWeight:
        isExercise && targetWeight ? Number(targetWeight) : undefined,
      targetRepetitions:
        isExercise && targetRepetitions ? Number(targetRepetitions) : undefined,
      targetSets: isExercise && targetSets ? Number(targetSets) : undefined,
    });
  };

  const selectType = (value: TaskType) => {
    setType(value);

    if (value === TASK_TYPES.BOOLEAN) {
      setGoalType(GOAL_TYPES.HABIT);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={localStyles.modalOverlay}>
        <View
          style={[
            localStyles.modalContent,
            {
              backgroundColor: theme.paper,
              borderColor: theme.hairline,
            },
          ]}
        >
          <Text style={[localStyles.modalTitle, { color: theme.ink }]}>
            Editar Tarefa / Meta
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 520 }}
          >
            <Text style={[localStyles.label, { color: theme.midGray }]}>
              Título
            </Text>

            <TextInput
              style={[
                localStyles.input,
                {
                  backgroundColor: theme.canvas,
                  color: theme.ink,
                  borderColor: theme.hairline,
                },
              ]}
              placeholder="Ex: Ler 20 páginas"
              placeholderTextColor={theme.midGray}
              value={title}
              onChangeText={setTitle}
              editable={!loading}
            />

            <Text style={[localStyles.label, { color: theme.midGray }]}>
              Descrição (Opcional)
            </Text>

            <TextInput
              style={[
                localStyles.input,
                {
                  backgroundColor: theme.canvas,
                  color: theme.ink,
                  borderColor: theme.hairline,
                },
              ]}
              placeholder="Detalhes da tarefa..."
              placeholderTextColor={theme.midGray}
              value={description}
              onChangeText={setDescription}
              editable={!loading}
            />

            <Text style={[localStyles.label, { color: theme.midGray }]}>
              Tipo de Medição
            </Text>

            <View style={localStyles.optionsRow}>
              {[
                { label: "Simples", value: TASK_TYPES.BOOLEAN },
                { label: "Progresso", value: TASK_TYPES.PROGRESS },
                { label: "Exercício", value: TASK_TYPES.EXERCISE },
              ].map((item) => {
                const selected = type === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      localStyles.optionButton,
                      { borderColor: theme.hairline },
                      selected && { backgroundColor: theme.ink },
                    ]}
                    onPress={() => selectType(item.value)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        localStyles.optionText,
                        {
                          color: selected ? theme.paper : theme.ink,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[localStyles.label, { color: theme.midGray }]}>
              Objetivo
            </Text>

            <View style={localStyles.optionsRow}>
              {[
                { label: "Hábito", value: GOAL_TYPES.HABIT },
                { label: "Finita", value: GOAL_TYPES.FINITE },
              ].map((item) => {
                const selected = goalType === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      localStyles.optionButton,
                      { borderColor: theme.hairline },
                      selected && { backgroundColor: theme.ink },
                    ]}
                    onPress={() => setGoalType(item.value)}
                    disabled={loading || isBoolean}
                  >
                    <Text
                      style={[
                        localStyles.optionText,
                        {
                          color: selected ? theme.paper : theme.ink,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {goalType === GOAL_TYPES.HABIT && (
              <>
                <Text style={[localStyles.label, { color: theme.midGray }]}>
                  Periodicidade
                </Text>

                <View style={localStyles.optionsRow}>
                  {[
                    { label: "Diária", value: PERIODICITIES.DAILY },
                    { label: "Semanal", value: PERIODICITIES.WEEKLY },
                    { label: "Mensal", value: PERIODICITIES.MONTHLY },
                    { label: "Anual", value: PERIODICITIES.YEARLY },
                  ].map((item) => {
                    const selected = periodicity === item.value;

                    return (
                      <TouchableOpacity
                        key={item.value}
                        style={[
                          localStyles.optionButton,
                          { borderColor: theme.hairline },
                          selected && { backgroundColor: theme.ink },
                        ]}
                        onPress={() => setPeriodicity(item.value)}
                        disabled={loading}
                      >
                        <Text
                          style={[
                            localStyles.optionText,
                            {
                              color: selected ? theme.paper : theme.ink,
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={localStyles.rowInputs}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        localStyles.labelCompact,
                        { color: theme.midGray },
                      ]}
                    >
                      Meta de execuções no período
                    </Text>

                    <TextInput
                      style={[
                        localStyles.inputCompact,
                        {
                          backgroundColor: theme.canvas,
                          color: theme.ink,
                          borderColor: theme.hairline,
                        },
                      ]}
                      keyboardType="numeric"
                      value={frequencyQuantity}
                      onChangeText={setFrequencyQuantity}
                      editable={!loading}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        localStyles.labelCompact,
                        { color: theme.midGray },
                      ]}
                    >
                      XP Base
                    </Text>

                    <TextInput
                      style={[
                        localStyles.inputCompact,
                        {
                          backgroundColor: theme.canvas,
                          color: theme.ink,
                          borderColor: theme.hairline,
                        },
                      ]}
                      keyboardType="numeric"
                      value={xpBase}
                      onChangeText={setXpBase}
                      editable={!loading}
                    />
                  </View>
                </View>
              </>
            )}

            {isProgress && (
              <View style={localStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[localStyles.labelCompact, { color: theme.midGray }]}
                  >
                    Meta
                  </Text>

                  <TextInput
                    style={[
                      localStyles.inputCompact,
                      {
                        backgroundColor: theme.canvas,
                        color: theme.ink,
                        borderColor: theme.hairline,
                      },
                    ]}
                    keyboardType="numeric"
                    value={targetValue}
                    onChangeText={setTargetValue}
                    editable={!loading}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={[localStyles.labelCompact, { color: theme.midGray }]}
                  >
                    Unidade
                  </Text>

                  <TextInput
                    style={[
                      localStyles.inputCompact,
                      {
                        backgroundColor: theme.canvas,
                        color: theme.ink,
                        borderColor: theme.hairline,
                      },
                    ]}
                    value={unitOfMeasurement}
                    onChangeText={setUnitOfMeasurement}
                    editable={!loading}
                  />
                </View>
              </View>
            )}

            {isExercise && (
              <>
                <Text style={[localStyles.sectionTitle, { color: theme.ink }]}>
                  Meta do exercício
                </Text>

                <View style={localStyles.rowInputs3}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        localStyles.labelCompact,
                        { color: theme.midGray },
                      ]}
                    >
                      Peso (kg)
                    </Text>

                    <TextInput
                      style={[
                        localStyles.inputCompact,
                        {
                          backgroundColor: theme.canvas,
                          color: theme.ink,
                          borderColor: theme.hairline,
                        },
                      ]}
                      keyboardType="numeric"
                      value={targetWeight}
                      onChangeText={setTargetWeight}
                      editable={!loading}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        localStyles.labelCompact,
                        { color: theme.midGray },
                      ]}
                    >
                      Repetições
                    </Text>

                    <TextInput
                      style={[
                        localStyles.inputCompact,
                        {
                          backgroundColor: theme.canvas,
                          color: theme.ink,
                          borderColor: theme.hairline,
                        },
                      ]}
                      keyboardType="numeric"
                      value={targetRepetitions}
                      onChangeText={setTargetRepetitions}
                      editable={!loading}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        localStyles.labelCompact,
                        { color: theme.midGray },
                      ]}
                    >
                      Séries
                    </Text>

                    <TextInput
                      style={[
                        localStyles.inputCompact,
                        {
                          backgroundColor: theme.canvas,
                          color: theme.ink,
                          borderColor: theme.hairline,
                        },
                      ]}
                      keyboardType="numeric"
                      value={targetSets}
                      onChangeText={setTargetSets}
                      editable={!loading}
                    />
                  </View>
                </View>
              </>
            )}

            {isBoolean && (
              <View
                style={[
                  localStyles.infoBox,
                  {
                    backgroundColor: theme.canvas,
                    borderColor: theme.hairline,
                  },
                ]}
              >
                <Text style={{ color: theme.midGray, fontSize: 12 }}>
                  Esta tarefa será concluída simplesmente ao ser marcada como
                  realizada. A recompensa de XP será fixa.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={localStyles.modalActions}>
            <TouchableOpacity
              style={[localStyles.actionBtn, { backgroundColor: theme.canvas }]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={{ color: theme.ink, fontWeight: "500" }}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                localStyles.actionBtn,
                {
                  backgroundColor: theme.ink,
                  opacity: loading ? 0.7 : 1,
                },
              ]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={{ color: theme.paper, fontWeight: "500" }}>
                {loading ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "600",
  },
  labelCompact: {
    fontSize: 9,
    textTransform: "uppercase",
    marginBottom: 4,
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 13,
  },
  inputCompact: {
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 11,
    textAlign: "center",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 6,
  },
  rowInputs3: {
    flexDirection: "row",
    gap: 6,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-between",
    marginTop: 2,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    alignItems: "center",
  },
  optionText: {
    fontSize: 9,
    fontWeight: "600",
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
