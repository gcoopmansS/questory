/**
 * Reading streak calculation utilities
 */

import type { PlayerStats } from "../features/player/models";
import { isNextDay, isSameDay } from "./dates";

/**
 * Update reading streak based on session date
 * Returns new streak count, bonus status, and updated last read date
 */
export function updateStreak(
  prev: PlayerStats,
  sessionLocalDate: string,
): {
  streakCount: number;
  keptStreakBonus: boolean;
  newLastReadDate: string;
} {
  // First time reading
  if (!prev.lastReadDate) {
    return {
      streakCount: 1,
      keptStreakBonus: false,
      newLastReadDate: sessionLocalDate,
    };
  }

  // Same day - no streak change
  if (isSameDay(prev.lastReadDate, sessionLocalDate)) {
    return {
      streakCount: prev.streakCount,
      keptStreakBonus: false,
      newLastReadDate: sessionLocalDate,
    };
  }

  // Next consecutive day - extend streak
  if (isNextDay(prev.lastReadDate, sessionLocalDate)) {
    return {
      streakCount: prev.streakCount + 1,
      keptStreakBonus: true,
      newLastReadDate: sessionLocalDate,
    };
  }

  // Gap in reading - reset streak
  return {
    streakCount: 1,
    keptStreakBonus: false,
    newLastReadDate: sessionLocalDate,
  };
}
