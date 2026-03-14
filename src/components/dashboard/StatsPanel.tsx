"use client";

import { motion } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { useBadges } from "@/hooks/useBadges";
import { ALL_ATTACKS } from "@/lib/data/attacks";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StatsPanel() {
  const { progress, isLoaded } = useProgress();
  const { earnedCount, totalBadges } = useBadges(progress);

  if (!isLoaded) return null;

  const readCount = progress.completedAttacks.length;
  const totalAttacks = ALL_ATTACKS.length;
  const quizCount = progress.quizResults.length;

  const stats = [
    {
      label: "ATTAQUES LUES",
      value: readCount,
      total: totalAttacks,
      color: "var(--hacker-green)",
    },
    {
      label: "QUIZ VALIDÉS",
      value: quizCount,
      total: totalAttacks,
      color: "var(--hacker-medium)",
    },
    {
      label: "BADGES",
      value: earnedCount,
      total: totalBadges,
      color: "var(--hacker-badge)",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          className="hacker-card glow-hover p-5"
          variants={item}
        >
          <p
            className="text-xs font-[family-name:var(--font-geist-mono)] uppercase tracking-wider mb-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            {stat.label}
          </p>
          <p
            className="text-3xl font-bold font-[family-name:var(--font-geist-mono)]"
            style={{ color: stat.color }}
          >
            {stat.value}
            <span className="text-base text-[var(--muted-foreground)]">
              /{stat.total}
            </span>
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
