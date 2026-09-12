import { modalStyles as styles } from "@/components/modals/modal-styles";
import type { AppColorPalette } from "@/constants/theme";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Category } from "../types/category.type";

type AddActivityModalProps = {
  visible: boolean;
  categories: Category[];
  selectedCategoryId: string;
  activityName: string;
  theme: AppColorPalette;
  loading: boolean;
  onClose: () => void;
  onActivityNameChange: (value: string) => void;
  onCategoryChange: (id: string) => void;
  onSubmit: () => void;
};

export function AddActivityModal({
  visible,
  activityName,
  theme,
  loading,
  onClose,
  onActivityNameChange,
  onSubmit,
}: AddActivityModalProps) {
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
            Nova Atividade
          </Text>

          <Text style={[styles.label, { color: theme.midGray }]}>
            Nome da Atividade
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
            placeholder="Ex: Leitura de Livro, Corrida..."
            placeholderTextColor={theme.midGray}
            value={activityName}
            onChangeText={onActivityNameChange}
            autoFocus
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
                {loading ? "Salvando..." : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
