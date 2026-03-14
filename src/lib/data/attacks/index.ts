import { Attack } from "@/lib/types";
import { sqlInjection } from "./sql-injection";
import { xss } from "./xss";
import { nosqlInjection } from "./nosql-injection";
import { jwtManipulation } from "./jwt-manipulation";
import { sessionHijacking } from "./session-hijacking";
import { credentialStuffing } from "./credential-stuffing";
import { brokenAccessControl } from "./broken-access-control";
import { privilegeEscalation } from "./privilege-escalation";
import { csrf } from "./csrf";
import { ssrf } from "./ssrf";
import { rateLimitBypass } from "./rate-limit-bypass";
import { webhookPoisoning } from "./webhook-poisoning";
import { massAssignment } from "./mass-assignment";
import { phishing } from "./phishing";
import { clickjacking } from "./clickjacking";
import { dependencyConfusion } from "./dependency-confusion";
import { envLeak } from "./env-leak";
import { securityMisconfig } from "./security-misconfig";

export const ALL_ATTACKS: Attack[] = [
  // A. Injection & Manipulation de Requêtes
  sqlInjection,
  xss,
  nosqlInjection,
  // B. Authentification & Sessions
  jwtManipulation,
  sessionHijacking,
  credentialStuffing,
  // C. Contrôle d'Accès & Autorisation
  brokenAccessControl,
  privilegeEscalation,
  csrf,
  // D. Attaques API & Infrastructure
  ssrf,
  rateLimitBypass,
  webhookPoisoning,
  massAssignment,
  // E. Client & Social Engineering
  phishing,
  clickjacking,
  dependencyConfusion,
  // F. Exposition de Données & Configuration
  envLeak,
  securityMisconfig,
];

export function getAttackBySlug(slug: string): Attack | undefined {
  return ALL_ATTACKS.find((a) => a.slug === slug);
}

export function getAttacksByCategory(categoryId: string): Attack[] {
  return ALL_ATTACKS.filter((a) => a.categoryId === categoryId);
}

export function getAdjacentAttacks(slug: string): {
  prev: Attack | null;
  next: Attack | null;
} {
  const index = ALL_ATTACKS.findIndex((a) => a.slug === slug);
  return {
    prev: index > 0 ? ALL_ATTACKS[index - 1] : null,
    next: index < ALL_ATTACKS.length - 1 ? ALL_ATTACKS[index + 1] : null,
  };
}
