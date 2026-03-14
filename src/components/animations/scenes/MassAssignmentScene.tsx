"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Browser } from "../primitives/Browser";
import { Attacker } from "../primitives/Attacker";
import { Database } from "../primitives/Database";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function MassAssignmentScene({ currentStep }: { currentStep: number }) {
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
          {/* Formulaire de profil */}
          <Browser url="https://app.com/settings/profile">
            <div className="space-y-2">
              <p className="text-[10px] text-zinc-400 font-mono mb-1">
                Mon Profil
              </p>
              <div className="rounded bg-zinc-800 px-2 py-1">
                <span className="text-[10px] font-mono text-zinc-400">
                  Nom : Jean Dupont
                </span>
              </div>
              <div className="rounded bg-zinc-800 px-2 py-1">
                <span className="text-[10px] font-mono text-zinc-400">
                  Email : jean@mail.com
                </span>
              </div>
              <div className="rounded bg-zinc-700 px-3 py-1 text-center">
                <span className="text-[10px] font-mono text-zinc-300">
                  Sauvegarder
                </span>
              </div>
            </div>
          </Browser>

          {/* DevTools — body modifié */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                className="w-full max-w-sm rounded-lg border border-orange-500/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-orange-400 font-mono mb-1">
                  DevTools — Network — Request Body :
                </p>
                <div className="rounded bg-zinc-800 px-2 py-1 space-y-0.5">
                  <p className="text-[10px] font-mono text-zinc-400">{"{"}</p>
                  <p className="text-[10px] font-mono text-zinc-400 pl-2">
                    &quot;name&quot;: &quot;Jean Dupont&quot;,
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400 pl-2">
                    &quot;email&quot;: &quot;jean@mail.com&quot;,
                  </p>
                  <AnimatePresence>
                    {currentStep >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                      >
                        <p className="text-[10px] font-mono text-red-400 pl-2">
                          &quot;role&quot;: &quot;admin&quot;,
                        </p>
                        <p className="text-[10px] font-mono text-red-400 pl-2">
                          &quot;balance&quot;: 999999,
                        </p>
                        <p className="text-[10px] font-mono text-red-400 pl-2">
                          &quot;is_verified&quot;: true
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-[10px] font-mono text-zinc-400">{"}"}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Serveur accepte */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="text-center space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  className="text-[10px] font-mono text-orange-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  supabase.from(&quot;users&quot;).update(req.body)
                </motion.span>
                <p className="text-[10px] font-mono text-red-400">
                  Tous les champs acceptes sans filtrage !
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Résultat final */}
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
                  Admin + 999 999 de solde !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Base de données */}
        <div className="shrink-0 pt-8">
          <Database
            label="Supabase"
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
