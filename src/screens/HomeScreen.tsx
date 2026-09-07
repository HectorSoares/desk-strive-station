import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryCard, type Category } from "@/components/cards/category-card";
import { AddActivityModal } from "@/components/modals/add-activity-modal";
import { EditCategoryModal } from "@/components/modals/edit-category-modal";
import { createComponentStyles } from "@/constants/component-styles";
import { colors } from "@/constants/theme";
import {
  getCategories,
  updateCategory,
} from "@/services/categories.repository";
import { createActivity } from "@/services/activities.repository";
import {
  getUserProfile,
  type UserProfile,
} from "@/services/user_profile.repository";

export default function HomeScreen() {
  const [themeName, setThemeName] = useState<"light" | "dark">("light");
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryIcon, setEditCategoryIcon] = useState("");

  const isDark = themeName === "dark";
  const theme = colors[themeName];
  const styles = createComponentStyles(theme);

  async function loadData() {
    try {
      const [nextCategories, nextProfile] = await Promise.all([
        getCategories(),
        getUserProfile(),
      ]);

      setCategories(nextCategories);
      if (nextProfile) {
        setProfile(nextProfile);
      }

      setSelectedCategoryId(
        (currentId) => currentId || nextCategories[0]?.id || "",
      );
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  // Calcula a porcentagem de progresso de XP para o nível atual (a cada 500 XP)
  const currentTotalXp = profile?.total_xp ?? 0;
  const currentLevel = profile?.level ?? 1;
  const xpIntoCurrentLevel = currentTotalXp % 500;
  const xpProgress = Math.round((xpIntoCurrentLevel / 500) * 100);
  const streakDays = profile?.streak_days ?? 0;

  function closeAddModal() {
    setIsAddModalVisible(false);
    setActivityName("");
  }

  function openEditCategory(category: Category) {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryIcon(category.icon);
  }

  function closeEditModal() {
    setEditingCategory(null);
    setEditCategoryName("");
    setEditCategoryIcon("");
  }

  async function handleAddActivity() {
    if (!activityName.trim() || !selectedCategoryId) return;

    setLoading(true);
    try {
      await createActivity({
        categoryId: selectedCategoryId,
        name: activityName.trim(),
      });
      await loadData();
      closeAddModal();
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateCategory() {
    if (!editingCategory || !editCategoryName.trim()) return;

    setLoading(true);
    try {
      await updateCategory({
        id: editingCategory.id,
        name: editCategoryName.trim(),
        icon: editCategoryIcon.trim() || "📁",
      });
      await loadData();
      closeEditModal();
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.canvas}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          accessibilityLabel="Alternar tema"
          accessibilityRole="button"
          accessibilityState={{ checked: isDark }}
          onPress={() =>
            setThemeName((currentTheme) =>
              currentTheme === "light" ? "dark" : "light",
            )
          }
          style={({ pressed }) => [
            styles.themeButton,
            pressed && { opacity: 0.7 },
          ]}
          testID="theme-toggle"
        >
          <Text style={styles.themeButtonText}>{isDark ? "☀️" : "🌙"}</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.levelRow}>
              <Text style={styles.headingSm}>Nível {currentLevel}</Text>
              <Text style={styles.textBodyLg}>{xpProgress}%</Text>
            </View>
            <Text style={styles.textMuted}>
              🔥 {streakDays} dias seguidos ativos
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${xpProgress}%` }]}
              />
            </View>
          </View>
        </View>

        {categories.map((category) => (
          <View key={category.id} style={localStyles.categoryWrapper}>
            <CategoryCard category={category} styles={styles} theme={theme} />
            <TouchableOpacity
              style={[
                localStyles.editCategoryButton,
                { backgroundColor: theme.canvas, borderColor: theme.hairline },
              ]}
              onPress={() => openEditCategory(category)}
            >
              <Text style={{ fontSize: 12, color: theme.ink }}>⚙️ Editar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <AddActivityModal
        visible={isAddModalVisible}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        activityName={activityName}
        theme={theme}
        loading={loading}
        onClose={closeAddModal}
        onActivityNameChange={setActivityName}
        onCategoryChange={setSelectedCategoryId}
        onSubmit={handleAddActivity}
      />
      <EditCategoryModal
        visible={editingCategory !== null}
        name={editCategoryName}
        icon={editCategoryIcon}
        theme={theme}
        loading={loading}
        onClose={closeEditModal}
        onNameChange={setEditCategoryName}
        onIconChange={setEditCategoryIcon}
        onSubmit={handleUpdateCategory}
      />
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  categoryWrapper: { position: "relative" },
  editCategoryButton: {
    position: "absolute",
    top: 16,
    right: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    zIndex: 10,
  },
});
