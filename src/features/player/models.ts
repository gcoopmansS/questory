/**
 * Player progression and statistics models
 */

export interface PlayerStats {
  /** Total experience points earned */
  totalXP: number;
  /** Current player level */
  level: number;
  /** Consecutive days reading streak */
  streakCount: number;
  /** Last reading date (YYYY-MM-DD format) */
  lastReadDate?: string;
  /** When stats were last updated (ISO string) */
  updatedAt: string;
}
