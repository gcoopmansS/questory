/**
 * Book discovery screen with search functionality
 */

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { PixelHeader } from "../components/PixelHeader";
import { PixelCard } from "../components/PixelCard";
import { demoBooks } from "../features/books/demoData";
import { colors } from "../theme/colors";
import { spacing, screenPadding, componentSpacing } from "../theme/spacing";
import type { RootStackScreenProps } from "../app/types";
import type { Book } from "../features/books/models";

type Props = RootStackScreenProps<"Discover">;

export const DiscoverScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) {
      return demoBooks;
    }

    const query = searchQuery.toLowerCase();
    return demoBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.authors.some((author) => author.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const handleBookPress = (bookId: string) => {
    navigation.navigate("BookDetail", { bookId });
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      onPress={() => handleBookPress(item.id)}
      style={styles.bookItemContainer}
    >
      <PixelCard>
        <View style={styles.bookItem}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthors}>by {item.authors.join(", ")}</Text>
          <View style={styles.bookMeta}>
            {item.publishedYear && (
              <Text style={styles.bookYear}>{item.publishedYear}</Text>
            )}
            {item.pageCount && (
              <Text style={styles.bookPages}>{item.pageCount} pages</Text>
            )}
          </View>
        </View>
      </PixelCard>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <PixelHeader title="Discover" />
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search books and authors..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          renderItem={renderBookItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No books found</Text>
              <Text style={styles.emptySubtext}>
                Try a different search term
              </Text>
            </View>
          }
        />
      </View>
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
    padding: screenPadding.horizontal,
  },
  searchContainer: {
    marginTop: screenPadding.vertical,
    marginBottom: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    height: componentSpacing.buttonHeight,
  },
  listContainer: {
    paddingBottom: spacing.lg,
  },
  bookItemContainer: {
    marginBottom: spacing.sm,
  },
  bookItem: {
    // PixelCard already provides padding
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bookAuthors: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  bookMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookYear: {
    fontSize: 12,
    color: colors.textMuted,
  },
  bookPages: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: spacing.xxxl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
