"use client";

import { motion } from "framer-motion";
import { Database as DatabaseIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Database({
  label = "Base de données",
  className,
  status = "normal",
}: {
  label?: string;
  className?: string;
  status?: "normal" | "danger" | "success";
}) {
  const statusColors = {
    normal: "border-border/30 text-blue-400",
    danger: "border-red-500/50 text-red-400",
    success: "border-green-500/50 text-green-400",
  };

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-lg border bg-zinc-900",
        statusColors[status],
        className,
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DatabaseIcon className="h-8 w-8" />
      <span className="text-xs font-mono">{label}</span>
    </motion.div>
  );
}
