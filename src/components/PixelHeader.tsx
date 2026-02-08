import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { spacing, componentSpacing } from "../theme/spacing";

interface PixelHeaderProps {
  title: string;
  subtitle?: string;
}

export const PixelHeader: React.FC<PixelHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {/* Pixel-style border effect */}
      <View style={styles.pixelBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingTop: spacing.lg,
  },
  headerContent: {
    height: componentSpacing.headerHeight,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    // Pixel-style text shadow
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  pixelBorder: {
    height: 3,
    backgroundColor: colors.primary,
    marginHorizontal: spacing.md,
  },
});
