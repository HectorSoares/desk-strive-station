import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { ComponentStyles } from "@/constants/component-styles";
import { ActivityItem } from "../items/activity-item";
import { Category } from "../types/category.type";
import { EditCategoryModal } from "@/components/modals/edit-category-modal";
import { updateCategory } from "@/repositories/categories.repository";

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
        icon: editIcon.trim() || "folder",
      });
      setIsEditing(false);
      onRefresh?.();
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather
              name={category.icon as keyof typeof Feather.glyphMap}
              size={18}
              color={theme.ink}
            />
            <Text style={styles.cardTitle}>{category.name}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={styles.badgeSoft}>
              <Text style={styles.badgeSoftText}>Nvl {category.level}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setEditName(category.name);
                setEditIcon(category.icon);
                setIsEditing(true);
              }}
              style={{
                backgroundColor: theme.canvas,
                borderColor: theme.hairline,
                borderWidth: 1,
                padding: 6,
                borderRadius: 12,
              }}
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
