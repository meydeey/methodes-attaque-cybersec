"use client";

import { useState, useCallback, useEffect } from "react";
import { UserProgress, QuizResult } from "@/lib/types";
import { ALL_ATTACKS } from "@/lib/data/attacks";

const STORAGE_KEY = "cybersec-elite-progress";

const DEFAULT_PROGRESS: UserProgress = {
  completedAttacks: [],
  viewedAnimations: [],
  viewedProtections: [],
  quizResults: [],
  badges: [],
  totalScore: 0,
};

function loadProgress(): UserProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(progress: UserProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setIsLoaded(true);
  }, []);

  const update = useCallback(
    (updater: (prev: UserProgress) => UserProgress) => {
      setProgress((prev) => {
        const next = updater(prev);
        saveProgress(next);
        return next;
      });
    },
    [],
  );

  const markAsRead = useCallback(
    (slug: string) => {
      update((prev) => {
        if (prev.completedAttacks.includes(slug)) return prev;
        return {
          ...prev,
          completedAttacks: [...prev.completedAttacks, slug],
        };
      });
    },
    [update],
  );

  const markAnimationViewed = useCallback(
    (slug: string) => {
      update((prev) => {
        if (prev.viewedAnimations.includes(slug)) return prev;
        return {
          ...prev,
          viewedAnimations: [...prev.viewedAnimations, slug],
        };
      });
    },
    [update],
  );

  const markProtectionsViewed = useCallback(
    (slug: string) => {
      update((prev) => {
        if (prev.viewedProtections.includes(slug)) return prev;
        return {
          ...prev,
          viewedProtections: [...prev.viewedProtections, slug],
        };
      });
    },
    [update],
  );

  const addQuizResult = useCallback(
    (result: QuizResult) => {
      update((prev) => {
        const existing = prev.quizResults.findIndex(
          (q) => q.attackSlug === result.attackSlug,
        );
        const newResults = [...prev.quizResults];
        if (existing >= 0) {
          newResults[existing] = result;
        } else {
          newResults.push(result);
        }
        const totalScore = newResults.reduce((sum, q) => sum + q.score, 0);
        return { ...prev, quizResults: newResults, totalScore };
      });
    },
    [update],
  );

  const getCompletionByCategory = useCallback(
    (categoryId: string) => {
      const categoryAttacks = ALL_ATTACKS.filter(
        (a) => a.categoryId === categoryId,
      );
      if (categoryAttacks.length === 0) return 0;
      const completed = categoryAttacks.filter((a) =>
        progress.quizResults.some((q) => q.attackSlug === a.slug),
      ).length;
      return completed / categoryAttacks.length;
    },
    [progress.quizResults],
  );

  const isAttackRead = useCallback(
    (slug: string) => progress.completedAttacks.includes(slug),
    [progress.completedAttacks],
  );

  const isQuizCompleted = useCallback(
    (slug: string) => progress.quizResults.some((q) => q.attackSlug === slug),
    [progress.quizResults],
  );

  const getQuizResult = useCallback(
    (slug: string) => progress.quizResults.find((q) => q.attackSlug === slug),
    [progress.quizResults],
  );

  const totalCompletion =
    ALL_ATTACKS.length > 0
      ? progress.completedAttacks.length / ALL_ATTACKS.length
      : 0;

  return {
    progress,
    isLoaded,
    markAsRead,
    markAnimationViewed,
    markProtectionsViewed,
    addQuizResult,
    getCompletionByCategory,
    isAttackRead,
    isQuizCompleted,
    getQuizResult,
    totalCompletion,
  };
}
