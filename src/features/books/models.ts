export type ShelfType = "WANT" | "READING" | "DONE";

export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnailUrl?: string;
  pageCount?: number;
  publishedYear?: number;
  description?: string;
}

export interface UserBook {
  book: Book;
  shelf: ShelfType;
  currentPage: number;
  startedAt?: string; // ISO string
  finishedAt?: string; // ISO string
  updatedAt: string; // ISO string
}
