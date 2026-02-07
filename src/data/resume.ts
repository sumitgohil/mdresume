export type ResumeTheme = (typeof THEMES)[number]["id"];

export type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  themeId: ResumeTheme;
  audience: string;
  sampleMarkdown: string;
};

export type ResumeExample = {
  id: string;
  title: string;
  role: string;
  summary: string;
  tags: string[];
  templateId: string;
  markdown: string;
};

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

export const SAMPLE_MARKDOWN = `---
name: Alex Chen
title: Senior Software Engineer
email: alex.chen@email.com
location: San Francisco, CA
linkedin: linkedin.com/in/alexchen
github: github.com/alexchen
---

## Professional Summary

Senior software engineer with 7 years of experience building product platforms, developer tools, and reliable APIs for high-growth teams.

## Technical Skills

**Languages:** TypeScript, JavaScript, Go, Python

**Frontend:** React, Astro, Next.js, design systems

**Backend:** Node.js, GraphQL, PostgreSQL, Redis

## Experience

### Senior Software Engineer | Cloudlane

- Led the rewrite of a customer onboarding flow, reducing activation time by 42%.
- Built CI quality gates for accessibility, performance, and regression testing.
- Mentored five engineers through architecture reviews and release planning.

### Software Engineer | Stackframe

- Shipped internal dashboards used by support and revenue teams every day.
- Improved API response times by 55% through caching and query tuning.

## Education

**B.S. Computer Science** | University of California, Berkeley`;

export const templates: ResumeTemplate[] = THEMES.map((theme) => ({
  id: theme.id,
  name: `${theme.label} Resume`,
  description: theme.description,
  themeId: theme.id,
  audience:
    theme.id === "executive"
      ? "Engineering leaders and senior managers"
      : theme.id === "creative-bold" || theme.id === "warm-sunset"
        ? "Product, design, and startup roles"
        : "Software engineers and technical professionals",
  sampleMarkdown: SAMPLE_MARKDOWN,
}));

export const examples: ResumeExample[] = [
  {
    id: "software-engineer",
    title: "Senior Software Engineer Resume",
    role: "Senior Software Engineer",
    summary: "Impact-first resume for platform engineers with measurable delivery outcomes.",
    tags: ["TypeScript", "APIs", "Leadership"],
    templateId: "modern-pro",
    markdown: SAMPLE_MARKDOWN,
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer Resume",
    role: "Frontend Engineer",
    summary: "UI engineering example with design systems, accessibility, and product velocity.",
    tags: ["React", "Astro", "Design Systems"],
    templateId: "creative-bold",
    markdown: SAMPLE_MARKDOWN.replace("Senior Software Engineer", "Frontend Engineer").replace(
      "reliable APIs",
      "accessible interfaces",
    ),
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer Resume",
    role: "Backend Engineer",
    summary: "Backend-focused version for distributed systems, observability, and scale.",
    tags: ["Node.js", "PostgreSQL", "Cloud"],
    templateId: "tech-startup",
    markdown: SAMPLE_MARKDOWN.replace("Senior Software Engineer", "Backend Engineer").replace(
      "React, Astro, Next.js, design systems",
      "Node.js, GraphQL, PostgreSQL, distributed systems",
    ),
  },
  {
    id: "product-manager",
    title: "Product Manager Resume",
    role: "Product Manager",
    summary: "Outcome-led resume for product managers who want crisp roadmap and launch stories.",
    tags: ["Roadmaps", "Launches", "Metrics"],
    templateId: "minimal",
    markdown: SAMPLE_MARKDOWN.replace("Senior Software Engineer", "Product Manager").replace(
      "building product platforms, developer tools, and reliable APIs",
      "launching workflow products, aligning teams, and improving adoption",
    ),
  },
  {
    id: "early-career",
    title: "Early Career Developer Resume",
    role: "Junior Software Engineer",
    summary: "Simple resume structure for internships, campus placements, and first roles.",
    tags: ["Projects", "Internship", "Portfolio"],
    templateId: "classic-elegant",
    markdown: SAMPLE_MARKDOWN.replace("Senior Software Engineer", "Junior Software Engineer").replace(
      "7 years of experience",
      "project and internship experience",
    ),
  },
];

export function findTemplate(id: string) {
  return templates.find((template) => template.id === id) || templates[0];
}
