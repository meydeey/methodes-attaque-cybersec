"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Browser } from "../primitives/Browser";
import { Attacker } from "../primitives/Attacker";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function XssScene({ currentStep }: { currentStep: number }) {
  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-4 h-[300px]">
        {/* Attaquant */}
        <AnimatePresence>
          {currentStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="shrink-0 pt-8"
            >
              <Attacker />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone centrale */}
        <div className="flex-1 flex flex-col items-center gap-3">
          {/* Page web avec commentaires */}
          <Browser url="https://app.com/blog/article">
            <div className="space-y-2">
              <p className="text-[10px] text-zinc-400">Commentaires :</p>
              <div className="rounded bg-zinc-800 px-2 py-1">
                <span className="text-[10px] font-mono text-zinc-400">
                  Super article, merci !
                </span>
              </div>
              <AnimatePresence>
                {currentStep >= 1 && (
                  <motion.div
                    className="rounded bg-zinc-800 px-2 py-1 border border-red-500/40"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="text-[10px] font-mono text-red-400">
                      &lt;script&gt;steal(document.cookie)&lt;/script&gt;
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Browser>

          {/* Script stocké en DB */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-[10px] font-mono text-orange-400">
                  Script stocké en base de données
                </span>
                <div className="text-lg">↓</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Victime charge la page */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono">
                    Victime
                  </span>
                </div>
                <motion.div
                  className="text-red-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <span className="text-[10px] font-mono">
                    ⚡ Script exécuté !
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cookie volé */}
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
                  Cookie de session volé !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Serveur attaquant */}
        <AnimatePresence>
          {currentStep >= 4 && (
            <motion.div
              className="shrink-0 pt-8 flex flex-col items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-3 rounded-lg border border-red-500/30 bg-zinc-900">
                <span className="text-[10px] font-mono text-red-400">
                  evil.com
                </span>
              </div>
              <span className="text-[10px] text-red-400">🍪 → attaquant</span>
            </motion.div>
          )}
        </AnimatePresence>
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
