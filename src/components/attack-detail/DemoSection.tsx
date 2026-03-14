"use client";

import { Attack } from "@/lib/types";
import { useAnimationStep } from "@/hooks/useAnimationStep";
import { AnimationControls } from "@/components/animations/AnimationControls";
import { AttackAnimation } from "@/components/animations/AttackAnimation";

export function DemoSection({ attack }: { attack: Attack }) {
  const animation = useAnimationStep(attack.animationSteps);

  return (
    <div className="hacker-card p-6 space-y-4">
      <h2 className="text-xs text-[var(--hacker-green)] font-mono tracking-wider">
        {">"} DÉMONSTRATION
      </h2>

      <div className="scan-lines rounded-md overflow-y-auto border border-[var(--hacker-border)]">
        <AttackAnimation
          slug={attack.slug}
          currentStep={animation.currentStep}
        />
      </div>

      <AnimationControls
        isStarted={animation.isStarted}
        isFinished={animation.isFinished}
        isPlaying={animation.isPlaying}
        currentStep={animation.currentStep}
        totalSteps={animation.totalSteps}
        currentLabel={animation.currentStepData?.label ?? null}
        onPlay={animation.play}
        onPause={animation.pause}
        onNextStep={animation.nextStep}
        onReset={animation.reset}
      />
    </div>
  );
}
