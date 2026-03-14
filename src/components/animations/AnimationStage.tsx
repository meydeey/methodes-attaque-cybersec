"use client";

import { cn } from "@/lib/utils";

export function AnimationStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-lg bg-zinc-950 border border-border/30 min-h-[350px] overflow-hidden p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
