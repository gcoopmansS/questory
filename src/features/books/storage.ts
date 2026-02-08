/**
 * UserBook storage management
 */

import type { UserBook, Book } from "./models";
import { getJSON, setJSON } from "../../lib/storage";

const USER_BOOKS_KEY = "questory.userBooks";

/**
 * Sort books by updatedAt descending (most recently updated first)
 */
function sortBooksByUpdatedAt(books: UserBook[]): UserBook[] {
  return books.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

/**
 * Load all user books from storage
 */
export async function loadUserBooks(): Promise<UserBook[]> {
  const stored = await getJSON<UserBook[]>(USER_BOOKS_KEY);
  return stored ? sortBooksByUpdatedAt(stored) : [];
}

/**
 * Save user books to storage
 */
export async function saveUserBooks(items: UserBook[]): Promise<void> {
  const sortedItems = sortBooksByUpdatedAt([...items]);
  await setJSON(USER_BOOKS_KEY, sortedItems);
}

/**
 * Insert or update a user book, returns updated list
 * Deduplicates by book.id
 */
export async function upsertUserBook(item: UserBook): Promise<UserBook[]> {
  const userBooks = await loadUserBooks();
  const existingIndex = userBooks.findIndex(
    (book) => book.book.id === item.book.id,
  );

  const updatedItem = {
    ...item,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    userBooks[existingIndex] = updatedItem;
  } else {
    userBooks.push(updatedItem);
  }

  await saveUserBooks(userBooks);
  return sortBooksByUpdatedAt(userBooks);
}

/**
 * Remove a user book by book ID, returns updated list
 */
export async function removeUserBook(bookId: string): Promise<UserBook[]> {
  const userBooks = await loadUserBooks();
  const filteredBooks = userBooks.filter((book) => book.book.id !== bookId);

  await saveUserBooks(filteredBooks);
  return filteredBooks;
}

/**
 * Get a specific user book by book ID
 */
export async function getUserBook(bookId: string): Promise<UserBook | null> {
  const userBooks = await loadUserBooks();
  return userBooks.find((book) => book.book.id === bookId) || null;
}

/**
 * Get existing demo book or create it if it doesn't exist
 * @deprecated Use upsertUserBook instead for new code
 */
export async function getOrCreateDemoBook(): Promise<UserBook> {
  const existingDemo = await getUserBook("demo");

  if (existingDemo) {
    return existingDemo;
  }

  // Create demo book
  const demoBook: Book = {
    id: "demo",
    title: "Demo Book",
    authors: ["Demo Author"],
    pageCount: 300,
    publishedYear: 2024,
    description: "A demo book for testing the reading flow.",
  };

  const demoUserBook: UserBook = {
    book: demoBook,
    shelf: "READING",
    currentPage: 0,
    updatedAt: new Date().toISOString(),
  };

  await upsertUserBook(demoUserBook);
  return demoUserBook;
}
