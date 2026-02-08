import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { PixelHeader } from "../components/PixelHeader";
import { colors } from "../theme/colors";
import { spacing, screenPadding } from "../theme/spacing";

export const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <PixelHeader title="PROFILE" subtitle="Your adventure stats" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.playerName}>Reading Warrior</Text>
          <Text style={styles.playerLevel}>Level 1 Adventurer</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Achievements</Text>
          <View style={styles.achievementRow}>
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={styles.achievementText}>First Steps</Text>
            </View>
            <View style={[styles.achievement, styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>🔒</Text>
              <Text style={styles.achievementText}>Book Lover</Text>
            </View>
            <View style={[styles.achievement, styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>🔒</Text>
              <Text style={styles.achievementText}>Speed Reader</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: screenPadding.horizontal,
    paddingTop: screenPadding.vertical,
  },
  profileCard: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: colors.primaryDark,
  },
  avatarText: {
    fontSize: 32,
  },
  playerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  playerLevel: {
    fontSize: 14,
    color: colors.secondary,
  },
  statsCard: {
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  achievementRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  achievement: {
    alignItems: "center",
    opacity: 1,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  achievementText: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
