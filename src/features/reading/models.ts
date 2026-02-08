/**
 * Reading session tracking models
 */

export interface ReadingSession {
  /** Unique session identifier */
  id: string;
  /** ID of the book being read */
  bookId: string;
  /** Date of the reading session (ISO string) */
  date: string;
  /** Number of pages read during this session */
  pagesRead: number;
  /** Optional duration of reading session in minutes */
  minutesRead?: number;
  /** When this session was recorded (ISO string) */
  createdAt: string;
}
