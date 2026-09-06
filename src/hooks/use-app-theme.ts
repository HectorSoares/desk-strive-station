import { useColorScheme } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: isDark ? colors.dark : colors.light,
    radius,
    spacing,
  };
}