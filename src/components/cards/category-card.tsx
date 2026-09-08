import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { ComponentStyles } from "@/constants/component-styles";
import { ActivityItem } from "../items/activity-item";
import { Category } from "../types/category.type";
import { EditCategoryModal } from "@/components/modals/edit-category-modal";
import { updateCategory } from "@/services/categories.repository";

type CategoryCardProps = {
  category: Category;
  styles: ComponentStyles;
  theme: any;
  loading?: boolean;
  onRefresh?: () => void;
};

export function CategoryCard({
  category,
  styles,
  theme,
  loading: globalLoading,
  onRefresh,
}: CategoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [editIcon, setEditIcon] = useState(category.icon);
  const [loading, setLoading] = useState(false);

  async function handleUpdateCategory() {
    if (!editName.trim()) return;

    setLoading(true);
    try {
      await updateCategory({
        id: category.id,
        name: editName.trim(),
        icon: editIcon.trim() || "📁",
      });
      setIsEditing(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <View style={[styles.card, { position: "relative" }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {category.icon} {category.name}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={styles.badgeSoft}>
              <Text style={styles.badgeSoftText}>Nvl {category.level}</Text>
            </View>

            {/* Botão de editar categoria integrado no card */}
            <TouchableOpacity
              onPress={() => {
                setEditName(category.name);
                setEditIcon(category.icon);
                setIsEditing(true);
              }}
              style={[
                {
                  backgroundColor: theme.canvas,
                  borderColor: theme.hairline,
                  borderWidth: 1,
                  padding: 6,
                  borderRadius: 12,
                },
              ]}
            >
              <Feather name="edit" size={14} color={theme.ink} />
            </TouchableOpacity>
          </View>
        </View>

        {category.activities.map((activity, index) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isLast={index === category.activities.length - 1}
            styles={styles}
            theme={theme}
            onRefresh={onRefresh}
          />
        ))}
      </View>

      {/* Modal de Edição isolado no card */}
      <EditCategoryModal
        visible={isEditing}
        name={editName}
        icon={editIcon}
        theme={theme}
        loading={loading}
        onClose={() => setIsEditing(false)}
        onNameChange={setEditName}
        onIconChange={setEditIcon}
        onSubmit={handleUpdateCategory}
      />
    </>
  );
}
