"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type TerminalTextProps = {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
};

export function TerminalText({
  text,
  className,
  speed = 30,
  onComplete,
}: TerminalTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedLength(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (displayedLength >= text.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= text.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, displayedLength, onComplete]);

  return (
    <span
      className={cn("font-mono", className)}
    >
      {text.slice(0, displayedLength)}
      {isComplete && <span className="terminal-cursor" />}
    </span>
  );
}
