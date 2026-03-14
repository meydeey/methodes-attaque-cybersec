"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, Trophy } from "lucide-react";
import { Attack } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuiz } from "@/hooks/useQuiz";
import { useProgress } from "@/hooks/useProgress";

export function QuizSection({ attack }: { attack: Attack }) {
  const quiz = useQuiz(attack.slug, attack.quiz);
  const { addQuizResult, getQuizResult } = useProgress();

  const previousResult = getQuizResult(attack.slug);

  if (attack.quiz.length === 0) {
    return (
      <div className="hacker-card p-8 text-center">
        <p className="text-[#666] font-mono">
          Aucun quiz disponible pour cette attaque.
        </p>
      </div>
    );
  }

  if (quiz.showResult) {
    const result = quiz.getResult();

    // Save result on first render of results
    if (!previousResult || result.score > previousResult.score) {
      addQuizResult(result);
    }

    const percentage = Math.round((result.score / result.total) * 100);
    const isPerfect = result.score === result.total;

    return (
      <div className="hacker-card p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Trophy
              className={cn(
                "h-12 w-12",
                isPerfect ? "text-[var(--hacker-green)]" : "text-yellow-400",
              )}
            />
          </div>
          <h3 className="text-xl font-bold text-white">
            Résultat : {result.score}/{result.total}
          </h3>
          <div className="w-full bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                isPerfect ? "bg-[var(--hacker-green)]" : "bg-yellow-400",
              )}
            />
          </div>
          <p className="text-sm text-[#999]">
            {isPerfect
              ? "Parfait ! Tu maîtrises cette attaque."
              : percentage >= 50
                ? "Pas mal ! Revois les points manqués."
                : "Continue à étudier cette attaque."}
          </p>
          <button
            onClick={quiz.reset}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm",
              "bg-[#002200] border border-[var(--hacker-green)] text-[var(--hacker-green)]",
              "hover:bg-[#003300] transition-colors",
              "font-mono",
            )}
          >
            <RotateCcw className="h-4 w-4" />
            Recommencer
          </button>
        </div>
      </div>
    );
  }

  if (!quiz.currentQuestion) return null;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-[#666] font-mono">
        <span>
          {">"} QUIZ — Question {quiz.currentIndex + 1}/{quiz.totalQuestions}
        </span>
        {previousResult && (
          <span>
            Meilleur score : {previousResult.score}/{previousResult.total}
          </span>
        )}
      </div>

      <div className="hacker-card p-6 space-y-6">
        {/* Question */}
        <h3 className="text-lg font-semibold text-white leading-relaxed">
          {quiz.currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {quiz.currentQuestion.options.map((option, i) => {
            const isSelected = quiz.selectedAnswer === i;
            const isCorrectAnswer = i === quiz.currentQuestion!.correctIndex;
            const showFeedback = quiz.showExplanation;

            return (
              <button
                key={i}
                onClick={() => quiz.selectAnswer(i)}
                disabled={quiz.showExplanation}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-md border text-sm transition-all",
                  "font-mono",
                  !showFeedback &&
                    "border-[#333] bg-[var(--hacker-surface)] text-[#ccc] hover:border-[var(--hacker-green)] hover:text-white",
                  showFeedback &&
                    isCorrectAnswer &&
                    "border-[var(--hacker-green)] bg-[#002200] text-[var(--hacker-green)]",
                  showFeedback &&
                    isSelected &&
                    !isCorrectAnswer &&
                    "border-red-500 bg-red-500/10 text-red-400",
                  showFeedback &&
                    !isSelected &&
                    !isCorrectAnswer &&
                    "border-[#222] bg-[#0a0a0a] text-[#555]",
                  "disabled:cursor-default",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0 text-xs opacity-60">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span>{option}</span>
                  {showFeedback && isCorrectAnswer && (
                    <CheckCircle className="h-4 w-4 ml-auto shrink-0 text-[var(--hacker-green)]" />
                  )}
                  {showFeedback && isSelected && !isCorrectAnswer && (
                    <XCircle className="h-4 w-4 ml-auto shrink-0 text-red-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {quiz.showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "p-4 rounded-md border text-sm leading-relaxed",
                quiz.isCorrect
                  ? "border-[var(--hacker-green)]/30 bg-[#001100] text-[#ccc]"
                  : "border-red-500/30 bg-red-500/5 text-[#ccc]",
              )}
            >
              <p className="text-xs font-mono mb-1 text-[#666]">
                {quiz.isCorrect ? "> CORRECT" : "> INCORRECT"}
              </p>
              <p>{quiz.currentQuestion.explanation}</p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={quiz.nextQuestion}
                className={cn(
                  "px-4 py-2 rounded-md text-sm",
                  "bg-[#002200] border border-[var(--hacker-green)] text-[var(--hacker-green)]",
                  "hover:bg-[#003300] transition-colors",
                  "font-mono",
                )}
              >
                {quiz.isLastQuestion ? "Voir le résultat" : "Question suivante"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
