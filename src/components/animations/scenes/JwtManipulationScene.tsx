"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { ServerBox } from "../primitives/ServerBox";
import { ShieldAlert, CheckCircle } from "lucide-react";

const jwtParts = [
  {
    label: "Header",
    color: "text-red-400",
    content: '{"alg":"HS256","typ":"JWT"}',
  },
  {
    label: "Payload",
    color: "text-purple-400",
    content: '{"sub":"1234","role":"user"}',
  },
  { label: "Signature", color: "text-cyan-400", content: "HMACSHA256(...)" },
];

export function JwtManipulationScene({ currentStep }: { currentStep: number }) {
  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-6 h-[300px]">
        {/* Attaquant */}
        <AnimatePresence>
          {currentStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="shrink-0 pt-4"
            >
              <Attacker />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone centrale — Token JWT */}
        <div className="flex-1 flex flex-col items-center gap-4">
          {/* Token JWT */}
          <motion.div
            className="w-full max-w-md rounded-lg border border-border/30 bg-zinc-900 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs text-muted-foreground font-mono mb-3">
              Token JWT
            </p>
            <div className="flex items-center gap-1 font-mono text-xs flex-wrap">
              {jwtParts.map((part, i) => (
                <span key={part.label}>
                  <motion.span
                    className={part.color}
                    animate={
                      currentStep >= 2 && i === 1
                        ? {
                            scale: [1, 1.1, 1],
                            backgroundColor: [
                              "transparent",
                              "rgba(168, 85, 247, 0.2)",
                              "transparent",
                            ],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.5,
                      repeat: currentStep === 2 ? Infinity : 0,
                      repeatDelay: 1,
                    }}
                  >
                    {currentStep >= 2 && i === 1
                      ? '{"sub":"1234","role":"admin"}'
                      : currentStep >= 3 && i === 0
                        ? '{"alg":"none","typ":"JWT"}'
                        : part.content}
                  </motion.span>
                  {i < 2 && <span className="text-zinc-600">.</span>}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Étape décodage */}
          <AnimatePresence>
            {currentStep >= 1 && currentStep < 2 && (
              <motion.div
                className="px-3 py-1.5 rounded bg-zinc-800 border border-border/30"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-[10px] font-mono text-zinc-400">
                  Base64 décodé — contenu lisible en clair
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modification du rôle */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="flex items-center gap-3 px-3 py-2 rounded bg-purple-500/10 border border-purple-500/30"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-xs font-mono">
                  <span className="text-zinc-400 line-through">
                    role: &quot;user&quot;
                  </span>
                  <span className="text-purple-400 ml-2 font-bold">
                    → role: &quot;admin&quot;
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Algorithme none */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="flex items-center gap-3 px-3 py-2 rounded bg-red-500/10 border border-red-500/30"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-xs font-mono">
                  <span className="text-zinc-400 line-through">
                    alg: &quot;HS256&quot;
                  </span>
                  <span className="text-red-400 ml-2 font-bold">
                    → alg: &quot;none&quot;
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Accès obtenu */}
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
                  Accès admin accordé !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Serveur */}
        <div className="shrink-0 pt-4">
          <ServerBox
            label="API Server"
            status={currentStep >= 4 ? "danger" : "normal"}
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
