"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Browser } from "../primitives/Browser";
import { Attacker } from "../primitives/Attacker";
import { ServerBox } from "../primitives/ServerBox";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function SsrfScene({ currentStep }: { currentStep: number }) {
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
          {/* Fonctionnalité import image */}
          <Browser url="https://app.com/settings/avatar">
            <div className="space-y-2">
              <p className="text-[10px] text-zinc-400 font-mono">
                Importer une image par URL :
              </p>
              <div className="rounded bg-zinc-800 px-2 py-1">
                <AnimatePresence mode="wait">
                  {currentStep < 1 ? (
                    <motion.span
                      key="normal"
                      className="text-[10px] font-mono text-zinc-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      https://images.com/photo.jpg
                    </motion.span>
                  ) : (
                    <motion.span
                      key="malicious"
                      className="text-[10px] font-mono text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      http://169.254.169.254/latest/meta-data/
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="rounded bg-zinc-700 px-3 py-1 text-center">
                <span className="text-[10px] font-mono text-zinc-300">
                  Importer
                </span>
              </div>
            </div>
          </Browser>

          {/* Serveur fetch l'URL interne */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ServerBox
                  label="Serveur Next.js"
                  status={currentStep >= 3 ? "danger" : "normal"}
                />
                <motion.div
                  className="text-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <span className="text-[10px] font-mono text-orange-400">
                    fetch(userUrl)
                  </span>
                  <div className="text-lg text-orange-400">→</div>
                </motion.div>
                <div className="p-3 rounded-lg border border-orange-500/30 bg-zinc-900">
                  <p className="text-[10px] font-mono text-orange-400">
                    169.254.169.254
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">
                    (métadonnées cloud)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Credentials exposés */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="w-full max-w-md rounded-lg border border-red-500/30 bg-zinc-900 p-3 space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-red-400 font-mono">
                  Credentials cloud exposés :
                </p>
                {[
                  "AccessKeyId: AKIA...",
                  "SecretAccessKey: wJalrX...",
                  "Token: FwoGZX...",
                ].map((cred, i) => (
                  <motion.div
                    key={cred}
                    className="text-xs font-mono text-red-300 bg-zinc-800 rounded px-2 py-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    {cred}
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
                  Infrastructure cloud compromise !
                </span>
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
