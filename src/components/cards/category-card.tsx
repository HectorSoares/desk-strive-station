import { Text, TouchableOpacity, View } from "react-native";
import type { ComponentStyles } from "@/constants/component-styles";
import { ActivityItem } from "../items/activity-item";
import { Category } from "../types/category.type";

type CategoryCardProps = {
  category: Category;
  styles: ComponentStyles;
  theme: any; // 👈 Adicionado aqui
  onEditCategory?: (category: Category) => void;
};

export function CategoryCard({
  category,
  styles,
  theme, // 👈 Recebido aqui
  onEditCategory,
}: CategoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {category.icon} {category.name}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={styles.badgeSoft}>
            <Text style={styles.badgeSoftText}>Nvl {category.level}</Text>
          </View>

          {onEditCategory && (
            <TouchableOpacity
              onPress={() => onEditCategory(category)}
              style={{ padding: 4 }}
            >
              <Text style={{ fontSize: 14 }}>⚙️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {category.activities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isLast={index === category.activities.length - 1}
          styles={styles}
          theme={theme} // 👈 Repassado corretamente para o item
        />
      ))}
    </View>
  );
}
