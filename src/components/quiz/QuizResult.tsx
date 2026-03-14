"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import type { QuizResult as QuizResultType, QuizQuestion } from "@/lib/types";

type QuizResultProps = {
  result: QuizResultType;
  questions: QuizQuestion[];
  answers: number[];
  onRetry: () => void;
};

function getScoreColor(score: number, total: number) {
  const ratio = score / total;
  if (ratio >= 0.66) return "text-[var(--hacker-green)]";
  if (ratio >= 0.33) return "text-[var(--hacker-high)]";
  return "text-[var(--hacker-critical)]";
}

function getMotivation(score: number, total: number) {
  const ratio = score / total;
  if (ratio === 1) return "Parfait ! Tu ma\u00eetrises ce sujet comme un pro.";
  if (ratio >= 0.66)
    return "Bon travail ! Tu as de solides bases en cybers\u00e9curit\u00e9.";
  if (ratio >= 0.33)
    return "Pas mal, mais il y a encore de la marge pour progresser.";
  return "Il est temps de revoir cette section. La cybers\u00e9curit\u00e9 s\u2019apprend pas \u00e0 pas.";
}

export function QuizResult({
  result,
  questions,
  answers,
  onRetry,
}: QuizResultProps) {
  const scoreColor = getScoreColor(result.score, result.total);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score display */}
      <div className="text-center">
        <p className="mb-2 font-mono text-xs text-[var(--hacker-green)]">
          &gt; R&Eacute;SULTAT
        </p>
        <p
          className={cn(
            "font-mono text-6xl font-bold",
            scoreColor,
          )}
        >
          {result.score}/{result.total}
        </p>
        <p className="mt-3 text-sm text-[#999]">
          {getMotivation(result.score, result.total)}
        </p>
      </div>

      {/* Per-question recap */}
      <div className="space-y-3">
        <p className="font-mono text-xs text-[var(--hacker-green)]">
          &gt; D&Eacute;TAIL DES R&Eacute;PONSES
        </p>
        {questions.map((q, i) => {
          const userAnswer = answers[i];
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={i}
              className={cn(
                "rounded-lg border p-3",
                isCorrect
                  ? "border-[var(--hacker-green)]/30 bg-[#002200]/50"
                  : "border-[var(--hacker-critical)]/30 bg-[#3b0000]/30",
              )}
            >
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hacker-green)]" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hacker-critical)]" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-white">{q.question}</p>
                  {!isCorrect && (
                    <>
                      <p className="text-xs text-[var(--hacker-critical)]">
                        Ta r&eacute;ponse : {q.options[userAnswer] ?? "Aucune"}
                      </p>
                      <p className="text-xs text-[var(--hacker-green)]">
                        Bonne r&eacute;ponse : {q.options[q.correctIndex]}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Retry button */}
      <button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-lg border border-[var(--hacker-green)] bg-[var(--hacker-green)]/10 px-6 py-2.5 font-mono text-sm font-semibold text-[var(--hacker-green)] transition-all hover:bg-[var(--hacker-green)]/20"
      >
        <RotateCcw className="h-4 w-4" />
        Recommencer
      </button>
    </motion.div>
  );
}
