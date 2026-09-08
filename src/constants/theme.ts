import '@/global.css';

import { Platform } from 'react-native';

/** Tokens de design compartilhados pela aplicação. */
export const spacing = {
  4: 4, 8: 8, 12: 12, 16: 16, 20: 20, 24: 24, 48: 48,
} as const;

export const radius = {
  sm: 6,
  input: 18,
  button: 18,
  badge: 18,
  card: 24,
} as const;

export const common_colors = {
  destructive: '#e7000b', yellow: '#f7c500', green: '#10b981', blue: '#3b82f6',
  progressGradient: [
    "#ef4444", // Vermelho forte
    "#f87171", // Vermelho claro
    "#fb923c", // Laranja avermelhado
    "#f97316", // Laranja
    "#fbbf24", // Laranja amarelado
    "#facc15", // Amarelo vibrante
    "#fde047", // Amarelo claro
    "#bef264", // Lima claro
    "#a3e635", // Verdelima
    "#84cc16", // Verde lima forte
    "#4ade80", // Verde claro    
    "#22c55e", // Verde médio    
    "#16a34a", // Verde escuro
    "#10b981", // Verde esmeralda
    "#059669"  // Verde profundo (Sucesso total)
  ]
}

export const colors = {
  light: {
    ...common_colors,
    canvas: '#f5f5f5', paper: '#ffffff', ink: '#0a0a0a', inkSoft: '#171717',
    midGray: '#737373', hairline: '#e5e5e5',
  },
  dark: {
    ...common_colors,
    canvas: '#0a0a0a', paper: '#121212', ink: '#fafafa', inkSoft: '#e5e5e5',
    midGray: '#a3a3a3', hairline: '#262626'
  },
} as const;

export type AppColorPalette = (typeof colors)[keyof typeof colors];

/** API compatível com os componentes do template Expo. */
export const Colors = {
  light: {
    text: colors.light.ink,
    background: colors.light.canvas,
    backgroundElement: colors.light.paper,
    backgroundSelected: colors.light.hairline,
    textSecondary: colors.light.midGray,
  },
  dark: {
    text: colors.dark.ink,
    background: colors.dark.canvas,
    backgroundElement: colors.dark.paper,
    backgroundSelected: colors.dark.hairline,
    textSecondary: colors.dark.midGray,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: 'var(--font-display)', serif: 'var(--font-serif)', rounded: 'var(--font-rounded)', mono: 'var(--font-mono)',
  },
});

/** Espaçamentos legados do template, mantidos durante a migração. */
export const Spacing = {
  half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
