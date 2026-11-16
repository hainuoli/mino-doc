"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyCommand({
  command,
  label = "复制命令",
  done = "已复制",
}: {
  command: string;
  label?: string;
  done?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("failed");
    }
  }
  return (
    <div className="install-command" data-reveal data-reveal-delay="180">
      <code>{command}</code>
      <button
        onClick={copy}
        aria-label={status === "copied" ? done : label}
        title={label}
      >
        {status === "copied" ? <Check size={15} /> : <Copy size={15} />}
      </button>
      <span className="sr-only" role="status">
        {status === "copied"
          ? done
          : status === "failed"
            ? "Select and copy the command manually."
            : ""}
      </span>
    </div>
  );
}
