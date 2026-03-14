"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";

export function Header() {
  const { progress, totalCompletion, isLoaded } = useProgress();
  const completionPercent = Math.round(totalCompletion * 100);

  return (
    <header className="border-b border-[var(--hacker-border)] bg-[var(--hacker-bg)]/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono"
        >
          <span className="text-[var(--hacker-green)] text-lg font-bold">
            &gt; CYBERSEC_ELITE
          </span>
          <span className="text-[var(--muted-foreground)] text-xs">v2.0</span>
        </Link>

        {isLoaded && (
          <div className="flex items-center gap-4 font-mono">
            <span className="text-[var(--hacker-green)] text-sm">
              SCORE: {progress.totalScore}
            </span>
            <div className="relative flex items-center justify-center w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="var(--hacker-border)"
                  strokeWidth="2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="var(--hacker-green)"
                  strokeWidth="2"
                  strokeDasharray={`${completionPercent * 0.9425} 94.25`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] text-[var(--hacker-green)] font-bold">
                {completionPercent}%
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
