"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { Database } from "../primitives/Database";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function SqlInjectionScene({ currentStep }: { currentStep: number }) {
  return (
    <AnimationStage>
      <div className="flex items-center justify-between gap-6 h-[300px]">
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

        {/* Zone centrale — Formulaire + Requête */}
        <div className="flex-1 flex flex-col items-center gap-4">
          {/* Formulaire de login */}
          <motion.div
            className="w-full max-w-xs rounded-lg border border-border/30 bg-zinc-900 p-4 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs text-muted-foreground font-mono mb-2">
              Formulaire de Login
            </p>
            <div className="space-y-2">
              <div className="rounded bg-zinc-800 px-3 py-2">
                <AnimatePresence mode="wait">
                  {currentStep < 1 ? (
                    <motion.span
                      key="normal"
                      className="text-xs font-mono text-zinc-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      admin@company.com
                    </motion.span>
                  ) : (
                    <motion.span
                      key="malicious"
                      className="text-xs font-mono text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      &apos; OR 1=1 --
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="rounded bg-zinc-800 px-3 py-2">
                <span className="text-xs font-mono text-zinc-400">
                  ••••••••
                </span>
              </div>
              <div className="rounded bg-zinc-700 px-3 py-1.5 text-center">
                <span className="text-xs font-mono text-zinc-300">
                  Se connecter
                </span>
              </div>
            </div>
          </motion.div>

          {/* Requête SQL générée */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="w-full max-w-md rounded-lg border border-red-500/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-muted-foreground font-mono mb-1">
                  Requête SQL construite :
                </p>
                <code className="text-xs font-mono block">
                  <span className="text-blue-400">SELECT * FROM</span>{" "}
                  <span className="text-green-400">users</span>{" "}
                  <span className="text-blue-400">WHERE</span> username ={" "}
                  <span className="text-red-400 font-bold">
                    &apos;&apos; OR 1=1 --
                  </span>
                </code>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Résultat */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="w-full max-w-md rounded-lg border border-orange-500/30 bg-zinc-900 p-3 space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-orange-400 font-mono">
                  Résultat : TOUS les utilisateurs retournés
                </p>
                {[
                  "admin@company.com (admin)",
                  "user1@company.com",
                  "user2@company.com",
                  "...",
                ].map((user, i) => (
                  <motion.div
                    key={user}
                    className="text-xs font-mono text-zinc-300 bg-zinc-800 rounded px-2 py-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    {user}
                  </motion.div>
                ))}
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
                  Accès admin obtenu !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Base de données */}
        <div className="shrink-0">
          <Database
            label="PostgreSQL"
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
