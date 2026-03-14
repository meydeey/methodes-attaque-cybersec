"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { useBadges } from "@/hooks/useBadges";
import { BADGES } from "@/lib/data/badges";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

export function BadgeShowcase() {
  const { progress, isLoaded } = useProgress();
  const { earnedBadges } = useBadges(progress);

  if (!isLoaded) return null;

  const earnedIds = earnedBadges.map((b) => b.badgeId);

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {BADGES.map((badge) => {
        const isEarned = earnedIds.includes(badge.id);
        return (
          <motion.div
            key={badge.id}
            className={`hacker-card p-4 flex flex-col items-center gap-2 text-center ${
              isEarned ? "opacity-100" : "opacity-40 grayscale"
            }`}
            variants={item}
          >
            <span className="text-2xl">{badge.icon}</span>
            <span className="text-xs font-[family-name:var(--font-geist-mono)] text-[var(--foreground)]">
              {badge.name}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
