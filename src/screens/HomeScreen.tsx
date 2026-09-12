import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryCard } from "@/components/cards/category-card";
import { AddActivityModal } from "@/components/modals/add-activity-modal";
import { AddCategoryModal } from "@/components/modals/add-category-modal";
import { Category } from "@/components/types/category.type";
import { Icon, IconName } from "@/components/ui/icon";
import { createComponentStyles } from "@/constants/component-styles";
import { colors } from "@/constants/theme";
import { createActivity } from "@/repositories/activities.repository";
import {
  createCategory,
  getCategories,
} from "@/repositories/categories.repository";
import {
  getUserProfile,
  type UserProfile,
} from "@/repositories/user_profile.repository";

export default function HomeScreen() {
  const [themeName, setThemeName] = useState<"light" | "dark">("light");
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const [isAddActivityModalVisible, setIsAddActivityModalVisible] =
    useState(false);
  const [activityName, setActivityName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] =
    useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState<IconName>(
    "folder" as any,
  );

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
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const currentTotalXp = profile?.total_xp ?? 0;
  const currentLevel = profile?.level ?? 1;
  const xpIntoCurrentLevel = currentTotalXp % 1000;
  const xpProgress = Math.round((xpIntoCurrentLevel / 1000) * 100);
  const streakDays = profile?.streak_days ?? 0;

  function closeAddActivityModal() {
    setIsAddActivityModalVisible(false);
    setActivityName("");
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
      closeAddActivityModal();
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
    } finally {
      setLoading(false);
    }
  }

  function closeAddCategoryModal() {
    setIsAddCategoryModalVisible(false);
    setCategoryName("");
    setSelectedCategoryIcon("folder" as any);
  }

  async function handleAddCategory() {
    if (!categoryName.trim()) return;

    setLoading(true);
    try {
      await createCategory({
        name: categoryName.trim(),
        icon: selectedCategoryIcon,
      });
      await loadData();
      closeAddCategoryModal();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
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
          {isDark ? (
            <Icon name="sun" size={18} color={theme.yellow} />
          ) : (
            <Icon name="moon" size={18} color={theme.blue} />
          )}
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
              <Icon name="flame" size={16} color={theme.ink} /> {streakDays}{" "}
              dias seguidos ativos
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${xpProgress}%` }]}
              />
            </View>
          </View>
        </View>

        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            styles={styles}
            theme={theme}
            loading={loading}
            onRefresh={loadData}
            onAddActivity={(categoryId) => {
              setSelectedCategoryId(categoryId);
              setActivityName("");
              setIsAddActivityModalVisible(true);
            }}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setCategoryName("");
          setSelectedCategoryIcon("folder" as any);
          setIsAddCategoryModalVisible(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <AddActivityModal
        visible={isAddActivityModalVisible}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        activityName={activityName}
        theme={theme}
        loading={loading}
        onClose={closeAddActivityModal}
        onActivityNameChange={setActivityName}
        onCategoryChange={setSelectedCategoryId}
        onSubmit={handleAddActivity}
      />

      <AddCategoryModal
        visible={isAddCategoryModalVisible}
        categoryName={categoryName}
        selectedIcon={selectedCategoryIcon}
        theme={theme}
        loading={loading}
        onClose={closeAddCategoryModal}
        onCategoryNameChange={setCategoryName}
        onIconChange={setSelectedCategoryIcon}
        onSubmit={handleAddCategory}
      />
    </SafeAreaView>
  );
}
