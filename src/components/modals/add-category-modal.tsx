import { modalStyles as styles } from "@/components/modals/modal-styles";
import type { AppColorPalette } from "@/constants/theme";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { categoryIcons, Icon, IconName } from "../ui/icon";

type AddCategoryModalProps = {
  visible: boolean;
  categoryName: string;
  selectedIcon: IconName;
  theme: AppColorPalette;
  loading: boolean;
  onClose: () => void;
  onCategoryNameChange: (value: string) => void;
  onIconChange: (icon: IconName) => void;
  onSubmit: () => void;
};

export function AddCategoryModal({
  visible,
  categoryName,
  selectedIcon,
  theme,
  loading,
  onClose,
  onCategoryNameChange,
  onIconChange,
  onSubmit,
}: AddCategoryModalProps) {
  const availableIcons = Object.keys(categoryIcons) as IconName[];

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
            {
              backgroundColor: theme.paper,
              borderColor: theme.hairline,
              maxHeight: "80%",
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.ink }]}>
            Nova Categoria
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
            placeholder="Ex: Saúde, Estudos, Trabalho..."
            placeholderTextColor={theme.midGray}
            value={categoryName}
            onChangeText={onCategoryNameChange}
            autoFocus
          />

          <Text style={[styles.label, { color: theme.midGray, marginTop: 12 }]}>
            Escolha um Ícone
          </Text>

          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              paddingVertical: 4,
            }}
            style={{ maxHeight: 160 }}
          >
            {availableIcons.map((iconKey) => {
              const isSelected = selectedIcon === iconKey;
              return (
                <TouchableOpacity
                  key={iconKey}
                  onPress={() => onIconChange(iconKey)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? theme.ink : theme.canvas,
                    borderWidth: 1,
                    borderColor: isSelected ? theme.ink : theme.hairline,
                  }}
                >
                  <Icon
                    name={iconKey}
                    size={20}
                    color={isSelected ? theme.paper : theme.ink}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={[styles.actions, { marginTop: 16 }]}>
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
                {loading ? "Salvando..." : "Criar Categoria"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
