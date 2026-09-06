import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createComponentStyles } from "@/constants/component-styles";
import { colors } from "@/constants/theme";

type Activity =
  | { id: string; name: string; type: "PROGRESSIVE"; desc: string }
  | { id: string; name: string; type: "BOOLEAN"; desc: string; done: boolean }
  | {
      id: string;
      name: string;
      type: "FINITE";
      desc: string;
      progress: number;
    };

type Category = {
  id: string;
  name: string;
  icon: string;
  level: number;
  activities: Activity[];
};

const mockedProfile = { level: 5, xpProgress: 75, streak: 12 };

const mockedCategories: Category[] = [
  {
    id: "1",
    name: "Saúde",
    icon: "🛡️",
    level: 4,
    activities: [
      {
        id: "101",
        name: "Academia",
        type: "PROGRESSIVE",
        desc: "Métrica Progressiva",
      },
      {
        id: "102",
        name: "Sem Fumar",
        type: "BOOLEAN",
        desc: "Hábito (Consistência)",
        done: true,
      },
    ],
  },
  {
    id: "2",
    name: "Estudos",
    icon: "📚",
    level: 2,
    activities: [
      {
        id: "201",
        name: "Livro: Clean Code",
        type: "FINITE",
        desc: "Meta Finita (45%)",
        progress: 45,
      },
    ],
  },
];

export default function HomeScreen() {
  const [themeName, setThemeName] = useState<"light" | "dark">("light");
  const isDark = themeName === "dark";
  const theme = colors[themeName];
  const styles = createComponentStyles(theme);

  function toggleTheme() {
    console.log("Toggling theme from", themeName);
    setThemeName((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle={!isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.canvas}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          accessibilityLabel="Alternar tema"
          accessibilityRole="button"
          accessibilityState={{ checked: isDark }}
          onPress={toggleTheme}
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
              <Text style={styles.headingSm}>Nível {mockedProfile.level}</Text>
              <Text style={styles.textBodyLg}>{mockedProfile.xpProgress}%</Text>
            </View>
            <Text style={styles.textMuted}>
              🔥 {mockedProfile.streak} dias seguidos ativos
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${mockedProfile.xpProgress}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {mockedCategories.map((category) => (
          <View key={category.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>
                {category.icon} {category.name}
              </Text>
              <View style={styles.badgeSoft}>
                <Text style={styles.badgeSoftText}>Nvl {category.level}</Text>
              </View>
            </View>

            {category.activities.map((activity, index) => (
              <View
                key={activity.id}
                style={[
                  styles.activityItem,
                  index === category.activities.length - 1 && styles.noBorder,
                ]}
              >
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>{activity.name}</Text>
                  <Text style={styles.activityDesc}>{activity.desc}</Text>
                </View>

                {activity.type === "PROGRESSIVE" && (
                  <TouchableOpacity style={styles.buttonPrimary}>
                    <Text style={styles.buttonPrimaryText}>+ Treino</Text>
                  </TouchableOpacity>
                )}
                {activity.type === "BOOLEAN" && (
                  <TouchableOpacity style={styles.buttonOutline}>
                    <Text style={styles.buttonOutlineText}>✓ Limpo</Text>
                  </TouchableOpacity>
                )}
                {activity.type === "FINITE" && (
                  <View style={styles.miniProgressBarBg}>
                    <View
                      style={[
                        styles.miniProgressBarFill,
                        { width: `${activity.progress}%` },
                      ]}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
