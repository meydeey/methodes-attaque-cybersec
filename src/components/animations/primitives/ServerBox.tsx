"use client";

import { motion } from "framer-motion";
import { Server } from "lucide-react";
import { cn } from "@/lib/utils";

export function ServerBox({
  label = "Serveur",
  className,
  status = "normal",
}: {
  label?: string;
  className?: string;
  status?: "normal" | "danger" | "success";
}) {
  const statusColors = {
    normal: "border-border/30 text-zinc-400",
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
      <Server className="h-8 w-8" />
      <span className="text-xs font-mono">{label}</span>
    </motion.div>
  );
}
