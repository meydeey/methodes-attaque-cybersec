"use client";

import { motion } from "framer-motion";
import { CategoryGrid } from "@/components/dashboard/CategoryGrid";
import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { BadgeShowcase } from "@/components/dashboard/BadgeShowcase";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <StatsPanel />

      <div className="space-y-4">
        <motion.h2
          className="font-[family-name:var(--font-geist-mono)] text-[var(--hacker-green)] text-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[var(--muted-foreground)]">
            root@cybersec:~$
          </span>{" "}
          ls attacks/
          <span className="terminal-cursor" />
        </motion.h2>
        <CategoryGrid />
      </div>

      <div className="space-y-4">
        <h2 className="font-[family-name:var(--font-geist-mono)] text-[var(--hacker-badge)] text-sm uppercase tracking-wider">
          // Badges
        </h2>
        <BadgeShowcase />
      </div>
    </div>
  );
}
