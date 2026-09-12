import { ConfirmationModal } from "@/components/modals/confirmation-modal";
import { useRef, useState } from "react";
import { Animated, PanResponder, Platform, View } from "react-native";
import { Icon } from "./icon";

type SwipeToDeleteProps = {
  children: React.ReactNode;
  theme: any;
  title?: string;
  message?: string;
  disabled?: boolean;
  onDelete: () => Promise<void> | void;
};

export function SwipeToDelete({
  children,
  theme,
  title = "Excluir?",
  message = "Este item será excluído permanentemente.",
  disabled = false,
  onDelete,
}: SwipeToDeleteProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;

  const trashOpacity = translateX.interpolate({
    inputRange: [-80, -20, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: "clamp",
  });

  const trashScale = translateX.interpolate({
    inputRange: [-80, -20, 0],
    outputRange: [1, 0.7, 0.5],
    extrapolate: "clamp",
  });

  function resetPosition() {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !disabled &&
        Math.abs(gestureState.dx) > 10 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -80) {
          Animated.timing(translateX, {
            toValue: -120,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            setIsDeleteModalOpen(true);
          });
        } else {
          resetPosition();
        }
      },

      onPanResponderTerminate: resetPosition,
    }),
  ).current;

  async function handleDelete() {
    setLoading(true);

    try {
      await onDelete();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Erro ao excluir item:", error);
    } finally {
      setLoading(false);
      resetPosition();
    }
  }

  function handleCloseModal() {
    setIsDeleteModalOpen(false);
    resetPosition();
  }

  return (
    <>
      <View
        style={{
          position: "relative",
          overflow: "hidden",
          borderTopWidth: 1,
          borderTopColor: theme.hairline,
        }}
      >
        {Platform.OS !== "web" && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              right: 20,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              opacity: trashOpacity,
              transform: [{ scale: trashScale }],
            }}
          >
            <Icon name="trash-2" size={22} color={theme.ink} />
          </Animated.View>
        )}

        <Animated.View
          {...(Platform.OS !== "web" ? panResponder.panHandlers : {})}
          style={{
            transform: [{ translateX }],
            backgroundColor: theme.background,
          }}
        >
          {children}
        </Animated.View>
      </View>

      <ConfirmationModal
        visible={isDeleteModalOpen}
        title={title}
        message={message}
        theme={theme}
        loading={loading}
        icon="trash-2"
        confirmText="Excluir"
        onClose={handleCloseModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
