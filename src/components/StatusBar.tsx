import { useActiveResume } from "@/store/resumeStore";
import { useEffect, useState } from "react";
import { validateResumeMarkdown } from "@/lib/resumeSchema";
import { THEMES } from "@/lib/themeRegistry";

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function StatusBar() {
  const doc = useActiveResume();
  const [, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(i);
  }, []);

  const words = doc.markdown.trim().split(/\s+/).filter(Boolean).length;
  const chars = doc.markdown.length;
  const lines = doc.markdown.split("\n").length;
  const issues = validateResumeMarkdown(doc.markdown);
  const errors = issues.filter((issue) => issue.severity === "error").length;
  const warnings = issues.filter((issue) => issue.severity === "warning").length;
  const themeLabel = THEMES.find((theme) => theme.id === doc.theme)?.label || doc.theme;

  return (
    <footer className="h-7 border-t border-border bg-card text-muted-foreground flex items-center px-4 gap-4 text-[11px] shrink-0">
      <span className="text-emerald-500">● Saved</span>
      <span>{words} words</span>
      <span>{chars} chars</span>
      <span>{lines} lines</span>
      {(errors > 0 || warnings > 0) && (
        <span className={errors > 0 ? "text-red-400" : "text-amber-400"}>
          {errors} errors · {warnings} warnings
        </span>
      )}
      <div className="flex-1" />
      <span>Theme: {themeLabel}</span>
      <span>Updated {timeAgo(doc.updatedAt)}</span>
    </footer>
  );
}
