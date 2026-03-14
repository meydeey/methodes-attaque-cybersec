import { Attack } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { CodeSnippet } from "./CodeSnippet";

export function ProtectionSection({ attack }: { attack: Attack }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--hacker-green)] font-mono tracking-wider">
        {">"} PROTECTIONS
      </p>

      {attack.protections.map((protection, i) => (
        <div key={i} className="hacker-card p-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#002200] text-[var(--hacker-green)] text-xs font-bold font-mono">
              {i + 1}
            </span>
            <h4 className="font-semibold text-sm text-white">
              {protection.title}
            </h4>
          </div>
          <p className="text-sm text-[#999] pl-9 leading-relaxed">
            {protection.description}
          </p>
          {protection.codeExample && (
            <div className="pl-9">
              <CodeSnippet
                code={protection.codeExample}
                language={protection.language}
              />
            </div>
          )}
        </div>
      ))}

      {attack.resources.length > 0 && (
        <div className="hacker-card p-6 space-y-3">
          <h4 className="text-xs text-[#666] font-mono tracking-wider">
            {">"} RESSOURCES
          </h4>
          <div className="flex flex-wrap gap-3">
            {attack.resources.map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--hacker-green)] hover:text-[var(--hacker-green-dim)] transition-colors font-mono"
              >
                {resource.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
