"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Browser({
  children,
  url = "https://example.com",
  className,
  highlight = false,
}: {
  children: React.ReactNode;
  url?: string;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "rounded-lg border overflow-hidden bg-zinc-900 w-full max-w-sm",
        highlight ? "border-red-500/50" : "border-border/30",
        className,
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border-b border-border/30">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 bg-zinc-700 rounded px-2 py-0.5">
          <span className="text-[10px] text-zinc-400 font-mono">{url}</span>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  );
}
