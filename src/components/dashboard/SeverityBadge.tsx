import { Severity } from "@/lib/types";

const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: {
    label: "CRITIQUE",
    className: "bg-[#3b0000] text-[#ff4444] border-[#ff4444]/30",
  },
  high: {
    label: "HAUTE",
    className: "bg-[#3b2200] text-[#f97316] border-[#f97316]/30",
  },
  medium: {
    label: "MOYENNE",
    className: "bg-[#3b3500] text-[#fbbf24] border-[#fbbf24]/30",
  },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const config = severityConfig[severity];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-[family-name:var(--font-geist-mono)] uppercase border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
