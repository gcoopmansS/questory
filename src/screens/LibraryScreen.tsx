import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PixelHeader } from "../components/PixelHeader";
import { PixelButton } from "../components/PixelButton";
import { PixelCard } from "../components/PixelCard";
import { BookActionsModal } from "../components/BookActionsModal";
import { colors } from "../theme/colors";
import { spacing, screenPadding } from "../theme/spacing";
import type { RootStackParamList } from "../app/types";
import type { UserBook, ShelfType } from "../features/books/models";
import { loadUserBooks } from "../features/books/storage";
import { demoBooks } from "../features/books/demoData";

interface LibraryScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "MainTabs">;
}

interface BooksByShelf {
  WANT: UserBook[];
  READING: UserBook[];
  DONE: UserBook[];
}

const shelfTitles: Record<ShelfType, string> = {
  WANT: "Want to Read",
  READING: "Reading",
  DONE: "Finished",
};

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigation }) => {
  const [booksByShelf, setBooksByShelf] = useState<BooksByShelf>({
    WANT: [],
    READING: [],
    DONE: [],
  });
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadBooks = useCallback(async () => {
    try {
      const userBooks = await loadUserBooks();
      const grouped: BooksByShelf = {
        WANT: [],
        READING: [],
        DONE: [],
      };

      userBooks.forEach((userBook) => {
        grouped[userBook.shelf].push(userBook);
      });

      setBooksByShelf(grouped);
    } catch (error) {
      console.error("Error loading books:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks]),
  );

  const handleAddBook = () => {
    navigation.navigate("Discover");
  };

  const handleBookPress = (userBook: UserBook) => {
    setSelectedBook(userBook);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedBook(null);
  };

  const handleBookUpdated = () => {
    loadBooks();
  };

  const renderBookRow = (userBook: UserBook) => {
    const book = demoBooks.find((b) => b.id === userBook.book.id);
    if (!book) return null;

    let statusText = "";
    if (userBook.shelf === "READING" && userBook.currentPage) {
      statusText = `Page ${userBook.currentPage}`;
    } else if (userBook.shelf === "DONE") {
      statusText = "Completed";
    }

    return (
      <TouchableOpacity
        key={userBook.book.id}
        style={styles.bookRow}
        onPress={() => handleBookPress(userBook)}
      >
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthors}>{book.authors.join(", ")}</Text>
          {statusText && <Text style={styles.bookStatus}>{statusText}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const renderShelfSection = (shelfType: ShelfType) => {
    const books = booksByShelf[shelfType];

    return (
      <PixelCard key={shelfType} style={styles.shelfCard}>
        <Text style={styles.shelfTitle}>{shelfTitles[shelfType]}</Text>
        {books.length === 0 ? (
          <Text style={styles.emptyText}>No books yet</Text>
        ) : (
          books.map(renderBookRow)
        )}
      </PixelCard>
    );
  };

  return (
    <View style={styles.container}>
      <PixelHeader title="My Bookshelf" />

      <View style={styles.addButtonContainer}>
        <PixelButton
          title="+ Add book"
          onPress={handleAddBook}
          variant="primary"
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {(["WANT", "READING", "DONE"] as ShelfType[]).map(renderShelfSection)}
      </ScrollView>

      {selectedBook && (
        <BookActionsModal
          visible={modalVisible}
          onClose={handleModalClose}
          userBook={selectedBook}
          onUpdated={handleBookUpdated}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  addButtonContainer: {
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: spacing.md,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: screenPadding.horizontal,
    paddingBottom: screenPadding.vertical,
  },
  shelfCard: {
    marginBottom: spacing.lg,
  },
  shelfTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: spacing.md,
  },
  bookRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  bookInfo: {
    flex: 1,
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
  bookStatus: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: "bold",
  },
});
