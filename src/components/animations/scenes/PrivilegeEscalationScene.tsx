"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { ServerBox } from "../primitives/ServerBox";
import { Database } from "../primitives/Database";
import { ShieldAlert, CheckCircle, Crown } from "lucide-react";

export function PrivilegeEscalationScene({
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
          {/* Requete normale */}
          <motion.div
            className="w-full max-w-md rounded-lg border border-border/30 bg-zinc-900 p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[10px] text-muted-foreground font-mono mb-2">
              PUT /api/profile
            </p>
            <div className="rounded bg-zinc-800 px-3 py-2">
              <AnimatePresence mode="wait">
                {currentStep < 1 ? (
                  <motion.code
                    key="normal"
                    className="text-xs font-mono block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {"{ "}
                    <span className="text-green-400">&quot;name&quot;</span>
                    {": "}
                    <span className="text-yellow-400">&quot;Bob&quot;</span>
                    {" }"}
                  </motion.code>
                ) : (
                  <motion.code
                    key="tampered"
                    className="text-xs font-mono block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {"{ "}
                    <span className="text-green-400">&quot;name&quot;</span>
                    {": "}
                    <span className="text-yellow-400">&quot;Bob&quot;</span>
                    {", "}
                    <span className="text-red-400 font-bold">
                      &quot;isAdmin&quot;
                    </span>
                    {": "}
                    <span className="text-red-400 font-bold">true</span>
                    {" }"}
                  </motion.code>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Serveur fait un spread naif */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="w-full max-w-md rounded-lg border border-yellow-500/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-yellow-400 font-mono mb-1">
                  Serveur (spread naif) :
                </p>
                <code className="text-xs font-mono block">
                  <span className="text-blue-400">await</span> supabase .from(
                  <span className="text-green-400">&apos;profiles&apos;</span>)
                </code>
                <code className="text-xs font-mono block ml-4">
                  .update(
                  <span className="text-red-400 font-bold">...req.body</span>)
                </code>
                <code className="text-xs font-mono block ml-4">
                  .eq(<span className="text-green-400">&apos;id&apos;</span>,
                  user.id)
                </code>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Champ ecrit en base */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="w-full max-w-md rounded-lg border border-orange-500/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-orange-400 font-mono mb-1">
                  Ecrit en base :
                </p>
                <div className="space-y-1">
                  <div className="text-xs font-mono text-zinc-300 bg-zinc-800 rounded px-2 py-1">
                    name:{" "}
                    <span className="text-yellow-400">&quot;Bob&quot;</span>
                  </div>
                  <motion.div
                    className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    isAdmin: <span className="font-bold">true</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Couronne admin */}
          <AnimatePresence>
            {currentStep >= 4 && (
              <motion.div
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <Crown className="h-6 w-6 text-yellow-400" />
                <ShieldAlert className="h-5 w-5 text-red-400" />
                <span className="text-sm font-bold text-red-400">
                  Droits admin obtenus !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Serveur + DB */}
        <div className="shrink-0 flex flex-col gap-4">
          <ServerBox
            label="API Next.js"
            status={currentStep >= 2 ? "danger" : "normal"}
          />
          <Database
            label="Supabase"
            status={currentStep >= 3 ? "danger" : "normal"}
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
