import { Attack, UserProgress } from "@/lib/types";
import { SeverityBadge } from "@/components/dashboard/SeverityBadge";
import { categories } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

const categoryColorMap: Record<string, string> = {
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  pink: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

export function AttackHeader({
  attack,
  progress,
  isLoaded,
}: {
  attack: Attack;
  progress: UserProgress;
  isLoaded: boolean;
}) {
  const category = categories.find((c) => c.id === attack.categoryId);
  const catColor = category ? (categoryColorMap[category.color] ?? "") : "";

  const isRead = progress.completedAttacks.includes(attack.slug);
  const isAnimViewed = progress.viewedAnimations.includes(attack.slug);
  const isProtViewed = progress.viewedProtections.includes(attack.slug);
  const isQuizDone = progress.quizResults.some(
    (q) => q.attackSlug === attack.slug,
  );

  const progressSteps = [
    { done: isRead, label: "Lu" },
    { done: isAnimViewed, label: "Démo" },
    { done: isProtViewed, label: "Protections" },
    { done: isQuizDone, label: "Quiz" },
  ];

  return (
    <div className="space-y-3">
      {/* Terminal prompt */}
      <p className="text-xs text-[var(--hacker-green)]/70 font-[family-name:var(--font-geist-mono)]">
        root@cybersec:~/attacks$ cat {attack.slug}.md
      </p>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {/* Attack name */}
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {attack.name}
          </h1>

          {/* Badges */}
          <div className="flex items-center gap-2">
            <SeverityBadge severity={attack.severity} />
            {category && (
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium",
                  catColor,
                )}
              >
                {category.name}
              </span>
            )}
          </div>
        </div>

        {/* Progression indicators */}
        {isLoaded && (
          <div className="flex items-center gap-1.5 pt-1">
            {progressSteps.map((step, i) => (
              <div
                key={i}
                title={step.label}
                className={cn(
                  "h-3 w-3 rounded-sm transition-colors",
                  step.done ? "bg-[var(--hacker-green)]" : "bg-[#333]",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-[#999] leading-relaxed">{attack.summary}</p>
    </div>
  );
}
