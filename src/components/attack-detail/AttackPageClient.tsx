"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Attack } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import { useBadges } from "@/hooks/useBadges";
import { AttackHeader } from "./AttackHeader";
import { ExplanationSection } from "./ExplanationSection";
import { DemoSection } from "./DemoSection";
import { ProtectionSection } from "./ProtectionSection";
import { QuizSection } from "./QuizSection";
import { PresenterControls } from "@/components/layout/PresenterControls";

const TABS = [
  { id: "comprendre", label: "Comprendre" },
  { id: "demo", label: "Démo" },
  { id: "proteger", label: "Se protéger" },
  { id: "quiz", label: "Quiz" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AttackPageClient({
  attack,
  prev,
  next,
}: {
  attack: Attack;
  prev: Attack | null;
  next: Attack | null;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("comprendre");
  const {
    markAsRead,
    markAnimationViewed,
    markProtectionsViewed,
    isQuizCompleted,
    progress,
    isLoaded,
  } = useProgress();
  const { newBadgeData, dismissBadge } = useBadges(progress);

  // Mark as read on mount
  useEffect(() => {
    markAsRead(attack.slug);
  }, [attack.slug, markAsRead]);

  // Track tab visits for progress
  useEffect(() => {
    if (activeTab === "demo") {
      markAnimationViewed(attack.slug);
    } else if (activeTab === "proteger") {
      markProtectionsViewed(attack.slug);
    }
  }, [activeTab, attack.slug, markAnimationViewed, markProtectionsViewed]);

  const quizDone = isQuizCompleted(attack.slug);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AttackHeader attack={attack} progress={progress} isLoaded={isLoaded} />

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-lg bg-[var(--hacker-bg)] border border-[var(--hacker-border)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
              "font-[family-name:var(--font-geist-mono)]",
              activeTab === tab.id
                ? "bg-[#002200] border border-[var(--hacker-green)] text-[var(--hacker-green)]"
                : "bg-[var(--hacker-surface)] border border-[#333] text-[#999] hover:text-[#ccc] hover:border-[#555]",
            )}
          >
            {tab.label}
            {tab.id === "quiz" && !quizDone && isLoaded && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-yellow-400" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "comprendre" && <ExplanationSection attack={attack} />}
          {activeTab === "demo" && <DemoSection attack={attack} />}
          {activeTab === "proteger" && <ProtectionSection attack={attack} />}
          {activeTab === "quiz" && <QuizSection attack={attack} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation footer */}
      <PresenterControls prev={prev} next={next} />

      {/* Badge notification */}
      <AnimatePresence>
        {newBadgeData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-20 right-4 z-50"
          >
            <div className="hacker-card p-4 border-[var(--hacker-green)] flex items-center gap-3">
              <span className="text-2xl">{newBadgeData.icon}</span>
              <div>
                <p className="text-xs text-[var(--hacker-green)] font-[family-name:var(--font-geist-mono)]">
                  Badge débloqué !
                </p>
                <p className="text-sm font-semibold text-white">
                  {newBadgeData.name}
                </p>
              </div>
              <button
                onClick={dismissBadge}
                className="ml-2 text-[#666] hover:text-white text-xs"
              >
                x
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
