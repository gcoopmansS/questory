/**
 * Modal for displaying reading session rewards
 */

import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { PixelCard } from "./PixelCard";
import { PixelButton } from "./PixelButton";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

interface RewardModalProps {
  visible: boolean;
  onClose: () => void;
  gainedXP: number;
  levelBefore: number;
  levelAfter: number;
  streakBefore: number;
  streakAfter: number;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  visible,
  onClose,
  gainedXP,
  levelBefore,
  levelAfter,
  streakBefore,
  streakAfter,
}) => {
  const leveledUp = levelAfter > levelBefore;
  const streakContinued = streakAfter > streakBefore;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <PixelCard title="🎉 Session Complete!">
            <View style={styles.content}>
              <Text style={styles.xpText}>+{gainedXP} XP</Text>

              {leveledUp && (
                <View style={styles.levelUpContainer}>
                  <Text style={styles.levelUpText}>LEVEL UP!</Text>
                  <Text style={styles.levelText}>
                    {levelBefore} → {levelAfter}
                  </Text>
                </View>
              )}

              {streakContinued && (
                <View style={styles.streakContainer}>
                  <Text style={styles.streakText}>🔥 Streak continued!</Text>
                  <Text style={styles.streakCountText}>
                    {streakAfter} day{streakAfter !== 1 ? "s" : ""}
                  </Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <PixelButton title="Continue" onPress={onClose} />
              </View>
            </View>
          </PixelCard>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    maxWidth: 320,
  },
  content: {
    alignItems: "center",
  },
  xpText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: spacing.lg,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  levelUpContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  levelUpText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.accent1,
    marginBottom: spacing.xs,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  levelText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "bold",
  },
  streakContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  streakText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.success,
    marginBottom: spacing.xs,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  streakCountText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: spacing.md,
    width: "100%",
  },
});
