import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Icon, IconName } from "../ui/icon";

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  theme: any;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  icon?: IconName;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmationModal({
  visible,
  title,
  message,
  theme,
  loading = false,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  icon = "alert-triangle",
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={loading ? undefined : onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 420,
            backgroundColor: theme.canvas,
            borderRadius: 20,
            padding: 24,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.hairline,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Icon name={icon} size={22} color={theme.ink} />
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: theme.ink,
              marginBottom: 8,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: theme.ink,
              opacity: 0.65,
              marginBottom: 24,
            }}
          >
            {message}
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                backgroundColor: theme.hairline,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme.ink,
                  fontWeight: "600",
                }}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 12,
                backgroundColor: theme.ink,
                justifyContent: "center",
                alignItems: "center",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: theme.canvas,
                  fontWeight: "600",
                }}
              >
                {loading ? "Excluindo..." : confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
