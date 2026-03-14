"use client";

import { useEffect, useCallback } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { useProgress } from "@/hooks/useProgress";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { QuizResult } from "@/components/quiz/QuizResult";
import { Terminal, RotateCcw } from "lucide-react";
import type { Attack, QuizResult as QuizResultType } from "@/lib/types";

type QuizSectionProps = {
  attack: Attack;
  onComplete?: (result: QuizResultType) => void;
};

export function QuizSection({ attack, onComplete }: QuizSectionProps) {
  const { addQuizResult, isQuizCompleted, getQuizResult } = useProgress();
  const quiz = useQuiz(attack.slug, attack.quiz);
  const existingResult = getQuizResult(attack.slug);

  const handleComplete = useCallback(() => {
    const result = quiz.getResult();
    addQuizResult(result);
    onComplete?.(result);
  }, [quiz, addQuizResult, onComplete]);

  useEffect(() => {
    if (quiz.showResult) {
      handleComplete();
    }
  }, [quiz.showResult, handleComplete]);

  const correctIndices = attack.quiz.map((q) => q.correctIndex);

  return (
    <div className="space-y-6">
      {/* Terminal header */}
      <div className="flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-sm text-[var(--hacker-green)]">
        <Terminal className="h-4 w-4" />
        <span>root@cybersec:~$ ./quiz --attack {attack.slug}</span>
      </div>

      {/* Already completed state */}
      {isQuizCompleted(attack.slug) &&
        !quiz.showResult &&
        quiz.currentIndex === 0 &&
        !quiz.showExplanation &&
        existingResult && (
          <div className="hacker-card p-6">
            <div className="space-y-4">
              <p className="font-[family-name:var(--font-geist-mono)] text-xs text-[var(--hacker-green)]">
                &gt; QUIZ D&Eacute;J&Agrave; COMPL&Eacute;T&Eacute;
              </p>
              <p className="font-[family-name:var(--font-geist-mono)] text-3xl font-bold text-white">
                Score :{" "}
                <span className="text-[var(--hacker-green)]">
                  {existingResult.score}/{existingResult.total}
                </span>
              </p>
              <p className="text-sm text-[#999]">
                Compl&eacute;t&eacute; le{" "}
                {new Date(existingResult.completedAt).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </p>
              <button
                onClick={quiz.reset}
                className="flex items-center gap-2 rounded-lg border border-[var(--hacker-green)] bg-[var(--hacker-green)]/10 px-6 py-2.5 font-[family-name:var(--font-geist-mono)] text-sm font-semibold text-[var(--hacker-green)] transition-all hover:bg-[var(--hacker-green)]/20"
              >
                <RotateCcw className="h-4 w-4" />
                Recommencer le quiz
              </button>
            </div>
          </div>
        )}

      {/* Active quiz */}
      {!quiz.showResult &&
        !(
          isQuizCompleted(attack.slug) &&
          quiz.currentIndex === 0 &&
          !quiz.showExplanation
        ) &&
        quiz.currentQuestion && (
          <div className="hacker-card p-6">
            <QuizQuestion
              question={quiz.currentQuestion}
              questionIndex={quiz.currentIndex}
              totalQuestions={quiz.totalQuestions}
              selectedAnswer={quiz.selectedAnswer}
              showExplanation={quiz.showExplanation}
              onSelect={quiz.selectAnswer}
              onNext={quiz.nextQuestion}
              isLast={quiz.isLastQuestion}
              answersHistory={quiz.answers}
              correctIndices={correctIndices}
            />
          </div>
        )}

      {/* Result */}
      {quiz.showResult && (
        <div className="hacker-card p-6">
          <QuizResult
            result={quiz.getResult()}
            questions={attack.quiz}
            answers={quiz.answers.map((a) => a ?? 0)}
            onRetry={quiz.reset}
          />
        </div>
      )}
    </div>
  );
}
