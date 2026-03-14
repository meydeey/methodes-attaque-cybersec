"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X } from "lucide-react";
import type { BadgeDefinition } from "@/lib/types";

type BadgeNotificationProps = {
  badge: BadgeDefinition | null;
  onDismiss: () => void;
};

export function BadgeNotification({
  badge,
  onDismiss,
}: BadgeNotificationProps) {
  useEffect(() => {
    if (!badge) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [badge, onDismiss]);

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 80, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={onDismiss}
          className="fixed bottom-6 right-6 z-50 max-w-sm cursor-pointer rounded-lg border border-[var(--hacker-green)] bg-[var(--hacker-surface)] p-4 shadow-[0_0_30px_rgba(0,255,65,0.2)]"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--hacker-green)]/10 text-2xl">
              {badge.icon}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-mono text-xs text-[var(--hacker-green)]">
                  <Award className="mr-1 inline h-3 w-3" />
                  Nouveau badge d&eacute;bloqu&eacute; !
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss();
                  }}
                  className="text-[#666] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm font-semibold text-white">{badge.name}</p>
              <p className="mt-0.5 text-xs text-[#999]">{badge.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
