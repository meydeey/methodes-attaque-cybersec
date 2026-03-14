"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { ServerBox } from "../primitives/ServerBox";
import { ShieldAlert, CheckCircle, DoorOpen } from "lucide-react";

export function SecurityMisconfigScene({
  currentStep,
}: {
  currentStep: number;
}) {
  const configItems = [
    {
      step: 1,
      label: "CORS",
      value: "Access-Control-Allow-Origin: *",
      status: "Ouvert à tous",
    },
    {
      step: 2,
      label: "Debug",
      value: "NEXT_PUBLIC_DEBUG=true",
      status: "Stack traces exposées",
    },
    {
      step: 3,
      label: "Headers",
      value: "CSP / HSTS / X-Frame-Options",
      status: "Manquants",
    },
  ];

  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-4 h-[300px]">
        {/* Serveur */}
        <div className="shrink-0 pt-4">
          <ServerBox
            label="Serveur Next.js"
            status={currentStep >= 4 ? "danger" : "normal"}
          />
        </div>

        {/* Zone centrale — Checklist de configuration */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {/* Checklist */}
          <motion.div
            className="w-full max-w-sm rounded-lg border border-border/30 bg-zinc-900 p-3 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-[10px] text-zinc-500 font-mono">
              Checklist de sécurité
            </p>

            {configItems.map((item) => (
              <motion.div
                key={item.label}
                className={`rounded px-3 py-2 flex items-center justify-between border ${
                  currentStep >= item.step
                    ? "border-red-500/40 bg-red-500/5"
                    : "border-border/20 bg-zinc-800"
                }`}
                animate={
                  currentStep >= item.step
                    ? { borderColor: "rgba(239, 68, 68, 0.4)" }
                    : {}
                }
              >
                <div>
                  <span className="text-[10px] font-mono text-zinc-300 block">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {item.value}
                  </span>
                </div>
                <AnimatePresence>
                  {currentStep >= item.step && (
                    <motion.div
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <DoorOpen className="h-4 w-4 text-red-400" />
                      <span className="text-[10px] font-mono text-red-400">
                        {item.status}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Attaquant entre */}
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
                  Serveur compromis par les failles de config !
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
              className="shrink-0 pt-4"
            >
              <Attacker />
              <AnimatePresence>
                {currentStep >= 4 && (
                  <motion.div
                    className="mt-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-[10px] font-mono text-red-400 block">
                      3 portes ouvertes
                    </span>
                    <span className="text-[10px] font-mono text-red-400 block">
                      = accès total
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
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
