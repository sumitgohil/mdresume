export const DEFAULT_THEME_ID = "modern-pro";

export const THEMES = [
  {
    id: "modern-pro",
    label: "Crisp",
    description: "Clean technical layout with a measured blue accent.",
    swatches: ["#9ca3af", "#1f2937", "#2563eb"],
  },
  {
    id: "classic-elegant",
    label: "Stark",
    description: "Conservative format for traditional hiring teams.",
    swatches: ["#e5e7eb", "#374151", "#111827"],
  },
  {
    id: "minimal",
    label: "Airy",
    description: "Quiet spacing and minimal visual noise.",
    swatches: ["#f8fafc", "#94a3b8", "#334155"],
  },
  {
    id: "creative-bold",
    label: "Vivid",
    description: "Sharper headings for product-minded builders.",
    swatches: ["#dbeafe", "#2563eb", "#1e3a8a"],
  },
  {
    id: "executive",
    label: "Formal",
    description: "Leadership-oriented structure with restrained weight.",
    swatches: ["#e5e7eb", "#111827", "#9a3412"],
  },
  {
    id: "tech-startup",
    label: "Dense",
    description: "Compact format for technical depth and systems work.",
    swatches: ["#dbeafe", "#3b82f6", "#1d4ed8"],
  },
  {
    id: "nature-green",
    label: "Calm",
    description: "Balanced enterprise layout with a soft accent.",
    swatches: ["#f1f5f9", "#64748b", "#0f766e"],
  },
  {
    id: "warm-sunset",
    label: "Warm",
    description: "A subtle warm accent for portfolio-driven profiles.",
    swatches: ["#fbbf24", "#f97316", "#c2410c"],
  },
  {
    id: "rose-elegant",
    label: "Dusk",
    description: "Typographic top-border style with a modern accent.",
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
