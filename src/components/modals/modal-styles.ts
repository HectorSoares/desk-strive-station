import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 12,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  infoBox: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    opacity: 0.65,
    lineHeight: 19,
  },
  hint: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 6,
  },
  targetBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  targetText: {
    fontSize: 11,
    opacity: 0.65,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
  },
  modeButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  modeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modeTextActive: {
    color: "#fff",
  },
  modeDescription: {
    fontSize: 11,
    opacity: 0.55,
    marginTop: 6,
  },
  btnCancel: {
    flex: 1,
    height: 44,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  btnSubmit: {
    flex: 1,
    height: 44,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});