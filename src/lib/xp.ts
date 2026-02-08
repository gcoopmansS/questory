/**
 * Experience points and leveling calculations
 */

/**
 * Calculate player level from total XP
 * Formula: level = floor(sqrt(totalXP / 100)) + 1
 *
 * Examples:
 * calcLevel(0) => 1
 * calcLevel(100) => 2
 * calcLevel(400) => 3
 * calcLevel(900) => 4
 */
export function calcLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

/**
 * Calculate XP threshold needed for next level
 * Formula: 100 * level^2
 *
 * Examples:
 * nextLevelThreshold(1) => 100
 * nextLevelThreshold(2) => 400
 * nextLevelThreshold(3) => 900
 */
export function nextLevelThreshold(level: number): number {
  return 100 * level * level;
}

/**
 * Calculate XP earned from a reading session
 * Base: 1 XP per page (minimum 0)
 * Bonus: +150 if completed book, +20 if kept streak
 *
 * Examples:
 * calcSessionXP(10) => 10
 * calcSessionXP(0) => 0
 * calcSessionXP(5, { completedBook: true }) => 155
 * calcSessionXP(3, { keptStreak: true }) => 23
 * calcSessionXP(8, { completedBook: true, keptStreak: true }) => 178
 */
export function calcSessionXP(
  pagesRead: number,
  opts?: { completedBook?: boolean; keptStreak?: boolean },
): number {
  let xp = Math.max(0, pagesRead);

  if (opts?.completedBook) {
    xp += 150;
  }

  if (opts?.keptStreak) {
    xp += 20;
  }

  return xp;
}
