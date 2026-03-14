"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { ServerBox } from "../primitives/ServerBox";
import { ShieldAlert, CheckCircle } from "lucide-react";

export function WebhookPoisoningScene({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-4 h-[300px]">
        {/* Sources de webhooks */}
        <div className="shrink-0 flex flex-col items-center gap-4 pt-4">
          {/* Webhook légitime Stripe */}
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="p-3 rounded-lg border border-green-500/30 bg-zinc-900">
              <span className="text-[10px] font-mono text-green-400">
                Stripe
              </span>
            </div>
            <span className="text-[10px] text-green-400 font-mono">
              Légitime
            </span>
          </motion.div>

          {/* Attaquant */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Attacker label="Attaquant" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zone centrale — Webhooks */}
        <div className="flex-1 flex flex-col items-center gap-3">
          {/* Webhook légitime */}
          <motion.div
            className="w-full max-w-sm rounded-lg border border-green-500/30 bg-zinc-900 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-mono text-green-400">
                POST /api/webhooks/stripe
              </span>
            </div>
            <div className="rounded bg-zinc-800 px-2 py-1">
              <p className="text-[10px] font-mono text-zinc-400">
                {"{"}type: &quot;checkout.session.completed&quot;{"}"}
              </p>
              <p className="text-[10px] font-mono text-green-400">
                stripe-signature: whsec_...abc123
              </p>
            </div>
          </motion.div>

          {/* Webhook forgé */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                className="w-full max-w-sm rounded-lg border border-red-500/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[10px] font-mono text-red-400">
                    POST /api/webhooks/stripe (forge)
                  </span>
                </div>
                <div className="rounded bg-zinc-800 px-2 py-1 border border-red-500/20">
                  <p className="text-[10px] font-mono text-red-400">
                    {"{"}type: &quot;checkout.session.completed&quot;, amount: 0
                    {"}"}
                  </p>
                  <p className="text-[10px] font-mono text-red-400">
                    stripe-signature: (absent ou faux)
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Serveur traite les deux */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ServerBox
                  label="Serveur n8n"
                  status={currentStep >= 3 ? "danger" : "normal"}
                />
                <motion.div
                  className="text-center space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-[10px] font-mono text-orange-400">
                    Aucune verification
                  </p>
                  <p className="text-[10px] font-mono text-orange-400">
                    de signature !
                  </p>
                  <motion.p
                    className="text-[10px] font-mono text-red-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    Les deux webhooks sont traites
                  </motion.p>
                </motion.div>
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
                  Commande validée sans paiement !
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
