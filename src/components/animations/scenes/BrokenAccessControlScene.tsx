"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { ServerBox } from "../primitives/ServerBox";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function BrokenAccessControlScene({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-6 h-[300px]">
        {/* Attaquant */}
        <AnimatePresence>
          {currentStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="shrink-0"
            >
              <Attacker />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone centrale */}
        <div className="flex-1 flex flex-col items-center gap-4">
          {/* URL normale */}
          <motion.div
            className="w-full max-w-md rounded-lg border border-border/30 bg-zinc-900 p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] text-muted-foreground font-mono mb-2">
              Barre d&apos;adresse
            </p>
            <div className="rounded bg-zinc-800 px-3 py-2">
              <AnimatePresence mode="wait">
                {currentStep < 1 ? (
                  <motion.code
                    key="normal"
                    className="text-xs font-mono text-zinc-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    GET /api/users/<span className="text-blue-400">123</span>
                    /data
                  </motion.code>
                ) : (
                  <motion.code
                    key="tampered"
                    className="text-xs font-mono text-zinc-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    GET /api/users/
                    <span className="text-red-400 font-bold">124</span>/data
                  </motion.code>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Serveur ne verifie pas */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="w-full max-w-md rounded-lg border border-yellow-500/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-yellow-400 font-mono mb-1">
                  Serveur (pas de verification) :
                </p>
                <code className="text-xs font-mono block">
                  <span className="text-zinc-500">
                    // Pas de check : user.id === params.id ?
                  </span>
                </code>
                <code className="text-xs font-mono block mt-1">
                  <span className="text-blue-400">supabase</span>
                  .from(<span className="text-green-400">&apos;data&apos;</span>
                  ) .select(
                  <span className="text-green-400">&apos;*&apos;</span>) .eq(
                  <span className="text-green-400">&apos;user_id&apos;</span>,{" "}
                  <span className="text-red-400">params.id</span>)
                </code>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Donnees de l'autre utilisateur */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="w-full max-w-md rounded-lg border border-orange-500/30 bg-zinc-900 p-3 space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-orange-400 font-mono">
                  Donnees de l&apos;utilisateur 124 retournees :
                </p>
                {[
                  '{"nom": "Alice Dupont", "email": "alice@secret.com"}',
                  '{"iban": "FR76 3000 4028 ...", "solde": "12,450€"}',
                ].map((line, i) => (
                  <motion.div
                    key={i}
                    className="text-xs font-mono text-zinc-300 bg-zinc-800 rounded px-2 py-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    {line}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Iteration sur les IDs */}
          <AnimatePresence>
            {currentStep >= 4 && (
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <div className="flex gap-2">
                  {[125, 126, 127, 128, "..."].map((id, i) => (
                    <motion.span
                      key={i}
                      className="text-xs font-mono px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      /{String(id)}
                    </motion.span>
                  ))}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40">
                  <ShieldAlert className="h-5 w-5 text-red-400" />
                  <span className="text-sm font-bold text-red-400">
                    Toute la base enumeree !
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Serveur */}
        <div className="shrink-0">
          <ServerBox
            label="API Next.js"
            status={currentStep >= 2 ? "danger" : "normal"}
          />
        </div>
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
