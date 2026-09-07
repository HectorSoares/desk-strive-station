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
import type { Activity } from "../items/activity-item";

type EditActivityModalProps = {
  visible: boolean;
  activity: Activity | null;
  theme: any;
  styles: ComponentStyles;
  loading?: boolean;
  onClose: () => void;
  onSave: (
    activityId: string,
    newName: string,
    newType: "PROGRESSIVE" | "BOOLEAN" | "FINITE",
  ) => void;
};

export function EditActivityModal({
  visible,
  activity,
  theme,
  styles: _styles,
  onClose,
  onSave,
}: EditActivityModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"PROGRESSIVE" | "BOOLEAN" | "FINITE">(
    "PROGRESSIVE",
  );

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setType(activity.type);
    }
  }, [activity]);

  if (!activity) return null;

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
            Editar Atividade
          </Text>

          <Text style={[localStyles.label, { color: theme.midGray }]}>
            Nome da Atividade
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
            value={name}
            onChangeText={setName}
          />

          <Text style={[localStyles.label, { color: theme.midGray }]}>
            Tipo de Atividade
          </Text>
          <View style={localStyles.optionsRow}>
            {[
              { label: "Progressiva", value: "PROGRESSIVE" },
              { label: "Hábito", value: "BOOLEAN" },
              { label: "Finita", value: "FINITE" },
            ].map((typeObj) => (
              <TouchableOpacity
                key={typeObj.value}
                style={[
                  localStyles.optionButton,
                  { borderColor: theme.hairline },
                  type === typeObj.value && {
                    backgroundColor: theme.ink,
                  },
                ]}
                onPress={() => setType(typeObj.value as any)}
              >
                <Text
                  style={[
                    localStyles.optionText,
                    {
                      color: type === typeObj.value ? theme.paper : theme.ink,
                    },
                  ]}
                >
                  {typeObj.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={localStyles.modalActions}>
            <TouchableOpacity
              style={[localStyles.actionBtn, { backgroundColor: theme.canvas }]}
              onPress={onClose}
            >
              <Text style={{ color: theme.ink, fontWeight: "500" }}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[localStyles.actionBtn, { backgroundColor: theme.ink }]}
              onPress={() => onSave(activity.id, name, type)}
            >
              <Text style={{ color: theme.paper, fontWeight: "500" }}>
                Salvar Alterações
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
  optionsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
