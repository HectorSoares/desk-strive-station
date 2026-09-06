import { StyleSheet } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

type ColorPalette = (typeof colors)[keyof typeof colors];

/**
 * Estilos padrão reutilizáveis para componentes da interface.
 * Centralize aqui ajustes visuais de cards, botões, badges e tipografia.
 */
export function createComponentStyles(theme: ColorPalette) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.canvas },
    scrollContent: { padding: spacing[20], paddingBottom: 100 },
    headingSm: { fontSize: 24, fontWeight: '600', color: theme.ink, letterSpacing: -0.6 },
    textBodyLg: { fontSize: 16, fontWeight: '600', color: theme.ink },
    textMuted: { fontSize: 14, color: theme.midGray, marginBottom: spacing[8] },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, marginTop: spacing[20] },
    avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.paper, borderWidth: 1, borderColor: theme.hairline, justifyContent: 'center', alignItems: 'center', marginRight: spacing[16] },
    avatarText: { fontSize: 28 },
    profileInfo: { flex: 1 },
    levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing[4], alignItems: 'flex-end' },
    progressBarBg: { height: spacing[8], backgroundColor: theme.hairline, borderRadius: radius.button, overflow: 'hidden' },
    progressBarFill: { height: '100%', backgroundColor: theme.ink, borderRadius: radius.button },
    miniProgressBarBg: { width: 80, height: 6, backgroundColor: theme.hairline, borderRadius: radius.button },
    miniProgressBarFill: { height: '100%', backgroundColor: theme.inkSoft, borderRadius: radius.button },
    card: { backgroundColor: theme.paper, borderRadius: radius.card, padding: spacing[20], marginBottom: spacing[24], borderWidth: 1, borderColor: theme.hairline, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[16] },
    cardTitle: { color: theme.ink, fontSize: 16, fontWeight: '600', letterSpacing: -0.2 },
    badgeSoft: { backgroundColor: theme.canvas, paddingVertical: 2, paddingHorizontal: spacing[8], borderRadius: radius.badge },
    badgeSoftText: { color: theme.inkSoft, fontSize: 12, fontWeight: '500' },
    activityItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing[12], borderBottomWidth: 1, borderBottomColor: theme.canvas },
    noBorder: { borderBottomWidth: 0, paddingBottom: 0 },
    activityInfo: { flex: 1 },
    activityName: { color: theme.ink, fontSize: 14, fontWeight: '500', marginBottom: spacing[4] },
    activityDesc: { color: theme.midGray, fontSize: 12 },
    buttonPrimary: { backgroundColor: theme.ink, paddingVertical: spacing[8], paddingHorizontal: spacing[16], borderRadius: radius.button, justifyContent: 'center', alignItems: 'center' },
    buttonPrimaryText: { color: theme.paper, fontWeight: '500', fontSize: 13 },
    buttonOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.hairline, paddingVertical: spacing[8], paddingHorizontal: spacing[16], borderRadius: radius.button },
    buttonOutlineText: { color: theme.ink, fontWeight: '500', fontSize: 13 },
    themeButton: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: spacing[4], marginBottom: spacing[16], paddingVertical: spacing[8], paddingHorizontal: spacing[12], borderRadius: radius.button, backgroundColor: theme.paper, borderWidth: 1, borderColor: theme.hairline },
    themeButtonText: { color: theme.ink, fontSize: 13, fontWeight: '600' },
    fab: { position: 'absolute', bottom: spacing[24], alignSelf: 'center', width: 56, height: 56, borderRadius: 28, backgroundColor: theme.ink, justifyContent: 'center', alignItems: 'center', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' },
    fabText: { color: theme.paper, fontSize: 28, fontWeight: '400', marginTop: -2 },
  });
}

/** Estilos claros padrão para telas que ainda não oferecem troca de tema. */
export const componentStyles = createComponentStyles(colors.light);
