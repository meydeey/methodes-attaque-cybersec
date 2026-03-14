"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DataFlow({
  label,
  direction = "right",
  variant = "normal",
  className,
}: {
  label?: string;
  direction?: "right" | "left" | "down";
  variant?: "normal" | "danger" | "success";
  className?: string;
}) {
  const colorMap = {
    normal: "text-zinc-400",
    danger: "text-red-400",
    success: "text-green-400",
  };

  const arrowMap = {
    right: "→",
    left: "←",
    down: "↓",
  };

  const isHorizontal = direction !== "down";

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2",
        isHorizontal ? "flex-row" : "flex-col",
        colorMap[variant],
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={cn(
          "border-dashed",
          isHorizontal ? "border-t w-16" : "border-l h-8",
          variant === "danger"
            ? "border-red-500/50"
            : variant === "success"
              ? "border-green-500/50"
              : "border-zinc-600",
        )}
        initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
        animate={{ scaleX: 1, scaleY: 1 }}
        transition={{ duration: 0.4 }}
      />
      <span className="text-lg">{arrowMap[direction]}</span>
      {label && (
        <motion.span
          className="text-[10px] font-mono absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}
