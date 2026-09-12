import { EditCategoryModal } from "@/components/modals/edit-category-modal";
import type { ComponentStyles } from "@/constants/component-styles";
import { updateCategory } from "@/repositories/categories.repository";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ActivityItem } from "../items/activity-item";
import { Category } from "../types/category.type";
import { Icon, IconName } from "../ui/icon";

type CategoryCardProps = {
  category: Category;
  styles: ComponentStyles;
  theme: any;
  loading?: boolean;
  onRefresh?: () => void;
  onAddActivity?: (categoryId: string) => void; // 👈 Adicionado para disparar o modal
};

export function CategoryCard({
  category,
  styles,
  theme,
  loading: globalLoading,
  onRefresh,
  onAddActivity,
}: CategoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
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
        {/* Cabeçalho da Categoria (Clicável para expandir/recolher) */}
        <TouchableOpacity
          style={[
            styles.cardHeader,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
          activeOpacity={0.7}
          onPress={() => setIsExpanded((current) => !current)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flex: 1,
            }}
          >
            <Icon
              name={category.icon as IconName}
              size={18}
              color={theme.ink}
            />
            <Text style={styles.cardTitle} numberOfLines={1}>
              {category.name}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={styles.badgeSoft}>
              <Text style={styles.badgeSoftText}>Nvl {category.level}</Text>
            </View>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onAddActivity?.(category.id);
              }}
              style={{
                backgroundColor: theme.canvas,
                borderColor: theme.hairline,
                borderWidth: 1,
                padding: 6,
                borderRadius: 12,
              }}
              disabled={globalLoading}
            >
              <Icon name="plus-circle" size={14} color={theme.ink} />
            </TouchableOpacity>

            {/* Botão de Editar Categoria */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // Evita acionar o colapso ao clicar no editar
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
              disabled={globalLoading}
            >
              <Icon name="edit" size={14} color={theme.ink} />
            </TouchableOpacity>

            {/* Ícone de Seta Colapsável */}
            <Icon
              name={isExpanded ? "chevron-down" : "chevron-right"}
              size={18}
              color={theme.ink}
            />
          </View>
        </TouchableOpacity>

        {/* Lista de Atividades (Aparece apenas se expandido) */}
        {isExpanded &&
          category.activities &&
          category.activities.length > 0 && (
            <View style={{ marginTop: 4 }}>
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
          )}
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
