import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PixelHeader } from "../components/PixelHeader";
import { PixelCard } from "../components/PixelCard";
import { PixelButton } from "../components/PixelButton";
import { RewardModal } from "../components/RewardModal";
import { colors } from "../theme/colors";
import { spacing, screenPadding, componentSpacing } from "../theme/spacing";
import { loadPlayerStats } from "../features/player/state";
import { logCurrentPage } from "../features/reading/actions";
import { loadUserBooks } from "../features/books/storage";
import { demoBooks } from "../features/books/demoData";
import type { RootStackParamList } from "../app/types";
import type { PlayerStats } from "../features/player/models";
import type { UserBook } from "../features/books/models";

interface ReadingScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "MainTabs">;
}

export const ReadingScreen: React.FC<ReadingScreenProps> = ({ navigation }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [userBook, setUserBook] = useState<UserBook | null>(null);
  const [currentPageInput, setCurrentPageInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [lastResult, setLastResult] = useState<{
    gainedXP: number;
    levelBefore: number;
    levelAfter: number;
    streakBefore: number;
    streakAfter: number;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [stats, userBooks] = await Promise.all([
      loadPlayerStats(),
      loadUserBooks(),
    ]);

    // Find most recently updated book with shelf 'READING'
    const readingBooks = userBooks.filter((book) => book.shelf === "READING");
    const currentBook =
      readingBooks.length > 0
        ? readingBooks.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )[0]
        : null;

    setPlayerStats(stats);
    setUserBook(currentBook);
  };

  const getValidationHint = (): string => {
    if (!currentPageInput.trim()) {
      return "Enter your current page to earn XP.";
    }
    const parsedPage = parseInt(currentPageInput, 10);
    if (isNaN(parsedPage) || parsedPage < 0) {
      return "Page must be 0 or greater.";
    }
    return "";
  };

  const handleSubmitReading = async () => {
    if (!userBook || !playerStats) return;

    const parsedPage = parseInt(currentPageInput, 10);
    if (isNaN(parsedPage) || parsedPage < 0) return;

    setIsSubmitting(true);

    try {
      const prevStats = playerStats;

      const result = await logCurrentPage({
        bookId: userBook.book.id,
        newPage: parsedPage,
      });

      // Update local state
      setUserBook(result.updatedBook);
      setPlayerStats(result.stats);

      // Show reward modal if XP was gained
      if (result.pagesRead > 0) {
        setLastResult({
          gainedXP: result.stats.totalXP - prevStats.totalXP,
          levelBefore: prevStats.level,
          levelAfter: result.stats.level,
          streakBefore: prevStats.streakCount,
          streakAfter: result.stats.streakCount,
        });
        setShowRewardModal(true);
      }

      // Clear input on success
      setCurrentPageInput("");
    } catch (error) {
      console.error("Failed to submit reading session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFirstBook = () => {
    navigation.navigate("Discover");
  };

  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
    setLastResult(null);
  };

  if (!playerStats) {
    return (
      <SafeAreaView style={styles.container}>
        <PixelHeader title="Reading" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state if no books are being read
  if (!userBook) {
    return (
      <SafeAreaView style={styles.container}>
        <PixelHeader title="Reading" />
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <PixelCard title="Today">
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{playerStats.totalXP}</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{playerStats.level}</Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{playerStats.streakCount}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
            </View>
          </PixelCard>

          <PixelCard title="No books to read">
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                You don't have any books marked as "Reading" yet.
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Add a book to your reading shelf to start earning XP!
              </Text>
              <View style={styles.buttonContainer}>
                <PixelButton
                  title="Add your first book"
                  onPress={handleAddFirstBook}
                  variant="primary"
                />
              </View>
            </View>
          </PixelCard>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PixelHeader title="Reading" />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <PixelCard title="Today">
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{playerStats.totalXP}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{playerStats.level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{playerStats.streakCount}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </PixelCard>

        <PixelCard title="Continue reading">
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{userBook.book.title}</Text>
            <Text style={styles.lastSavedText}>
              Last saved page: {userBook.currentPage}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current page *</Text>
            <TextInput
              style={styles.textInput}
              value={currentPageInput}
              onChangeText={setCurrentPageInput}
              placeholder="Enter current page..."
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
            {getValidationHint() && (
              <Text style={styles.validationHint}>{getValidationHint()}</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <PixelButton
              title="Claim XP"
              onPress={handleSubmitReading}
              disabled={isSubmitting || !currentPageInput.trim()}
            />
          </View>
        </PixelCard>
      </ScrollView>

      {lastResult && (
        <RewardModal
          visible={showRewardModal}
          onClose={handleCloseRewardModal}
          gainedXP={lastResult.gainedXP}
          levelBefore={lastResult.levelBefore}
          levelAfter={lastResult.levelAfter}
          streakBefore={lastResult.streakBefore}
          streakAfter={lastResult.streakAfter}
        />
      )}
    </SafeAreaView>
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
    paddingBottom: screenPadding.vertical,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: spacing.xs,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    height: componentSpacing.buttonHeight,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  validationHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  bookInfo: {
    marginBottom: spacing.lg,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lastSavedText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
});
