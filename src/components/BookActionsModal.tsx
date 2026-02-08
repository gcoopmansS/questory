import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { PixelButton } from "./PixelButton";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import type { UserBook } from "../features/books/models";
import { upsertUserBook, removeUserBook } from "../features/books/storage";

interface BookActionsModalProps {
  visible: boolean;
  onClose: () => void;
  userBook: UserBook;
  onUpdated: () => void;
}

export const BookActionsModal: React.FC<BookActionsModalProps> = ({
  visible,
  onClose,
  userBook,
  onUpdated,
}) => {
  const [currentPage, setCurrentPage] = useState(
    userBook.currentPage?.toString() || "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: string) => {
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      let updatedUserBook: UserBook;

      switch (action) {
        case "want":
          updatedUserBook = {
            ...userBook,
            shelf: "WANT",
            startedAt: undefined,
            finishedAt: undefined,
            updatedAt: now,
          };
          break;
        case "reading":
          updatedUserBook = {
            ...userBook,
            shelf: "READING",
            startedAt: userBook.startedAt || now,
            finishedAt: undefined,
            updatedAt: now,
          };
          break;
        case "finished":
          updatedUserBook = {
            ...userBook,
            shelf: "DONE",
            finishedAt: now,
            updatedAt: now,
          };
          break;
        case "remove":
          await removeUserBook(userBook.book.id);
          onUpdated();
          onClose();
          return;
        default:
          return;
      }

      await upsertUserBook(updatedUserBook);
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePage = async () => {
    setIsLoading(true);
    try {
      const pageNumber = parseInt(currentPage, 10);
      if (isNaN(pageNumber) || pageNumber < 0) {
        return;
      }

      const updatedUserBook: UserBook = {
        ...userBook,
        currentPage: pageNumber,
        updatedAt: new Date().toISOString(),
      };

      await upsertUserBook(updatedUserBook);
      onUpdated();
    } catch (error) {
      console.error("Error saving page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity style={styles.modal} activeOpacity={1}>
          <Text style={styles.title}>Book Actions</Text>

          <ScrollView style={styles.content}>
            {/* Current Page Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Page</Text>
              <View style={styles.pageRow}>
                <TextInput
                  style={styles.pageInput}
                  value={currentPage}
                  onChangeText={setCurrentPage}
                  placeholder="Page number"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textMuted}
                />
                <PixelButton
                  title="Save page"
                  onPress={handleSavePage}
                  variant="secondary"
                  disabled={isLoading}
                />
              </View>
            </View>

            {/* Shelf Actions Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Move to Shelf</Text>
              <View style={styles.buttonGrid}>
                {userBook.shelf !== "WANT" && (
                  <PixelButton
                    title="Move to Want"
                    onPress={() => handleAction("want")}
                    variant="secondary"
                    disabled={isLoading}
                  />
                )}
                {userBook.shelf !== "READING" && (
                  <PixelButton
                    title="Move to Reading"
                    onPress={() => handleAction("reading")}
                    variant="secondary"
                    disabled={isLoading}
                  />
                )}
                {userBook.shelf !== "DONE" && (
                  <PixelButton
                    title="Mark as Finished"
                    onPress={() => handleAction("finished")}
                    variant="secondary"
                    disabled={isLoading}
                  />
                )}
              </View>
            </View>

            {/* Remove Section */}
            <View style={styles.section}>
              <PixelButton
                title="Remove from shelf"
                onPress={() => handleAction("remove")}
                variant="secondary"
                disabled={isLoading}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <PixelButton title="Close" onPress={onClose} variant="secondary" />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    maxHeight: "80%",
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  pageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  pageInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    padding: spacing.sm,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  buttonGrid: {
    gap: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
