/**
 * Date utility functions for local date handling
 */

/**
 * Converts a Date to YYYY-MM-DD string in local time
 */
export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Checks if next date string is the day after prev date string
 */
export function isNextDay(prev: string, next: string): boolean {
  const prevDate = new Date(prev + "T00:00:00");
  const nextDate = new Date(next + "T00:00:00");

  const expectedNext = new Date(prevDate);
  expectedNext.setDate(expectedNext.getDate() + 1);

  return toLocalDateString(expectedNext) === toLocalDateString(nextDate);
}

/**
 * Checks if two date strings represent the same day
 */
export function isSameDay(a: string, b: string): boolean {
  return a === b;
}
