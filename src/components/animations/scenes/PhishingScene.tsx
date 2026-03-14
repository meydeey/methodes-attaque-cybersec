"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { Browser } from "../primitives/Browser";
import { ShieldAlert, CheckCircle, Mail } from "lucide-react";

export function PhishingScene({ currentStep }: { currentStep: number }) {
  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-4 h-[300px]">
        {/* Zone centrale */}
        <div className="flex-1 flex flex-col items-center gap-3">
          {/* Email reçu */}
          <AnimatePresence>
            {currentStep >= 0 && (
              <motion.div
                className="w-full max-w-sm rounded-lg border border-border/30 bg-zinc-900 p-4 space-y-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-mono text-blue-400">
                    security@supabase.co
                  </span>
                </div>
                <p className="text-[10px] text-zinc-300 font-mono">
                  Alerte de sécurité — Connexion suspecte détectée sur votre
                  projet
                </p>
                <div className="rounded bg-zinc-800 px-2 py-1.5">
                  <AnimatePresence mode="wait">
                    {currentStep < 1 ? (
                      <motion.span
                        key="normal-url"
                        className="text-[10px] font-mono text-zinc-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Vérifier mon compte →
                      </motion.span>
                    ) : (
                      <motion.div
                        key="fake-url"
                        className="space-y-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="text-[10px] font-mono text-green-400">
                          supabase.co
                        </span>
                        <span className="text-[10px] font-mono text-red-400 font-bold">
                          .evil-security.com
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          /login
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Clic de la victime */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <motion.span
                  className="text-[10px] font-mono text-orange-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Clic sur le lien...
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page clonée */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <Browser url="supabase.co.evil-security.com/login" highlight>
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-400 font-mono">
                      Clone parfait — Page de login Supabase
                    </p>
                    <div className="rounded bg-zinc-800 px-2 py-1.5">
                      <span className="text-[10px] font-mono text-zinc-400">
                        admin@company.com
                      </span>
                    </div>
                    <div className="rounded bg-zinc-800 px-2 py-1.5">
                      <span className="text-[10px] font-mono text-zinc-400">
                        ••••••••••
                      </span>
                    </div>
                    <div className="rounded bg-green-600/80 px-2 py-1 text-center">
                      <span className="text-[10px] font-mono text-white">
                        Se connecter
                      </span>
                    </div>
                  </div>
                </Browser>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Credentials capturés */}
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
                  Identifiants capturés !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Attaquant */}
        <AnimatePresence>
          {currentStep >= 4 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="shrink-0 pt-8 flex flex-col items-center gap-2"
            >
              <Attacker />
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-[10px] font-mono text-red-400 block">
                  admin@company.com
                </span>
                <span className="text-[10px] font-mono text-red-400 block">
                  P@ssw0rd123
                </span>
              </motion.div>
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
