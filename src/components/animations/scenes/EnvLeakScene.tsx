"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function EnvLeakScene({ currentStep }: { currentStep: number }) {
  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-4 h-[300px]">
        {/* Fichier .env */}
        <div className="shrink-0">
          <motion.div
            className="rounded-lg border border-border/30 bg-zinc-900 p-3 space-y-1 w-56"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-[10px] text-zinc-500 font-mono">.env</p>
            {[
              { key: "SUPABASE_SERVICE_ROLE_KEY", value: "eyJhbG...x8kQ" },
              { key: "N8N_API_KEY", value: "n8n_api_7f3..." },
              { key: "STRIPE_SECRET_KEY", value: "sk_live_4eC..." },
            ].map((env, i) => (
              <motion.div
                key={env.key}
                className="rounded bg-zinc-800 px-2 py-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.2 }}
              >
                <span className="text-[10px] font-mono text-yellow-400">
                  {env.key}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  ={env.value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Zone centrale */}
        <div className="flex-1 flex flex-col items-center gap-3">
          {/* git add . */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                className="w-full max-w-xs rounded-lg border border-orange-500/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] font-mono text-zinc-500">
                  $ git add .
                </p>
                <p className="text-[10px] font-mono text-orange-400 mt-1">
                  .gitignore manquant !
                </p>
                <p className="text-[10px] font-mono text-red-400 mt-1">
                  .env ajouté au staging
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Push to GitHub */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="w-full max-w-xs rounded-lg border border-border/30 bg-zinc-900 p-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-[10px] font-mono text-zinc-500">
                  $ git push origin main
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
                    <span className="text-[10px]">📦</span>
                  </div>
                  <motion.span
                    className="text-zinc-500"
                    animate={{ x: [0, 20, 40] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                  >
                    →
                  </motion.span>
                  <div className="rounded bg-zinc-800 px-2 py-1">
                    <span className="text-[10px] font-mono text-zinc-400">
                      GitHub (public)
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bot scanne */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="w-full max-w-xs rounded-lg border border-red-500/30 bg-zinc-900 p-3 space-y-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-[10px] font-mono text-red-400">
                  Bot automatisé scanne les commits publics...
                </p>
                {["SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY"].map(
                  (key, i) => (
                    <motion.div
                      key={key}
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.4 }}
                    >
                      <span className="text-[10px] text-red-400">✓</span>
                      <span className="text-[10px] font-mono text-red-400">
                        {key} trouvée
                      </span>
                    </motion.div>
                  ),
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exploitation */}
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
                  Clés exploitées en 5 minutes !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Attaquant */}
        <AnimatePresence>
          {currentStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="shrink-0 pt-8"
            >
              <Attacker />
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
