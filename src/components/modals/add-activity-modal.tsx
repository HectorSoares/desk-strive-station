import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

import type { Category, Activity } from "@/components/cards/category-card";
import { modalStyles as styles } from "@/components/modals/modal-styles";
import type { AppColorPalette } from "@/constants/theme";

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

const activityTypes: Array<{ label: string; value: Activity["type"] }> = [
  { label: "Progressiva", value: "PROGRESSIVE" },
  { label: "Hábito", value: "BOOLEAN" },
  { label: "Finita", value: "FINITE" },
];

export function AddActivityModal({
  visible,
  categories,
  selectedCategoryId,
  activityName,
  theme,
  loading,
  onClose,
  onActivityNameChange,
  onCategoryChange,
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
          />

          <Text style={[styles.label, { color: theme.midGray }]}>
            Grupo / Categoria
          </Text>
          <View style={styles.optionsRow}>
            {categories.map((category) => {
              const selected = selectedCategoryId === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.optionButton,
                    { borderColor: theme.hairline },
                    selected && { backgroundColor: theme.ink },
                  ]}
                  onPress={() => onCategoryChange(category.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: selected ? theme.paper : theme.ink },
                    ]}
                  >
                    {category.icon} {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

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
