/**
 * Player stats persistence and state management
 */

import type { PlayerStats } from "./models";
import { getJSON, setJSON } from "../../lib/storage";
import { calcLevel } from "../../lib/xp";

const PLAYER_KEY = "questory.player";

/**
 * Create default player stats for new users
 */
function defaultPlayerStats(): PlayerStats {
  return {
    totalXP: 0,
    level: 1,
    streakCount: 0,
    lastReadDate: undefined,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Load player stats from storage
 * Returns default stats if none found or data is invalid
 */
export async function loadPlayerStats(): Promise<PlayerStats> {
  const stored = await getJSON<PlayerStats>(PLAYER_KEY);

  if (!stored) {
    return defaultPlayerStats();
  }

  // Ensure level is consistent with totalXP
  const correctLevel = calcLevel(stored.totalXP);

  return {
    ...stored,
    level: correctLevel,
  };
}

/**
 * Save player stats to storage
 * Automatically ensures level consistency
 */
export async function savePlayerStats(stats: PlayerStats): Promise<void> {
  const correctedStats: PlayerStats = {
    ...stats,
    level: calcLevel(stats.totalXP),
    updatedAt: new Date().toISOString(),
  };

  await setJSON(PLAYER_KEY, correctedStats);
}
