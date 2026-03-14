export function CodeSnippet({
  code,
  language,
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="rounded-md bg-[#0a0a0a] border border-[var(--hacker-border)] border-l-2 border-l-[var(--hacker-green)] overflow-hidden">
      {language && (
        <div className="px-3 py-1.5 bg-[#111111] border-b border-[var(--hacker-border)]">
          <span className="text-xs text-[var(--hacker-green)] font-mono">
            {language}
          </span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className="text-xs font-mono text-[#ccc] leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}
