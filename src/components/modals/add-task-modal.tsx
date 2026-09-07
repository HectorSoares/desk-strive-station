import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { ComponentStyles } from "@/constants/component-styles";

type AddTaskModalProps = {
  visible: boolean;
  subcategoryId: string;
  theme: any;
  styles: ComponentStyles;
  loading?: boolean;
  onClose: () => void;
  onSave: (taskData: {
    title: string;
    description: string;
    type: "BOOLEAN" | "PROGRESSIVE" | "FINITE";
    xpReward: number;
    frequence?: number;
    targetWeight?: number;
    targetRepetitions?: number;
    targetDistanceKm?: number;
    targetDurationMin?: number;
    targetValue?: number;
    unitOfMeasurement?: string;
    currentProgress?: number;
  }) => void;
};

export function AddTaskModal({
  visible,
  theme,
  loading,
  onClose,
  onSave,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"BOOLEAN" | "PROGRESSIVE" | "FINITE">(
    "PROGRESSIVE",
  );
  const [xpReward, setXpReward] = useState("50");

  // Métricas específicas e genéricas
  const [targetWeight, setTargetWeight] = useState("");
  const [targetRepetitions, setTargetRepetitions] = useState("");
  const [targetDistanceKm, setTargetDistanceKm] = useState("");
  const [targetDurationMin, setTargetDurationMin] = useState("");
  const [frequence, setFrequence] = useState("1");
  const [targetValue, setTargetValue] = useState("");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
  const [currentProgress, setCurrentProgress] = useState("");

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={localStyles.modalOverlay}>
        <View
          style={[
            localStyles.modalContent,
            { backgroundColor: theme.paper, borderColor: theme.hairline },
          ]}
        >
          <Text style={[localStyles.modalTitle, { color: theme.ink }]}>
            Nova Tarefa / Meta
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 450 }}
          >
            {/* Linha 1: Título (maior) e Tipo */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 2 }}>
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
                  placeholder="Ex: Supino Reto"
                  placeholderTextColor={theme.midGray}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={{ flex: 1.2 }}>
                <Text style={[localStyles.label, { color: theme.midGray }]}>
                  Tipo
                </Text>
                <View style={localStyles.optionsRow}>
                  {[
                    { label: "Prog", value: "PROGRESSIVE" },
                    { label: "Rotina", value: "BOOLEAN" },
                    { label: "Finita", value: "FINITE" },
                  ].map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[
                        localStyles.optionButton,
                        { borderColor: theme.hairline },
                        type === t.value && { backgroundColor: theme.ink },
                      ]}
                      onPress={() => setType(t.value as any)}
                    >
                      <Text
                        style={[
                          localStyles.optionText,
                          { color: type === t.value ? theme.paper : theme.ink },
                        ]}
                      >
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 2 }}>
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
                  placeholder="Detalhes da meta..."
                  placeholderTextColor={theme.midGray}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
              <View style={{ flex: 1.2 }}>
                <Text style={[localStyles.label, { color: theme.midGray }]}>
                  Recompensa XP Base
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
                  keyboardType="numeric"
                  value={xpReward}
                  onChangeText={setXpReward}
                />
              </View>
            </View>

            {/* Bloco de 4 campos compactos por linha (Métricas) */}
            <View style={localStyles.rowInputs4}>
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
                  placeholder="Meta"
                  placeholderTextColor={theme.midGray}
                  value={targetValue}
                  onChangeText={setTargetValue}
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
                  placeholder="ex: páginas"
                  placeholderTextColor={theme.midGray}
                  value={unitOfMeasurement}
                  onChangeText={setUnitOfMeasurement}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[localStyles.labelCompact, { color: theme.midGray }]}
                >
                  Progresso
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
                  placeholder="Atual"
                  placeholderTextColor={theme.midGray}
                  value={currentProgress}
                  onChangeText={setCurrentProgress}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[localStyles.labelCompact, { color: theme.midGray }]}
                >
                  Freq/Mês
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
                  placeholder="Freq"
                  placeholderTextColor={theme.midGray}
                  value={frequence}
                  onChangeText={setFrequence}
                />
              </View>
            </View>

            {/* Linha de métricas específicas opcionais (Peso, Reps, Distância, Duração) */}
            <View style={localStyles.rowInputs4}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[localStyles.labelCompact, { color: theme.midGray }]}
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
                  placeholder="kg"
                  placeholderTextColor={theme.midGray}
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[localStyles.labelCompact, { color: theme.midGray }]}
                >
                  Reps
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
                  placeholder="reps"
                  placeholderTextColor={theme.midGray}
                  value={targetRepetitions}
                  onChangeText={setTargetRepetitions}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[localStyles.labelCompact, { color: theme.midGray }]}
                >
                  Km
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
                  placeholder="km"
                  placeholderTextColor={theme.midGray}
                  value={targetDistanceKm}
                  onChangeText={setTargetDistanceKm}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[localStyles.labelCompact, { color: theme.midGray }]}
                >
                  Min
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
                  placeholder="min"
                  placeholderTextColor={theme.midGray}
                  value={targetDurationMin}
                  onChangeText={setTargetDurationMin}
                />
              </View>
            </View>
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
                { backgroundColor: theme.ink, opacity: loading ? 0.7 : 1 },
              ]}
              onPress={() => {
                if (!title.trim()) return;
                onSave({
                  title,
                  description,
                  type,
                  xpReward: Number(xpReward) || 50,
                  frequence: frequence ? Number(frequence) : undefined,
                  targetWeight: targetWeight ? Number(targetWeight) : undefined,
                  targetRepetitions: targetRepetitions
                    ? Number(targetRepetitions)
                    : undefined,
                  targetDistanceKm: targetDistanceKm
                    ? Number(targetDistanceKm)
                    : undefined,
                  targetDurationMin: targetDurationMin
                    ? Number(targetDurationMin)
                    : undefined,
                  targetValue: targetValue ? Number(targetValue) : undefined,
                  unitOfMeasurement: unitOfMeasurement
                    ? unitOfMeasurement.trim()
                    : undefined,
                  currentProgress: currentProgress
                    ? Number(currentProgress)
                    : undefined,
                });
                setTitle("");
                setDescription("");
                setTargetWeight("");
                setTargetRepetitions("");
                setTargetDistanceKm("");
                setTargetDurationMin("");
                setTargetValue("");
                setUnitOfMeasurement("");
                setCurrentProgress("");
              }}
              disabled={loading}
            >
              <Text style={{ color: theme.paper, fontWeight: "500" }}>
                {loading ? "Salvando..." : "Adicionar"}
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
  modalTitle: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
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
  rowInputs4: {
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
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    alignItems: "center",
  },
  optionText: { fontSize: 10, fontWeight: "600" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 20 },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
