/**
 * Reading session actions and state management
 */

import type { ReadingSession } from "./models";
import type { PlayerStats } from "../player/models";
import type { UserBook } from "../books/models";
import { loadPlayerStats, savePlayerStats } from "../player/state";
import {
  getOrCreateDemoBook,
  loadUserBooks,
  saveUserBooks,
} from "../books/storage";
import { updateStreak } from "../../lib/streak";
import { calcSessionXP, calcLevel } from "../../lib/xp";
import { toLocalDateString } from "../../lib/dates";

/**
 * Log a reading session and update player stats
 * Returns the created session and updated player stats
 */
export async function logReadingSession(input: {
  bookId: string;
  pagesRead: number;
  completedBook?: boolean;
}): Promise<{ session: ReadingSession; stats: PlayerStats }> {
  // Load current player stats
  const currentStats = await loadPlayerStats();

  // Get today's date as local date string
  const sessionLocalDate = toLocalDateString(new Date());

  // Update reading streak
  const { streakCount, keptStreakBonus, newLastReadDate } = updateStreak(
    currentStats,
    sessionLocalDate,
  );

  // Calculate XP gained from this session
  const gainedXP = calcSessionXP(input.pagesRead, {
    completedBook: input.completedBook,
    keptStreak: keptStreakBonus,
  });

  // Update player stats
  const newTotalXP = currentStats.totalXP + gainedXP;
  const updatedStats: PlayerStats = {
    totalXP: newTotalXP,
    level: calcLevel(newTotalXP),
    streakCount,
    lastReadDate: newLastReadDate,
    updatedAt: new Date().toISOString(),
  };

  // Persist updated stats
  await savePlayerStats(updatedStats);

  // Create reading session record (in memory only for now)
  const session: ReadingSession = {
    id: Math.random().toString(36).substring(2, 15), // Simple random ID
    bookId: input.bookId,
    date: sessionLocalDate,
    pagesRead: input.pagesRead,
    createdAt: new Date().toISOString(),
  };

  return { session, stats: updatedStats };
}

/**
 * Log current page progress and update book state
 * Returns pages read, session (if created), updated stats, and updated book
 */
export async function logCurrentPage(input: {
  bookId: string;
  newPage: number;
  completedBook?: boolean;
}): Promise<{
  pagesRead: number;
  session: ReadingSession;
  stats: PlayerStats;
  updatedBook: UserBook;
}> {
  // Load the user book (using demo book for now)
  const userBook = await getOrCreateDemoBook();
  const previousPage = userBook.currentPage;
  const pagesRead = Math.max(0, input.newPage - previousPage);

  // Only create session if pages were read OR book was completed
  const shouldCreateSession = pagesRead > 0 || input.completedBook === true;

  let session: ReadingSession;
  let stats: PlayerStats;

  if (shouldCreateSession) {
    // Log the reading session
    const result = await logReadingSession({
      bookId: input.bookId,
      pagesRead,
      completedBook: input.completedBook,
    });
    session = result.session;
    stats = result.stats;
  } else {
    // No session created, just load current stats
    stats = await loadPlayerStats();
    // Create a dummy session for consistency (won't be persisted)
    session = {
      id: "",
      bookId: input.bookId,
      date: toLocalDateString(new Date()),
      pagesRead: 0,
      createdAt: new Date().toISOString(),
    };
  }

  // Update the user book
  const updatedBook: UserBook = {
    ...userBook,
    currentPage: Math.max(previousPage, input.newPage),
    shelf: input.completedBook ? "DONE" : userBook.shelf,
    finishedAt: input.completedBook
      ? new Date().toISOString()
      : userBook.finishedAt,
    updatedAt: new Date().toISOString(),
  };

  // Save updated book
  const allUserBooks = await loadUserBooks();
  const bookIndex = allUserBooks.findIndex(
    (book) => book.book.id === input.bookId,
  );
  if (bookIndex >= 0) {
    allUserBooks[bookIndex] = updatedBook;
  } else {
    allUserBooks.push(updatedBook);
  }
  await saveUserBooks(allUserBooks);

  return {
    pagesRead,
    session,
    stats,
    updatedBook,
  };
}
