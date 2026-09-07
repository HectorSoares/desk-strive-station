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
            placeholder="Ex: Ler 10 páginas"
            placeholderTextColor={theme.midGray}
            value={title}
            onChangeText={setTitle}
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
            placeholder="Detalhes da meta..."
            placeholderTextColor={theme.midGray}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={[localStyles.label, { color: theme.midGray }]}>
            Tipo de Hábito
          </Text>
          <View style={localStyles.optionsRow}>
            {[
              { label: "Progressiva", value: "PROGRESSIVE" },
              { label: "Hábito", value: "BOOLEAN" },
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

          <Text style={[localStyles.label, { color: theme.midGray }]}>
            Recompensa XP
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
                });
                setTitle("");
                setDescription("");
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
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 12,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  optionsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  optionText: { fontSize: 13, fontWeight: "500" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 24 },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
