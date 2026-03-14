"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AnimationStage } from "../AnimationStage";
import { Attacker } from "../primitives/Attacker";
import { ServerBox } from "../primitives/ServerBox";
import { ShieldAlert, CheckCircle } from "lucide-react";

const leakedCredentials = [
  { email: "alice@mail.com", pass: "alice123" },
  { email: "bob@work.fr", pass: "bob2024!" },
  { email: "carol@pro.io", pass: "qwerty" },
  { email: "dave@corp.net", pass: "P@ssw0rd" },
  { email: "eve@hack.org", pass: "letmein" },
];

const results = [
  { email: "alice@mail.com", success: false },
  { email: "bob@work.fr", success: false },
  { email: "carol@pro.io", success: true },
  { email: "dave@corp.net", success: false },
  { email: "eve@hack.org", success: true },
];

export function CredentialStuffingScene({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <AnimationStage>
      <div className="flex items-start justify-between gap-6 h-[300px]">
        {/* Attaquant + Bot */}
        <div className="shrink-0 flex flex-col items-center gap-3">
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Attacker label="Bot" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zone centrale */}
        <div className="flex-1 flex flex-col items-center gap-4">
          {/* Liste des identifiants voles */}
          <AnimatePresence>
            {currentStep >= 0 && (
              <motion.div
                className="w-full max-w-sm rounded-lg border border-border/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-muted-foreground font-mono mb-2">
                  leaked_credentials.csv (2.3M lignes)
                </p>
                <div className="space-y-1 max-h-[100px] overflow-hidden">
                  {leakedCredentials.map((cred, i) => (
                    <motion.div
                      key={cred.email}
                      className="text-xs font-mono text-zinc-400 bg-zinc-800 rounded px-2 py-0.5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {cred.email} : {cred.pass}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Requetes en rafale */}
          <AnimatePresence>
            {currentStep >= 1 && (
              <motion.div
                className="w-full max-w-sm rounded-lg border border-yellow-500/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-yellow-400 font-mono mb-1">
                  POST /api/auth/login (x1000/min)
                </p>
                {leakedCredentials.slice(0, 3).map((cred, i) => (
                  <motion.div
                    key={cred.email}
                    className="text-[10px] font-mono text-zinc-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5] }}
                    transition={{ delay: i * 0.2, duration: 0.5 }}
                  >
                    → {cred.email}...
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resultats : echecs et succes */}
          <AnimatePresence>
            {currentStep >= 2 && (
              <motion.div
                className="w-full max-w-sm rounded-lg border border-border/30 bg-zinc-900 p-3 space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-muted-foreground font-mono mb-1">
                  Resultats :
                </p>
                {results.map((r, i) => (
                  <motion.div
                    key={r.email}
                    className={`text-xs font-mono rounded px-2 py-0.5 ${
                      r.success
                        ? "text-green-400 bg-green-500/10 border border-green-500/20"
                        : "text-red-400/50 bg-zinc-800"
                    }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    {r.success ? "✓" : "✗"} {r.email} —{" "}
                    {r.success ? "200 OK" : "401"}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comptes compromis */}
          <AnimatePresence>
            {currentStep >= 3 && (
              <motion.div
                className="w-full max-w-sm rounded-lg border border-green-500/30 bg-zinc-900 p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[10px] text-green-400 font-mono">
                  2 comptes compromis sur 5 tentatives (40%)
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alerte finale */}
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
                  Comptes compromis, donnees exfiltrees !
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Serveur */}
        <div className="shrink-0">
          <ServerBox
            label="API Auth"
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
