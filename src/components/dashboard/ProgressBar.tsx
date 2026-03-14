import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  color?: string;
}

export function ProgressBar({
  value,
  color = "var(--hacker-green)",
}: ProgressBarProps) {
  const clampedValue = Math.min(1, Math.max(0, value));
  const percentage = clampedValue * 100;

  return (
    <div className="w-full h-1 rounded-full bg-[var(--hacker-border)] overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          clampedValue > 0 && "pulse-progress",
        )}
        style={{
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        }}
      />
    </div>
  );
}
