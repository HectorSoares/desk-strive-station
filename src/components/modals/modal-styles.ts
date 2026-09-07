import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  content: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 24, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  label: { fontSize: 12, textTransform: 'uppercase', marginBottom: 8, marginTop: 12, fontWeight: '600' },
  input: { height: 48, borderRadius: 18, borderWidth: 1, paddingHorizontal: 16, fontSize: 14 },
  optionsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  optionButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1 },
  optionText: { fontSize: 13, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  actionButton: { flex: 1, height: 44, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});
