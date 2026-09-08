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
import { createComponentStyles } from "@/constants/component-styles";
import { colors } from "@/constants/theme";
import { getCategories } from "@/services/categories.repository";
import { createActivity } from "@/services/activities.repository";
import {
  getUserProfile,
  type UserProfile,
} from "@/services/user_profile.repository";
import { Category } from "@/components/types/category.type";
import { Feather } from "@expo/vector-icons";

export default function HomeScreen() {
  const [themeName, setThemeName] = useState<"light" | "dark">("light");
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

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

  const currentTotalXp = profile?.total_xp ?? 0;
  const currentLevel = profile?.level ?? 1;
  const xpIntoCurrentLevel = currentTotalXp % 500;
  const xpProgress = Math.round((xpIntoCurrentLevel / 500) * 100);
  const streakDays = profile?.streak_days ?? 0;

  function closeAddModal() {
    setIsAddModalVisible(false);
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
      closeAddModal();
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
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
            <Feather name="sun" size={18} color={theme.yellow} />
          ) : (
            <Feather name="moon" size={18} color={theme.blue} />
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
              🔥 {streakDays} dias seguidos ativos
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${xpProgress}%` }]}
              />
            </View>
          </View>
        </View>

        {/* Renderiza os cards de categoria passando a função de recarregamento */}
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            styles={styles}
            theme={theme}
            loading={loading}
            onRefresh={loadData}
          />
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
    </SafeAreaView>
  );
}
