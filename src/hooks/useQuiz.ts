"use client";

import { useState, useCallback } from "react";
import { QuizQuestion, QuizResult } from "@/lib/types";

type QuizState = {
  currentIndex: number;
  answers: (number | null)[];
  showResult: boolean;
  showExplanation: boolean;
};

export function useQuiz(slug: string, questions: QuizQuestion[]) {
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    answers: new Array(questions.length).fill(null),
    showResult: false,
    showExplanation: false,
  });

  const currentQuestion = questions[state.currentIndex] ?? null;
  const selectedAnswer = state.answers[state.currentIndex];
  const isCorrect =
    selectedAnswer !== null && selectedAnswer === currentQuestion?.correctIndex;
  const isLastQuestion = state.currentIndex >= questions.length - 1;

  const selectAnswer = useCallback(
    (index: number) => {
      if (state.showExplanation) return;
      setState((prev) => {
        const newAnswers = [...prev.answers];
        newAnswers[prev.currentIndex] = index;
        return { ...prev, answers: newAnswers, showExplanation: true };
      });
    },
    [state.showExplanation],
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex >= questions.length - 1) {
        return { ...prev, showResult: true };
      }
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        showExplanation: false,
      };
    });
  }, [questions.length]);

  const reset = useCallback(() => {
    setState({
      currentIndex: 0,
      answers: new Array(questions.length).fill(null),
      showResult: false,
      showExplanation: false,
    });
  }, [questions.length]);

  const getResult = useCallback((): QuizResult => {
    const score = state.answers.reduce((acc: number, answer, i) => {
      const correct = questions[i]?.correctIndex;
      return acc + (answer === correct ? 1 : 0);
    }, 0);
    return {
      attackSlug: slug,
      score,
      total: questions.length,
      completedAt: new Date().toISOString(),
    };
  }, [state.answers, questions, slug]);

  return {
    currentIndex: state.currentIndex,
    currentQuestion,
    selectedAnswer,
    isCorrect,
    isLastQuestion,
    showExplanation: state.showExplanation,
    showResult: state.showResult,
    totalQuestions: questions.length,
    answers: state.answers,
    selectAnswer,
    nextQuestion,
    reset,
    getResult,
  };
}
