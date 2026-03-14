"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Attacker({
  label = "Attaquant",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("flex flex-col items-center gap-2", className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
        <span className="text-xl">🎭</span>
      </div>
      <span className="text-xs font-mono text-red-400">{label}</span>
    </motion.div>
  );
}
