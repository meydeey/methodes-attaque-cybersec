"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProgress, UserBadge } from "@/lib/types";
import { evaluateBadges, BADGES } from "@/lib/data/badges";

export function useBadges(progress: UserProgress) {
  const [newBadge, setNewBadge] = useState<string | null>(null);

  const checkBadges = useCallback(() => {
    const earnedIds = evaluateBadges(progress);
    const currentBadgeIds = progress.badges.map((b) => b.badgeId);
    const newBadges = earnedIds.filter((id) => !currentBadgeIds.includes(id));
    return newBadges;
  }, [progress]);

  useEffect(() => {
    const newBadges = checkBadges();
    if (newBadges.length > 0) {
      setNewBadge(newBadges[0]);
    }
  }, [checkBadges]);

  const dismissBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  const getBadgeStatus = useCallback(
    (badgeId: string) => {
      return progress.badges.some((b) => b.badgeId === badgeId);
    },
    [progress.badges],
  );

  const earnedBadges: UserBadge[] = evaluateBadges(progress).map((id) => {
    const existing = progress.badges.find((b) => b.badgeId === id);
    return existing ?? { badgeId: id, unlockedAt: new Date().toISOString() };
  });

  const newBadgeData = newBadge ? BADGES.find((b) => b.id === newBadge) : null;

  return {
    earnedBadges,
    newBadgeData,
    dismissBadge,
    getBadgeStatus,
    totalBadges: BADGES.length,
    earnedCount: earnedBadges.length,
  };
}
