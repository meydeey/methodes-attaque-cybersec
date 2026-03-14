"use client";

import Link from "next/link";
import { SeverityBadge } from "./SeverityBadge";
import { Attack } from "@/lib/types";
import { ChevronRight, CheckCircle } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export function AttackCard({ attack }: { attack: Attack }) {
  const { isAttackRead, isQuizCompleted } = useProgress();
  const read = isAttackRead(attack.slug);
  const quizDone = isQuizCompleted(attack.slug);

  return (
    <Link href={`/attack/${attack.slug}`}>
      <div
        className={cn(
          "hacker-card glow-hover group cursor-pointer relative p-4 flex items-center justify-between",
          !read && "opacity-60",
        )}
      >
        {read && (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--hacker-green)]" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-sm truncate text-[var(--foreground)]">
              {attack.name}
            </h3>
            <SeverityBadge severity={attack.severity} />
            {quizDone && (
              <CheckCircle className="h-3.5 w-3.5 text-[var(--hacker-green)] shrink-0" />
            )}
          </div>
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
            {attack.summary}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)] group-hover:text-[var(--hacker-green)] transition-colors shrink-0 ml-2" />
      </div>
    </Link>
  );
}
