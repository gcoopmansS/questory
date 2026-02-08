/**
 * Hook for managing reading session flow UI state
 */

import { useState } from "react";
import { logReadingSession } from "./actions";
import { loadPlayerStats } from "../player/state";

interface ReadingResult {
  gainedXP: number;
  levelBefore: number;
  levelAfter: number;
  streakBefore: number;
  streakAfter: number;
}

export function useReadingFlow() {
  const [pagesInput, setPagesInput] = useState<string>("");
  const [minutesInput, setMinutesInput] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<ReadingResult | undefined>(
    undefined,
  );

  const submitReading = async (): Promise<void> => {
    const parsedPages = parseInt(pagesInput, 10);

    // Validate pages input
    if (isNaN(parsedPages) || parsedPages < 1) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current stats before logging session
      const statsBefore = await loadPlayerStats();

      // Log the reading session
      const { stats: statsAfter } = await logReadingSession({
        bookId: "demo",
        pagesRead: parsedPages,
      });

      // Store the result
      const result: ReadingResult = {
        gainedXP: statsAfter.totalXP - statsBefore.totalXP,
        levelBefore: statsBefore.level,
        levelAfter: statsAfter.level,
        streakBefore: statsBefore.streakCount,
        streakAfter: statsAfter.streakCount,
      };

      setLastResult(result);

      // Clear inputs on success
      setPagesInput("");
      setMinutesInput("");
    } catch (error) {
      // Handle error silently or could expose error state if needed
      console.error("Failed to submit reading session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    pagesInput,
    minutesInput,
    isSubmitting,
    lastResult,

    // Actions
    setPagesInput,
    setMinutesInput,
    submitReading,
  };
}
