import type { AppColorPalette } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Activity } from "../types/activity.types";
import { modalStyles } from "./modal-styles";

type EditActivityModalProps = {
  visible: boolean;
  activity: Activity | null;
  theme: AppColorPalette;
  loading?: boolean;
  onClose: () => void;
  onSave: (activityId: string, newName: string) => void;
};

export function EditActivityModal({
  visible,
  activity,
  theme,
  loading,
  onClose,
  onSave,
}: EditActivityModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (activity) {
      setName(activity.name);
    }
  }, [activity]);

  if (!activity) return null;

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
            Editar Atividade
          </Text>

          <Text style={[modalStyles.label, { color: theme.midGray }]}>
            Nome da Atividade
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
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.midGray}
          />

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
              onPress={() => onSave(activity.id, name)}
              disabled={loading}
            >
              <Text style={{ color: theme.paper, fontWeight: "500" }}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
