import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

import { modalStyles as styles } from "@/components/modals/modal-styles";
import type { AppColorPalette } from "@/constants/theme";

type EditCategoryModalProps = {
  visible: boolean;
  name: string;
  icon: string;
  theme: AppColorPalette;
  loading: boolean;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onIconChange: (value: string) => void;
  onSubmit: () => void;
};

export function EditCategoryModal({
  visible,
  name,
  icon,
  theme,
  loading,
  onClose,
  onNameChange,
  onIconChange,
  onSubmit,
}: EditCategoryModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.content,
            { backgroundColor: theme.paper, borderColor: theme.hairline },
          ]}
        >
          <Text style={[styles.title, { color: theme.ink }]}>
            Editar Categoria
          </Text>
          <Text style={[styles.label, { color: theme.midGray }]}>
            Nome da Categoria
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.canvas,
                color: theme.ink,
                borderColor: theme.hairline,
              },
            ]}
            value={name}
            onChangeText={onNameChange}
          />
          <Text style={[styles.label, { color: theme.midGray }]}>
            Ícone (Emoji)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.canvas,
                color: theme.ink,
                borderColor: theme.hairline,
              },
            ]}
            value={icon}
            onChangeText={onIconChange}
            maxLength={2}
          />
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.canvas }]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={{ color: theme.ink, fontWeight: "500" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.ink, opacity: loading ? 0.7 : 1 },
              ]}
              onPress={onSubmit}
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
