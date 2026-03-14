import { Attack } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ExplanationSection({ attack }: { attack: Attack }) {
  return (
    <div className="space-y-4">
      {/* Explanation */}
      <div className="hacker-card p-6 space-y-4">
        <h2 className="text-xs text-[var(--hacker-green)] font-mono tracking-wider">
          {">"} EXPLICATION
        </h2>
        <div className="space-y-3">
          {attack.explanation.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-sm text-[#ccc] leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Real-world scenario */}
      <div className="hacker-card p-6 space-y-3 border-l-2 border-l-orange-500/50">
        <h3 className="text-xs text-orange-400 font-mono tracking-wider">
          {">"} SCÉNARIO CONCRET
        </h3>
        <p className="text-sm text-[#ccc] leading-relaxed">
          {attack.realWorldScenario}
        </p>
      </div>

      {/* Exploit steps */}
      <div className="hacker-card p-6 space-y-4">
        <h3 className="text-xs text-red-400 font-mono tracking-wider">
          {">"} ÉTAPES DE L&apos;ATTAQUE
        </h3>
        <ol className="space-y-3">
          {attack.exploitSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                  "bg-[#002200] text-[var(--hacker-green)] text-xs font-bold",
                  "font-mono",
                )}
              >
                {i + 1}
              </span>
              <span className="text-[#ccc] pt-0.5 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
