"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function ClickjackingScene({ currentStep }: { currentStep: number }) {
  return (
    <AnimationStage>
      <div className="flex flex-col items-center gap-4 h-[300px]">
        {/* Page attractive avec overlay */}
        <div className="relative w-full max-w-sm">
          {/* Page visible (appât) */}
          <motion.div
            className="rounded-lg border border-yellow-500/30 bg-zinc-900 p-6 text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg font-bold text-yellow-400">
              🎉 Gagnez 1000&euro; !
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">
              Cliquez sur le bouton pour participer au tirage au sort
            </p>
            <div className="rounded bg-yellow-500/80 px-4 py-2 cursor-pointer">
              <span className="text-sm font-bold text-black">
                Participer maintenant
              </span>
            </div>
          </motion.div>

          {/* Overlay transparent qui se révèle progressivement */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-red-500/60 bg-red-500/5 p-6 text-center space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentStep >= 2 ? 1 : 0.4 }}
                transition={{ duration: 1 }}
              >
                <p className="text-[10px] text-red-400 font-mono">
                  iframe invisible (opacity: 0)
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  dashboard.supabase.com/project/settings
                </p>

                <AnimatePresence>
                  {currentStep >= 2 && (
                    <motion.div
                      className="rounded bg-red-600/80 px-4 py-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="text-sm font-bold text-white">
                        Supprimer mon projet
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Victime clique */}
        <AnimatePresence>
          {currentStep >= 3 && (
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <motion.span
                className="text-[10px] font-mono text-orange-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                Clic sur &quot;Participer&quot;...
              </motion.span>
              <span className="text-[10px] font-mono text-red-400">
                = Clic sur &quot;Supprimer mon projet&quot;
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action exécutée */}
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
                Projet supprimé ! Action irréversible.
              </span>
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
