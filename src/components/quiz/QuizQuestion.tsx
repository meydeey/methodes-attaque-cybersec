"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion as QuizQuestionType } from "@/lib/types";

const LETTERS = ["A", "B", "C", "D"];

type QuizQuestionProps = {
  question: QuizQuestionType;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onSelect: (index: number) => void;
  onNext: () => void;
  isLast: boolean;
  answersHistory: (number | null)[];
  correctIndices: number[];
};

function getOptionStyle(
  optionIndex: number,
  selectedAnswer: number | null,
  correctIndex: number,
  showExplanation: boolean,
) {
  if (!showExplanation) {
    return "bg-[var(--hacker-surface)] border-[#333] hover:border-[var(--hacker-green)]/40 hover:shadow-[0_0_15px_rgba(0,255,65,0.08)] cursor-pointer";
  }

  const isSelected = selectedAnswer === optionIndex;
  const isCorrect = optionIndex === correctIndex;

  if (isCorrect) {
    return "bg-[#002200] border-[var(--hacker-green)] shadow-[0_0_15px_rgba(0,255,65,0.15)]";
  }
  if (isSelected && !isCorrect) {
    return "bg-[#3b0000] border-[var(--hacker-critical)]";
  }
  return "bg-[var(--hacker-surface)] border-[#333] opacity-50";
}

export function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  showExplanation,
  onSelect,
  onNext,
  isLast,
  answersHistory,
  correctIndices,
}: QuizQuestionProps) {
  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="space-y-3">
        <p className="font-[family-name:var(--font-geist-mono)] text-xs text-[var(--hacker-green)]">
          Question {questionIndex + 1}/{totalQuestions}
        </p>
        <p className="text-[15px] font-semibold leading-relaxed text-white">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, i) => {
          const style = getOptionStyle(
            i,
            selectedAnswer,
            question.correctIndex,
            showExplanation,
          );
          const isSelected = selectedAnswer === i;
          const isCorrect = i === question.correctIndex;

          return (
            <motion.button
              key={i}
              whileHover={!showExplanation ? { scale: 1.01 } : {}}
              whileTap={!showExplanation ? { scale: 0.99 } : {}}
              onClick={() => !showExplanation && onSelect(i)}
              disabled={showExplanation}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all",
                style,
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded font-[family-name:var(--font-geist-mono)] text-sm font-bold",
                  showExplanation && isCorrect
                    ? "bg-[var(--hacker-green)]/20 text-[var(--hacker-green)]"
                    : showExplanation && isSelected && !isCorrect
                      ? "bg-[var(--hacker-critical)]/20 text-[var(--hacker-critical)]"
                      : "bg-[#1a1a1a] text-[var(--hacker-green)]",
                )}
              >
                {LETTERS[i]}
              </span>
              <span className="flex-1 text-sm text-[#ccc]">{option}</span>
              {showExplanation && isCorrect && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--hacker-green)]" />
              )}
              {showExplanation && isSelected && !isCorrect && (
                <XCircle className="h-5 w-5 shrink-0 text-[var(--hacker-critical)]" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-[var(--hacker-border)] bg-[#0d1f0d] p-4">
              <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-xs font-bold text-[var(--hacker-green)]">
                &gt; EXPLICATION
              </p>
              <p className="text-sm leading-relaxed text-[#ccc]">
                {question.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next button */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={onNext}
              className="flex items-center gap-2 rounded-lg border border-[var(--hacker-green)] bg-[var(--hacker-green)]/10 px-6 py-2.5 font-[family-name:var(--font-geist-mono)] text-sm font-semibold text-[var(--hacker-green)] transition-all hover:bg-[var(--hacker-green)]/20"
            >
              {isLast ? "Voir r\u00e9sultat" : "Suivant"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex items-center gap-2 pt-2">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const answer = answersHistory[i];
          const isAnswered = answer !== null && answer !== undefined;
          const isCurrentCorrect = isAnswered && answer === correctIndices[i];

          return (
            <div
              key={i}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === questionIndex
                  ? "h-2.5 w-2.5 bg-[var(--hacker-green)]"
                  : isAnswered && isCurrentCorrect
                    ? "bg-[var(--hacker-green)]"
                    : isAnswered && !isCurrentCorrect
                      ? "bg-[var(--hacker-critical)]"
                      : "bg-[#333]",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
