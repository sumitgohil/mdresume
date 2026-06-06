import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_THEME_ID, normalizeResumeTheme, type ResumeTheme } from "@/lib/themeRegistry";

export type { ResumeTheme };

export type ViewMode = "editor" | "split" | "preview";
export type PaperSize = "A4" | "Letter";
export type MarginSize = "narrow" | "normal" | "wide";

export interface ResumeSettings {
  bodyFont: string;
  headingFont: string;
  headingWeight: "400" | "500" | "600" | "700" | "800";
  fontSize: number; // px
  headingScale: number; // multiplier
  lineHeight: number;
  sectionSpacing: number; // px
  paragraphSpacing: number; // px
  showDividers: boolean;
  paperSize: PaperSize;
  margins: MarginSize;
}

export interface ResumeDoc {
  id: string;
  name: string;
  markdown: string;
  theme: ResumeTheme;
  settings: ResumeSettings;
  updatedAt: number;
}

interface ResumeState {
  resumes: Record<string, ResumeDoc>;
  activeId: string;
  viewMode: ViewMode;
  settingsOpen: boolean;
  themesOpen: boolean;
  aiPanelOpen: boolean;
  selectedProvider: "openai" | "anthropic" | "gemini" | "custom";
  openaiKey: string;
  anthropicKey: string;
  geminiKey: string;
  customKey: string;
  customBaseUrl: string;
  customModel: string;
  selectedText: string;
  isAutoAdjusting: boolean;
  // derived helpers
  setName: (name: string) => void;
  setMarkdown: (md: string) => void;
  importMarkdown: (md: string, name: string) => void;
  setTheme: (t: ResumeTheme) => void;
  setSettings: (patch: Partial<ResumeSettings>) => void;
  setViewMode: (v: ViewMode) => void;
  toggleSettings: () => void;
  toggleThemes: () => void;
  toggleAIPanel: () => void;
  setProvider: (p: "openai" | "anthropic" | "gemini" | "custom") => void;
  setOpenAIKey: (key: string) => void;
  setAnthropicKey: (key: string) => void;
  setGeminiKey: (key: string) => void;
  setCustomKey: (key: string) => void;
  setCustomBaseUrl: (url: string) => void;
  setCustomModel: (model: string) => void;
  setSelectedText: (text: string) => void;
  setIsAutoAdjusting: (b: boolean) => void;
  newResume: () => void;
}

export const DEFAULT_SETTINGS: ResumeSettings = {
  bodyFont: "Inter",
  headingFont: "Inter",
  headingWeight: "700",
  fontSize: 15,
  headingScale: 1.2,
  lineHeight: 1.6,
  sectionSpacing: 24,
  paragraphSpacing: 8,
  showDividers: true,
  paperSize: "A4",
  margins: "normal",
};

export const SAMPLE_RESUME_MARKDOWN = `---
name: Alex Chen
title: Senior Software Engineer
email: alex.chen@email.com
phone: "(555) 234-5678"
location: San Francisco, CA
linkedin: linkedin.com/in/alexchen
github: github.com/alexchen
---

## Professional Summary

Results-driven Senior Software Engineer with 5+ years of experience building scalable microservices and distributed systems. Proven track record of leading technical initiatives, improving system reliability, and mentoring engineering teams. Strong expertise in TypeScript, Node.js, and cloud-native architectures with hands-on experience at high-growth product companies.

---

## Technical Skills

**Languages:** TypeScript, JavaScript, Python, Go

**Backend:** Node.js, Express, NestJS, GraphQL, REST APIs

**Cloud & Infrastructure:** AWS (ECS, Lambda, RDS, S3), GCP, Docker, Kubernetes

**Databases:** PostgreSQL, MongoDB, Redis, DynamoDB

**Tools & Practices:** Git, CI/CD, Terraform, DataDog, Agile/Scrum

---

## Professional Experience

**Senior Software Engineer** | TechCorp Inc.
*January 2021 – Present | 3+ years*

- Architected and deployed microservices platform serving 2M+ daily active users, improving system reliability by 40% and reducing API latency by 60%
- Led migration to TypeScript codebase across 12 services, reducing production bugs by 45% and improving developer productivity
- Designed real-time event processing system using AWS Lambda and Kinesis, reducing data latency from 5 minutes to under 10 seconds
- Mentored team of 5 engineers through code reviews, pair programming, and technical design sessions, accelerating team velocity by 25%
- Implemented CI/CD pipelines using GitHub Actions, cutting deployment time from 2 hours to 15 minutes

**Software Engineer** | StartupXYZ
*June 2018 – December 2020 | 2.5 years*

- Built and maintained Node.js APIs processing 100K+ requests daily with 99.9% uptime
- Developed TypeScript SDK adopted by 50+ enterprise clients, reducing integration time by 70%
- Designed PostgreSQL database schema supporting multi-tenant architecture for B2B SaaS platform
- Contributed to open-source monitoring tools, gaining 500+ GitHub stars

---

## Education

**B.S. Computer Science** | University of California, Berkeley
*Graduated: May 2018 | GPA: 3.7*

---

## Certifications

- AWS Solutions Architect Associate (2023)
- Google Cloud Professional Developer (2022)
`;

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeDoc(overrides: Partial<ResumeDoc> = {}): ResumeDoc {
  return {
    id: makeId(),
    name: "Untitled Resume",
    markdown: SAMPLE_RESUME_MARKDOWN,
    theme: DEFAULT_THEME_ID,
    settings: { ...DEFAULT_SETTINGS },
    updatedAt: Date.now(),
    ...overrides,
  };
}

const initialDoc = makeDoc({ name: "Alex Chen" });

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: { [initialDoc.id]: initialDoc },
      activeId: initialDoc.id,
      viewMode: "split",
      settingsOpen: true,
      themesOpen: true,
      aiPanelOpen: false,
      selectedProvider: "openai",
      openaiKey: "",
      anthropicKey: "",
      geminiKey: "",
      customKey: "",
      customBaseUrl: "https://api.deepseek.com/v1",
      customModel: "deepseek-chat",
      selectedText: "",
      isAutoAdjusting: false,
      setName: (name) =>
        set((s) => ({
          resumes: {
            ...s.resumes,
            [s.activeId]: { ...s.resumes[s.activeId], name, updatedAt: Date.now() },
          },
        })),
      setMarkdown: (markdown) =>
        set((s) => ({
          resumes: {
            ...s.resumes,
            [s.activeId]: { ...s.resumes[s.activeId], markdown, updatedAt: Date.now() },
          },
        })),
      importMarkdown: (markdown, name) =>
        set((s) => ({
          resumes: {
            ...s.resumes,
            [s.activeId]: {
              ...s.resumes[s.activeId],
              name,
              markdown,
              updatedAt: Date.now(),
            },
          },
        })),
      setTheme: (theme) =>
        set((s) => ({
          resumes: {
            ...s.resumes,
            [s.activeId]: {
              ...s.resumes[s.activeId],
              theme: normalizeResumeTheme(theme),
              updatedAt: Date.now(),
            },
          },
        })),
      setSettings: (patch) =>
        set((s) => {
          const doc = s.resumes[s.activeId];
          return {
            resumes: {
              ...s.resumes,
              [s.activeId]: {
                ...doc,
                settings: { ...doc.settings, ...patch },
                updatedAt: Date.now(),
              },
            },
          };
        }),
      setViewMode: (viewMode) => set({ viewMode }),
      toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen, aiPanelOpen: false })),
      toggleThemes: () => set((s) => ({ themesOpen: !s.themesOpen })),
      toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen, settingsOpen: false })),
      setProvider: (selectedProvider) => set({ selectedProvider }),
      setOpenAIKey: (openaiKey) => set({ openaiKey }),
      setAnthropicKey: (anthropicKey) => set({ anthropicKey }),
      setGeminiKey: (geminiKey) => set({ geminiKey }),
      setCustomKey: (customKey) => set({ customKey }),
      setCustomBaseUrl: (customBaseUrl) => set({ customBaseUrl }),
      setCustomModel: (customModel) => set({ customModel }),
      setSelectedText: (selectedText) => set({ selectedText }),
      setIsAutoAdjusting: (isAutoAdjusting) => set({ isAutoAdjusting }),
      newResume: () => {
        const doc = makeDoc();
        set((s) => ({
          resumes: { ...s.resumes, [doc.id]: doc },
          activeId: doc.id,
        }));
      },
    }),
    {
      name: "resumeos-store-v2",
      merge: (persisted, current) => {
        const state = persisted as Partial<ResumeState>;
        const resumes = Object.fromEntries(
          Object.entries(state.resumes || current.resumes).map(([id, doc]) => [
            id,
            { ...doc, theme: normalizeResumeTheme(doc.theme) },
          ]),
        );
        return { ...current, ...state, resumes } as ResumeState;
      },
      partialize: (state) => {
        const { selectedText, isAutoAdjusting, ...rest } = state;
        return rest;
      },
    },
  ),
);

// Convenience hook for the active resume
export function useActiveResume() {
  return useResumeStore((s) => s.resumes[s.activeId]);
}
