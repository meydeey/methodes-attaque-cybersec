"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { ServerBox } from "../primitives/ServerBox";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function RateLimitBypassScene({ currentStep }: { currentStep: number }) {
  return (
    <AnimationStage>
      <div className="flex items-center justify-between gap-6 h-[300px]">
        {/* Attaquant */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <AnimatePresence>
            {currentStep >= 0 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Attacker />
              </motion.div>
            )}
          </AnimatePresence>

          {/* IPs multiples */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {["IP: 45.33.x.x", "IP: 91.12.x.x", "IP: 178.5.x.x"].map(
                  (ip, i) => (
                    <motion.div
                      key={ip}
                      className="text-[10px] font-mono text-orange-400 bg-zinc-800 rounded px-2 py-0.5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      {ip}
                    </motion.div>
                  ),
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zone centrale — Rate limit wall */}
        <div className="flex-1 flex flex-col items-center gap-4">
          {/* Mur de rate limiting */}
          <motion.div
            className="w-full max-w-xs rounded-lg border bg-zinc-900 p-4 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              borderColor:
                currentStep >= 2
                  ? "rgba(239, 68, 68, 0.5)"
                  : "rgba(59, 130, 246, 0.5)",
            }}
          >
            <p className="text-xs text-muted-foreground font-mono mb-2">
              Rate Limiter
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-zinc-400">Limite :</span>
                <span className="text-blue-400">100 req/min</span>
              </div>
              <AnimatePresence mode="wait">
                {currentStep < 1 ? (
                  <motion.div
                    key="ok"
                    className="flex justify-between text-[10px] font-mono"
                    exit={{ opacity: 0 }}
                  >
                    <span className="text-zinc-400">Statut :</span>
                    <span className="text-green-400">OK (23/100)</span>
                  </motion.div>
                ) : currentStep < 2 ? (
                  <motion.div
                    key="blocked"
                    className="flex justify-between text-[10px] font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="text-zinc-400">Statut :</span>
                    <span className="text-red-400">
                      BLOQUE (429 Too Many Requests)
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="bypassed"
                    className="flex justify-between text-[10px] font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-zinc-400">Statut :</span>
                    <motion.span
                      className="text-orange-400"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      CONTOURNE
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Headers falsifiés */}
            <AnimatePresence>
              {currentStep >= 2 && (
                <motion.div
                  className="rounded bg-zinc-800 px-2 py-1 border border-red-500/40 space-y-0.5"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-[10px] font-mono text-red-400">
                    X-Forwarded-For: {"{IP aleatoire}"}
                  </p>
                  <p className="text-[10px] font-mono text-red-400">
                    X-Real-IP: {"{IP aleatoire}"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Requêtes qui passent */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="w-full max-w-xs space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <motion.div
                    key={n}
                    className="flex items-center gap-2 text-[10px] font-mono"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: n * 0.1 }}
                  >
                    <span className="text-red-400">→</span>
                    <span className="text-zinc-400">
                      POST /api/auth/login (tentative #{n * 100})
                    </span>
                    <span className="text-green-400">200</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alerte finale */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <ShieldAlert className="h-5 w-5 text-red-400" />
                <span className="text-sm font-bold text-red-400">
                  Brute-force illimité en cours !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Serveur API */}
        <div className="shrink-0">
          <ServerBox
            label="API Next.js"
            status={currentStep >= 3 ? "danger" : "normal"}
          />
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
