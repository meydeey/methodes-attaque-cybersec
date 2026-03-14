"use client";

import dynamic from "next/dynamic";
import { AnimationStage } from "./AnimationStage";

const scenes: Record<string, React.ComponentType<{ currentStep: number }>> = {
  "sql-injection": dynamic(() =>
    import("./scenes/SqlInjectionScene").then((m) => m.SqlInjectionScene),
  ),
  xss: dynamic(() => import("./scenes/XssScene").then((m) => m.XssScene)),
  "jwt-manipulation": dynamic(() =>
    import("./scenes/JwtManipulationScene").then((m) => m.JwtManipulationScene),
  ),
  "nosql-injection": dynamic(() =>
    import("./scenes/NosqlInjectionScene").then((m) => m.NosqlInjectionScene),
  ),
  "session-hijacking": dynamic(() =>
    import("./scenes/SessionHijackingScene").then(
      (m) => m.SessionHijackingScene,
    ),
  ),
  "credential-stuffing": dynamic(() =>
    import("./scenes/CredentialStuffingScene").then(
      (m) => m.CredentialStuffingScene,
    ),
  ),
  "broken-access-control": dynamic(() =>
    import("./scenes/BrokenAccessControlScene").then(
      (m) => m.BrokenAccessControlScene,
    ),
  ),
  "privilege-escalation": dynamic(() =>
    import("./scenes/PrivilegeEscalationScene").then(
      (m) => m.PrivilegeEscalationScene,
    ),
  ),
  phishing: dynamic(() =>
    import("./scenes/PhishingScene").then((m) => m.PhishingScene),
  ),
  clickjacking: dynamic(() =>
    import("./scenes/ClickjackingScene").then((m) => m.ClickjackingScene),
  ),
  "dependency-confusion": dynamic(() =>
    import("./scenes/DependencyConfusionScene").then(
      (m) => m.DependencyConfusionScene,
    ),
  ),
  "env-leak": dynamic(() =>
    import("./scenes/EnvLeakScene").then((m) => m.EnvLeakScene),
  ),
  "security-misconfig": dynamic(() =>
    import("./scenes/SecurityMisconfigScene").then(
      (m) => m.SecurityMisconfigScene,
    ),
  ),
  csrf: dynamic(() => import("./scenes/CsrfScene").then((m) => m.CsrfScene)),
  ssrf: dynamic(() => import("./scenes/SsrfScene").then((m) => m.SsrfScene)),
  "rate-limit-bypass": dynamic(() =>
    import("./scenes/RateLimitBypassScene").then((m) => m.RateLimitBypassScene),
  ),
  "webhook-poisoning": dynamic(() =>
    import("./scenes/WebhookPoisoningScene").then(
      (m) => m.WebhookPoisoningScene,
    ),
  ),
  "mass-assignment": dynamic(() =>
    import("./scenes/MassAssignmentScene").then((m) => m.MassAssignmentScene),
  ),
};

export function AttackAnimation({
  slug,
  currentStep,
}: {
  slug: string;
  currentStep: number;
}) {
  const SceneComponent = scenes[slug];

  if (!SceneComponent) {
    return (
      <AnimationStage>
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-muted-foreground">
            Animation en cours de développement
          </p>
        </div>
      </AnimationStage>
    );
  }

  return <SceneComponent currentStep={currentStep} />;
}
