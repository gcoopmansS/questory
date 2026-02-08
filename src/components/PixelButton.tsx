/**
 * Reusable pixel-style button component
 */

import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { spacing, componentSpacing } from "../theme/spacing";

interface PixelButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}) => {
  const buttonStyle = [
    styles.button,
    variant === "secondary" && styles.buttonSecondary,
    disabled && styles.buttonDisabled,
  ];

  const textStyle = [
    styles.text,
    variant === "secondary" && styles.textSecondary,
    disabled && styles.textDisabled,
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyle,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    height: componentSpacing.buttonHeight,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    // Pixel-style shadow effect
    shadowColor: colors.shadow,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  buttonDisabled: {
    backgroundColor: colors.textMuted,
    borderColor: colors.border,
    opacity: 0.6,
  },
  pressed: {
    transform: [{ translateY: 1 }],
    shadowOffset: { width: 1, height: 1 },
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    // Pixel-style text shadow
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  textSecondary: {
    color: colors.text,
  },
  textDisabled: {
    color: colors.textMuted,
    textShadowColor: "transparent",
  },
});
