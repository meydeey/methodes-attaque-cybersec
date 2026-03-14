"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Attack } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PresenterControls({
  prev,
  next,
}: {
  prev: Attack | null;
  next: Attack | null;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.code === "ArrowLeft" && prev) {
        e.preventDefault();
        router.push(`/attack/${prev.slug}`);
      } else if (e.code === "ArrowRight" && next) {
        e.preventDefault();
        router.push(`/attack/${next.slug}`);
      } else if (e.code === "Escape") {
        e.preventDefault();
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next, router]);

  return (
    <div className="flex items-center justify-between pt-6 border-t border-[var(--hacker-border)]">
      <div>
        {prev ? (
          <Link
            href={`/attack/${prev.slug}`}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              "border border-[var(--hacker-border)] text-[#999] hover:text-[var(--hacker-green)] hover:border-[var(--hacker-green)]/50",
              "font-mono",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="max-w-[150px] truncate">{prev.name}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <Link
        href="/"
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
          "text-[#666] hover:text-[var(--hacker-green)]",
        )}
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>

      <div>
        {next ? (
          <Link
            href={`/attack/${next.slug}`}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              "border border-[var(--hacker-border)] text-[#999] hover:text-[var(--hacker-green)] hover:border-[var(--hacker-green)]/50",
              "font-mono",
            )}
          >
            <span className="max-w-[150px] truncate">{next.name}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 right-4 text-[10px] text-[var(--hacker-green)]/30 font-mono space-y-0.5 border border-[var(--hacker-border)] rounded-md px-3 py-2 bg-transparent">
        <p>&larr; &rarr; Naviguer | Espace &Eacute;tape | R Reset | Esc Home</p>
      </div>
    </div>
  );
}
