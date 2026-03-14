import { BadgeDefinition, UserProgress } from "@/lib/types";
import { ALL_ATTACKS } from "./attacks";

export const BADGES: BadgeDefinition[] = [
  {
    id: "first-step",
    name: "Premier Pas",
    description: "Lire ta première attaque",
    icon: "🔰",
  },
  {
    id: "injection-master",
    name: "Injection Master",
    description: "Compléter toutes les attaques Injection",
    icon: "🧠",
  },
  {
    id: "auth-expert",
    name: "Auth Expert",
    description: "Compléter toutes les attaques Auth",
    icon: "🔐",
  },
  {
    id: "access-controller",
    name: "Access Controller",
    description: "Compléter toutes les attaques Contrôle d'Accès",
    icon: "🚧",
  },
  {
    id: "api-guardian",
    name: "API Guardian",
    description: "Compléter toutes les attaques API & Infra",
    icon: "🌐",
  },
  {
    id: "social-shield",
    name: "Social Shield",
    description: "Compléter toutes les attaques Client & Social",
    icon: "🛡️",
  },
  {
    id: "config-warrior",
    name: "Config Warrior",
    description: "Compléter toutes les attaques Data & Config",
    icon: "⚙️",
  },
  {
    id: "perfect-score",
    name: "Sans Faute",
    description: "Obtenir 100% à un quiz du premier essai",
    icon: "🎯",
  },
  {
    id: "speed-run",
    name: "Speed Run",
    description: "Lire 5 attaques en une session",
    icon: "⚡",
  },
  {
    id: "defender",
    name: "Défenseur",
    description: "Lire toutes les protections",
    icon: "🛡️",
  },
  {
    id: "researcher",
    name: "Chercheur",
    description: "Voir toutes les animations",
    icon: "🔬",
  },
  {
    id: "elite-complete",
    name: "ELITE Complet",
    description: "Compléter les 19 attaques + tous les quiz",
    icon: "🏆",
  },
];

const CATEGORY_BADGE_MAP: Record<string, string> = {
  injection: "injection-master",
  auth: "auth-expert",
  "access-control": "access-controller",
  "api-infra": "api-guardian",
  "client-social": "social-shield",
  "data-config": "config-warrior",
};

export function evaluateBadges(progress: UserProgress): string[] {
  const earned: string[] = [];

  // Premier Pas
  if (progress.completedAttacks.length >= 1) {
    earned.push("first-step");
  }

  // Category badges
  for (const [categoryId, badgeId] of Object.entries(CATEGORY_BADGE_MAP)) {
    const categoryAttacks = ALL_ATTACKS.filter(
      (a) => a.categoryId === categoryId,
    );
    const allCompleted = categoryAttacks.every((a) =>
      progress.quizResults.some((q) => q.attackSlug === a.slug),
    );
    if (allCompleted && categoryAttacks.length > 0) {
      earned.push(badgeId);
    }
  }

  // Sans Faute
  const hasPerfect = progress.quizResults.some(
    (q) => q.score === q.total && q.total > 0,
  );
  if (hasPerfect) {
    earned.push("perfect-score");
  }

  // Speed Run (5 attaques lues — approximé par le nombre en session)
  if (progress.completedAttacks.length >= 5) {
    earned.push("speed-run");
  }

  // Défenseur
  if (progress.viewedProtections.length >= ALL_ATTACKS.length) {
    earned.push("defender");
  }

  // Chercheur
  if (progress.viewedAnimations.length >= ALL_ATTACKS.length) {
    earned.push("researcher");
  }

  // ELITE Complet
  const allQuizzed = ALL_ATTACKS.every((a) =>
    progress.quizResults.some((q) => q.attackSlug === a.slug),
  );
  if (progress.completedAttacks.length >= ALL_ATTACKS.length && allQuizzed) {
    earned.push("elite-complete");
  }

  return earned;
}
