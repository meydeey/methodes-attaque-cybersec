"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";

type AnimationControlsProps = {
  isStarted: boolean;
  isFinished: boolean;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  currentLabel: string | null;
  onPlay: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onReset: () => void;
};

export function AnimationControls({
  isStarted,
  isFinished,
  isPlaying,
  currentStep,
  totalSteps,
  currentLabel,
  onPlay,
  onPause,
  onNextStep,
  onReset,
}: AnimationControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isStarted ? (
            <Button onClick={onPlay} size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Lancer la démo
            </Button>
          ) : isPlaying ? (
            <Button
              onClick={onPause}
              size="sm"
              variant="secondary"
              className="gap-2"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          ) : isFinished ? (
            <Button
              onClick={onReset}
              size="sm"
              variant="secondary"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Rejouer
            </Button>
          ) : (
            <>
              <Button
                onClick={onPlay}
                size="sm"
                variant="secondary"
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Auto
              </Button>
              <Button onClick={onNextStep} size="sm" className="gap-2">
                <SkipForward className="h-4 w-4" />
                Étape suivante
              </Button>
            </>
          )}
          {isStarted && !isFinished && (
            <Button onClick={onReset} size="sm" variant="ghost">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isStarted && (
          <span className="text-xs text-muted-foreground font-mono">
            {currentStep + 1} / {totalSteps}
          </span>
        )}
      </div>

      {currentLabel && (
        <div className="bg-zinc-900 rounded-md px-4 py-2 border border-border/30">
          <p className="text-sm text-foreground">{currentLabel}</p>
        </div>
      )}

      {!isStarted && (
        <p className="text-xs text-muted-foreground">
          Appuie sur{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-xs">
            Espace
          </kbd>{" "}
          pour avancer étape par étape
        </p>
      )}
    </div>
  );
}
