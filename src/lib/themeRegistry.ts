export const DEFAULT_THEME_ID = "modern-pro";

export const THEMES = [
  {
    id: "modern-pro",
    label: "Modern",
    description: "Polished blue-accent tech layout",
    swatches: ["#9ca3af", "#1f2937", "#2563eb"],
  },
  {
    id: "classic-elegant",
    label: "Standard",
    description: "Conservative recruiter-first format",
    swatches: ["#e5e7eb", "#374151", "#111827"],
  },
  {
    id: "minimal",
    label: "Simple",
    description: "Quiet whitespace-led structure",
    swatches: ["#f8fafc", "#94a3b8", "#334155"],
  },
  {
    id: "creative-bold",
    label: "Bold",
    description: "High-impact top rule and names",
    swatches: ["#dbeafe", "#2563eb", "#1e3a8a"],
  },
  {
    id: "executive",
    label: "Executive",
    description: "Authoritative serif leadership style",
    swatches: ["#e5e7eb", "#111827", "#9a3412"],
  },
  {
    id: "tech-startup",
    label: "Smart",
    description: "Dense technical progression layout",
    swatches: ["#dbeafe", "#3b82f6", "#1d4ed8"],
  },
  {
    id: "nature-green",
    label: "Neat",
    description: "Calm compact enterprise template",
    swatches: ["#f1f5f9", "#64748b", "#0f766e"],
  },
  {
    id: "warm-sunset",
    label: "Bright",
    description: "Warm accent for creative roles",
    swatches: ["#fbbf24", "#f97316", "#c2410c"],
  },
  {
    id: "rose-elegant",
    label: "Accent",
    description: "Contemporary red-accent brand",
    swatches: ["#fee2e2", "#ef4444", "#991b1b"],
  },
] as const;

export type ResumeTheme = (typeof THEMES)[number]["id"];

const THEME_IDS = new Set<string>(THEMES.map((theme) => theme.id));

export function isResumeTheme(theme: unknown): theme is ResumeTheme {
  return typeof theme === "string" && THEME_IDS.has(theme);
}

export function normalizeResumeTheme(theme: unknown): ResumeTheme {
  return isResumeTheme(theme) ? theme : DEFAULT_THEME_ID;
}
