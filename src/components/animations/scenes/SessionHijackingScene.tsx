"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { Browser } from "../primitives/Browser";
import { ShieldAlert, CheckCircle, Wifi, Cookie } from "lucide-react";

export function SessionHijackingScene({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <AnimationStage>
      <div className="flex flex-col items-center gap-4 h-[300px]">
        {/* Ligne du haut : User A + Wi-Fi + Attaquant */}
        <div className="flex items-start justify-between w-full gap-4">
          {/* Utilisateur A */}
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <span className="text-xs font-mono text-blue-400">User A</span>
            {/* Cookie */}
            <AnimatePresence>
              {currentStep >= 0 && (
                <motion.div
                  className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Cookie className="h-3 w-3 text-blue-400" />
                  <span className="text-[10px] font-mono text-blue-400">
                    session=abc123
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Wi-Fi partage */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                className="flex flex-col items-center gap-2 mt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                  <Wifi className="h-8 w-8 text-yellow-400" />
                </div>
                <span className="text-[10px] font-mono text-yellow-400">
                  Wi-Fi public
                </span>
                <span className="text-[10px] font-mono text-yellow-400/60">
                  non chiffre
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attaquant */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="shrink-0"
              >
                <Attacker />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interception du cookie */}
        <AnimatePresence>
          {currentStep >= 2 && (
            <motion.div
              className="flex items-center gap-3 px-4 py-2 rounded-lg border border-red-500/30 bg-zinc-900"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Cookie className="h-4 w-4 text-red-400" />
              <div>
                <p className="text-[10px] text-red-400 font-mono">
                  Cookie intercepte :
                </p>
                <code className="text-xs font-mono text-red-300">
                  Set-Cookie: session=abc123
                </code>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cookie colle dans le navigateur de l'attaquant */}
        <AnimatePresence>
          {currentStep >= 3 && (
            <motion.div
              className="w-full max-w-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Browser url="https://app.com/dashboard" highlight>
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground font-mono">
                    DevTools &gt; Application &gt; Cookies
                  </p>
                  <div className="rounded bg-zinc-800 px-2 py-1">
                    <code className="text-xs font-mono text-red-400">
                      session = abc123 (colle)
                    </code>
                  </div>
                </div>
              </Browser>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alerte finale */}
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
                Connecte comme User A !
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Etat initial */}
      <AnimatePresence>
        {currentStep < 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0 }}
          >
            <div className="text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-zinc-600 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Lance la demo pour voir l&apos;attaque
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimationStage>
  );
}
