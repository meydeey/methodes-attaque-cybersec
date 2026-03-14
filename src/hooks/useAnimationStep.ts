"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimationStep } from "@/lib/types";

export function useAnimationStep(steps: AnimationStep[]) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = steps.length;
  const isStarted = currentStep >= 0;
  const isFinished = currentStep >= totalSteps - 1;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= totalSteps - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [totalSteps]);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentStep(-1);
    setIsPlaying(false);
  }, [clearTimer]);

  const play = useCallback(() => {
    if (isFinished) {
      setCurrentStep(0);
    } else if (!isStarted) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [isFinished, isStarted]);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
  }, [clearTimer]);

  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1 && currentStep >= 0) {
      const duration = steps[currentStep]?.duration ?? 2000;
      timerRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, duration);
    } else if (currentStep >= totalSteps - 1) {
      setIsPlaying(false);
    }

    return () => clearTimer();
  }, [isPlaying, currentStep, totalSteps, steps, clearTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (!isStarted) {
            setCurrentStep(0);
          } else {
            nextStep();
          }
          break;
        case "KeyR":
          e.preventDefault();
          reset();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStarted, nextStep, reset]);

  return {
    currentStep,
    totalSteps,
    isStarted,
    isFinished,
    isPlaying,
    currentStepData: currentStep >= 0 ? steps[currentStep] : null,
    nextStep,
    play,
    pause,
    reset,
  };
}
