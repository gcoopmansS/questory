/**
 * Book detail screen with add to shelf actions
 */

import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { PixelHeader } from "../components/PixelHeader";
import { PixelButton } from "../components/PixelButton";
import { demoBooks } from "../features/books/demoData";
import { upsertUserBook } from "../features/books/storage";
import { colors } from "../theme/colors";
import { spacing, screenPadding } from "../theme/spacing";
import type { RootStackScreenProps } from "../app/types";
import type { UserBook } from "../features/books/models";

type Props = RootStackScreenProps<"BookDetail">;

export const BookDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const book = demoBooks.find((b) => b.id === bookId);

  if (!book) {
    return (
      <SafeAreaView style={styles.container}>
        <PixelHeader title="Book Not Found" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Book not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToWant = async () => {
    setIsLoading(true);
    try {
      const userBook: UserBook = {
        book,
        shelf: "WANT",
        currentPage: 0,
        updatedAt: new Date().toISOString(),
      };

      await upsertUserBook(userBook);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to add book to want list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartReading = async () => {
    setIsLoading(true);
    try {
      const userBook: UserBook = {
        book,
        shelf: "READING",
        currentPage: 0,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await upsertUserBook(userBook);

      // Navigate to Reading tab
      navigation.navigate("MainTabs", {
        screen: "Reading",
      } as any); // Type assertion needed due to nested navigation
    } catch (error) {
      console.error("Failed to start reading book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PixelHeader title={book.title} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{book.title}</Text>

          <Text style={styles.authors}>by {book.authors.join(", ")}</Text>

          <View style={styles.metaContainer}>
            {book.publishedYear && (
              <Text style={styles.metaText}>
                Published: {book.publishedYear}
              </Text>
            )}
            {book.pageCount && (
              <Text style={styles.metaText}>{book.pageCount} pages</Text>
            )}
          </View>

          {book.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.buttonContainer}>
            <PixelButton
              title="Add to Want to Read"
              onPress={handleAddToWant}
              variant="secondary"
              disabled={isLoading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <PixelButton
              title="Start Reading"
              onPress={handleStartReading}
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
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
    paddingTop: screenPadding.vertical,
    paddingBottom: spacing.xxxl,
  },
  detailsContainer: {
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.sm,
    textShadowColor: colors.shadow,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  authors: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  metaContainer: {
    marginBottom: spacing.lg,
  },
  metaText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  descriptionContainer: {
    marginTop: spacing.lg,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  actionsContainer: {
    gap: spacing.md,
  },
  buttonContainer: {
    marginBottom: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
