"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Browser } from "../primitives/Browser";
import { Attacker } from "../primitives/Attacker";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function CsrfScene({ currentStep }: { currentStep: number }) {
  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-4 h-[300px]">
        {/* Navigateur victime — banque */}
        <div className="flex-1 flex flex-col items-center gap-3">
          <Browser url="https://mabanque.fr/compte">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-mono text-green-400">
                  Connecté — Session active
                </span>
              </div>
              <div className="rounded bg-zinc-800 px-2 py-1">
                <span className="text-[10px] font-mono text-zinc-400">
                  Solde : 5 000 EUR
                </span>
              </div>
              <AnimatePresence>
                {currentStep >= 3 && (
                  <motion.div
                    className="rounded bg-zinc-800 px-2 py-1 border border-orange-500/40"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="text-[10px] font-mono text-orange-400">
                      Cookie: session=abc123 (envoi auto)
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Browser>

          {/* Site malveillant */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                className="w-full max-w-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Browser url="https://super-promo.evil.com" highlight>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-zinc-400">
                      Gagnez un iPhone !
                    </span>
                    <AnimatePresence>
                      {currentStep >= 2 && (
                        <motion.div
                          className="rounded bg-zinc-800 px-2 py-1 border border-red-500/40"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className="text-[10px] font-mono text-red-400">
                            &lt;form action=&quot;mabanque.fr/transfer&quot;
                            method=&quot;POST&quot;&gt;
                          </p>
                          <p className="text-[10px] font-mono text-red-400 pl-2">
                            &lt;input name=&quot;to&quot;
                            value=&quot;attaquant&quot; hidden /&gt;
                          </p>
                          <p className="text-[10px] font-mono text-red-400 pl-2">
                            &lt;input name=&quot;amount&quot;
                            value=&quot;5000&quot; hidden /&gt;
                          </p>
                          <p className="text-[10px] font-mono text-red-400">
                            &lt;/form&gt;
                            &lt;script&gt;form.submit()&lt;/script&gt;
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Browser>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flèche POST */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  className="text-[10px] font-mono text-red-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  POST /transfer + Cookie auto
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Résultat */}
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
                  Virement de 5 000 EUR vers l&apos;attaquant !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Attaquant */}
        <AnimatePresence>
          {currentStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
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
