"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/lib/types";
import { getAttacksByCategory } from "@/lib/data/attacks";
import { AttackCard } from "./AttackCard";
import { ProgressBar } from "./ProgressBar";
import { useProgress } from "@/hooks/useProgress";
import {
  ChevronDown,
  Syringe,
  KeyRound,
  ShieldOff,
  Server,
  UserX,
  FileWarning,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Syringe,
  KeyRound,
  ShieldOff,
  Server,
  UserX,
  FileWarning,
};

const colorMap: Record<string, { text: string; bg: string }> = {
  red: { text: "text-red-400", bg: "bg-red-500/10" },
  orange: { text: "text-orange-400", bg: "bg-orange-500/10" },
  yellow: { text: "text-yellow-400", bg: "bg-yellow-500/10" },
  purple: { text: "text-purple-400", bg: "bg-purple-500/10" },
  pink: { text: "text-pink-400", bg: "bg-pink-500/10" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10" },
};

export function CategoryCard({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const attacks = getAttacksByCategory(category.id);
  const { getCompletionByCategory, progress } = useProgress();
  const IconComponent = iconMap[category.icon];
  const colors = colorMap[category.color] ?? {
    text: "text-gray-400",
    bg: "bg-gray-500/10",
  };

  if (attacks.length === 0) return null;

  const completion = getCompletionByCategory(category.id);
  const completedCount = Math.round(completion * attacks.length);

  return (
    <div className="hacker-card glow-hover overflow-hidden">
      <button
        className="w-full cursor-pointer select-none p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", colors.bg)}>
              {IconComponent && (
                <IconComponent className={cn("h-5 w-5", colors.text)} />
              )}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {category.name}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {attacks.length} attaque{attacks.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-[family-name:var(--font-geist-mono)] text-[var(--hacker-green)]">
              {completedCount}/{attacks.length}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-[var(--muted-foreground)] transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </div>
        </div>
        <ProgressBar value={completion} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {attacks.map((attack) => (
                <AttackCard key={attack.slug} attack={attack} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
