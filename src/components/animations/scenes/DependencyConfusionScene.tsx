"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { ServerBox } from "../primitives/ServerBox";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function DependencyConfusionScene({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-4 h-[300px]">
        {/* package.json */}
        <div className="shrink-0">
          <motion.div
            className="rounded-lg border border-border/30 bg-zinc-900 p-3 space-y-2 w-48"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-[10px] text-zinc-500 font-mono">package.json</p>
            <div className="space-y-1">
              <div className="rounded bg-zinc-800 px-2 py-1">
                <span className="text-[10px] font-mono text-green-400">
                  &quot;@company/utils&quot;: &quot;^1.2.0&quot;
                </span>
              </div>
              <div className="rounded bg-zinc-800 px-2 py-1">
                <span className="text-[10px] font-mono text-zinc-400">
                  &quot;next&quot;: &quot;14.0.0&quot;
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Zone centrale */}
        <div className="flex-1 flex flex-col items-center gap-3">
          {/* npm cherche dans le registre public */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                className="w-full max-w-xs rounded-lg border border-orange-500/30 bg-zinc-900 p-3 text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] font-mono text-orange-400">
                  npm install
                </p>
                <motion.p
                  className="text-[10px] font-mono text-zinc-400 mt-1"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Recherche @company/utils sur npmjs.org...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Package malveillant trouvé */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="w-full max-w-xs rounded-lg border border-red-500/40 bg-zinc-900 p-3 space-y-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-red-400">
                    @company/utils
                  </span>
                  <span className="text-[10px] font-mono text-red-400 font-bold">
                    v99.0.0
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-500">
                    Registre privé
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    v1.2.0
                  </span>
                </div>
                <p className="text-[10px] font-mono text-red-400 text-center">
                  Version supérieure = installée en priorité
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Installation */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="w-full max-w-xs rounded-lg border border-red-500/30 bg-zinc-900 p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-[10px] font-mono text-zinc-500">
                  $ npm install
                </p>
                <motion.p
                  className="text-[10px] font-mono text-red-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  added 1 package (MALVEILLANT)
                </motion.p>
                <motion.p
                  className="text-[10px] font-mono text-red-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Running postinstall script...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exfiltration */}
          <AnimatePresence>
            {currentStep >= 4 && (
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <ShieldAlert className="h-5 w-5 text-red-400" />
                <span className="text-sm font-bold text-red-400">
                  Secrets exfiltrés via postinstall !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Attaquant / Serveur attaquant */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Attacker />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {currentStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ServerBox label="evil-server.com" status="danger" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* État initial */}
      <AnimatePresence>
        {currentStep < 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0 }}
          >
            <div className="text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-zinc-600 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Lance la démo pour voir l&apos;attaque
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimationStage>
  );
}
