/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useResumeStore, useActiveResume } from "@/store/resumeStore";
import { editorService } from "@/lib/editorService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { ENABLE_IMPROVE_TEXT } from "@/lib/aiFeatures";
import { buildEvaluationPrompt, parseEvaluationResponse } from "@/lib/aiEvaluation";
import type {
  EvaluationCategoryScore,
  EvaluationIssue,
  KeywordCoverageItem,
  ResumeEvaluationReport,
} from "@/lib/resumeEvaluation";
import { toast } from "sonner";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  Sparkles,
  Key,
  Wand2,
  RefreshCw,
  Check,
  X,
  Clipboard,
  Briefcase,
  FileText,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Award,
  BarChart3,
  Copy,
  ShieldAlert,
  Target,
} from "lucide-react";

// --- Types & Constants ---

const PROMPT_TEMPLATES = {
  improve: {
    label: "Improve Selected Bullet",
    description: "Make bullet points strong, action-oriented, and high-impact",
    system: `You are a world-class executive resume writer and career coach specializing in high-growth technology placements. 
Your mission is to rewrite the user's provided resume bullet point or text block into a high-octane "interview magnet" statement.

Rigorously apply the following professional resume guidelines:
1. FOUNDATION: Apply the Google X-Y-Z Formula: "Accomplished [X] as measured by [Y], by doing [Z]".
2. AUTHORITATIVE START: Begin immediately with a powerful, punchy action verb (e.g., "Architected", "Spearheaded", "Engineered", "Orchestrated", "Optimized", "Automated"). NEVER start with passive phrases (e.g., "Responsible for", "Worked on", "Participated in", "Handled", "Helped").
3. QUANTIFIABLE IMPACT: Every achievement should highlight measurable outcomes (e.g., cost reduction, revenue increase, performance speedup, developer hours saved, uptime improvement). If no metric is provided, construct a realistic placeholder in brackets like [X]% or $[Y] to guide the user to fill it in.
4. TECHNICAL SPECIFICITY: Weave in technical frameworks, tools, or architectural strategies naturally. Show how the result was achieved (e.g., "...using AWS Lambda and Redis caching to...").
5. PROFESSIONAL BREVITY: Omit personal pronouns ("I", "we", "our"). Remove filler words and keep the language exceptionally concise, crisp, and business-focused.

CRITICAL RESTRICTION: Return ONLY the rewritten resume text itself. Absolutely no introductory words, no markdown block wrappers (do not wrap in \`\`\`), no quotes, and no post-rewrite commentary. Output must be directly pasteable.`,
  },
  ats: {
    label: "Make ATS Friendly",
    description: "Align language and terminology for applicant tracking systems",
    system: `You are an expert ATS (Applicant Tracking System) screening specialist. 
Your task is to optimize the provided resume text to achieve a perfect compatibility rating with corporate ATS algorithms like Workday, Greenhouse, and Taleo.

Follow these structural and semantic guidelines:
1. STANDARDIZED TERMINOLOGY: Replace non-standard or overly creative terminology with widely-recognized, industry-standard nouns and adjectives (e.g., change "Code Wizard" to "Senior Software Engineer").
2. KEYWORD SYNTHESIS: Naturally integrate crucial technical and domain keywords (e.g., Cloud Infrastructure, Scalability, RESTful APIs, Systems Integration, Agile Methodologies) in a grammatically elegant, non-spammy manner.
3. ACCESSIBLE SYNTAX: Structure sentences clearly and avoid complex, nested sentence clauses that confuse parser logic. Use standard bullet formats.
4. NO ACRONYM CONFUSION: Spell out complex acronyms on first use, accompanied by their standard abbreviation (e.g., "Applicant Tracking System (ATS)").

CRITICAL RESTRICTION: Return ONLY the optimized resume text itself. Absolutely no introductory words, no markdown block wrappers (do not wrap in \`\`\`), no quotes, and no post-rewrite commentary. Output must be directly pasteable.`,
  },
  faang: {
    label: "Rewrite for FAANG",
    description: "Target elite, high-scale tech company expectations",
    system: `You are an elite tech recruiter and principal engineering manager at a tier-1 FAANG company (Google, Meta, Apple, Netflix). 
Your goal is to transform the user's resume statement into a world-class high-concurrency, high-scale engineering achievement that instantly stands out to principal engineers.

Apply the following strict elite guidelines:
1. MASSIVE SCALE CONTEXT: Frame achievements around massive metrics (e.g., "processing 5TB+ daily transaction data", "serving 10M+ daily active users", "orchestrating 50+ microservices", "reducing cloud expenditure by $250K/year").
2. SYSTEM COMPLEXITY & ROBUSTNESS: Emphasize core engineering challenges like concurrency, distributed systems bottlenecks, system reliability (e.g., 99.99% uptime), data consistency, security, and latency optimization (e.g., "cutting API response latency from 150ms to 45ms").
3. PRINCIPAL LEVEL OWNERSHIP: Highlight architectural leadership, cross-functional collaboration, design system ownership, and mentoring of junior engineers (e.g., "Led team of 4 to architect...", "Owned the end-to-end migration of...").
4. HARD-HITTING VERBS: Use active FAANG-favorite verbs: "Architected", "Spearheaded", "Engineered", "Orchestrated", "Automated", "Pioneered", "Redesigned".

CRITICAL RESTRICTION: Return ONLY the rewritten resume text itself. Absolutely no introductory words, no markdown block wrappers (do not wrap in \`\`\`), no quotes, and no post-rewrite commentary. Output must be directly pasteable.`,
  },
  metrics: {
    label: "Add Metrics & Numbers",
    description: "Incorporate mock numbers or placeholders to highlight impact",
    system: `You are an expert data-driven resume editor. 
Your mission is to take the provided resume statement and inject rich, realistic, quantifiable metrics into every aspect of it. 

Apply the following precise guidelines:
1. THE TRIPLE METRIC AXIS: Quantify along these vectors where appropriate:
   - PERFORMANCE: Latency reductions (e.g., "by 40%"), throughput increases, page speed improvements.
   - SCALE/VOLUME: User bases (e.g., "1.5M+ active users"), data pipelines (e.g., "500M weekly events"), code bases.
   - BUSINESS VALUE: Financial returns (e.g., "saving $120K annually"), team delivery speed (e.g., "increasing release velocity by 35%").
2. VISUAL PLACEHOLDERS: If the original text is completely devoid of numbers, construct realistic percentages, dollar amounts, and speedups enclosed in bracketed placeholders (e.g., "[45%]", "[$80K/year]", "[120ms]") so the user can easily replace them with their own figures.
3. REMOVE VAGUE ADJECTIVES: Eliminate subjective words like "many", "several", "large", "faster", "better", "improved". Replace them with concrete quantitative parameters (e.g., replace "worked with a large database" with "managed a 4TB PostgreSQL database with 15M+ rows").

CRITICAL RESTRICTION: Return ONLY the rewritten resume text itself. Absolutely no introductory words, no markdown block wrappers (do not wrap in \`\`\`), no quotes, and no post-rewrite commentary. Output must be directly pasteable.`,
  },
  grammar: {
    label: "Fix Grammar & Tone",
    description: "Polish typos, syntax, and refine professional flow",
    system: `You are a professional editorial lead and resume copyeditor. 
Your job is to polish the grammar, vocabulary, sentence structure, and tone of the provided resume text to absolute perfection.

Ensure compliance with the following styling rules:
1. EXQUISITE GRAMMAR & PUNCTUATION: Correct all typos, comma splices, run-on sentences, subject-verb agreement issues, and tense inconsistencies.
2. THE TENSE RULE: Ensure all actions are in the active past tense (e.g., "Directed", "Developed") unless they explicitly refer to ongoing duties in a current role, in which case use present tense (e.g., "Direct", "Develop").
3. ACTIVE AUTHORITATIVE VOICE: Convert passive clauses into active verbs (e.g., convert "Was in charge of managing the release..." to "Managed the release...").
4. REFINED TONE: Replace casual phrasing with precise, professional, and sophisticated business-class equivalents. Omit conversational filler.

CRITICAL RESTRICTION: Return ONLY the rewritten resume text itself. Absolutely no introductory words, no markdown block wrappers (do not wrap in \`\`\`), no quotes, and no post-rewrite commentary. Output must be directly pasteable.`,
  },
};

// --- Direct API call helper ---

async function callAI(
  provider: "openai" | "anthropic" | "gemini" | "custom",
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  customBaseUrl?: string,
  customModel?: string,
): Promise<string> {
  if (!apiKey) {
    throw new Error(
      `API Key for ${provider === "custom" ? "Custom" : provider.toUpperCase()} is required. Please save it in the panel.`,
    );
  }

  if (provider === "custom") {
    let baseUrl = (customBaseUrl || "https://api.deepseek.com/v1").trim();
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }
    const url = baseUrl.endsWith("/chat/completions") ? baseUrl : `${baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: customModel || "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 8192,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Custom API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  if (provider === "openai") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 8192,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `OpenAI request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  if (provider === "anthropic") {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Anthropic request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text.trim();
  }

  if (provider === "gemini") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nHere is the input text to process:\n${userPrompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("Gemini returned an empty or invalid response.");
    }
    return candidateText.trim();
  }

  throw new Error("Invalid provider");
}

function cleanAndParseJSON(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(json)?/, "")
      .replace(/```$/, "")
      .trim();
  }
  return JSON.parse(cleaned);
}

// --- Main AIPanel Component ---

export function AIPanel() {
  const doc = useActiveResume();
  const [mounted, setMounted] = useState(false);
  const {
    toggleAIPanel,
    selectedProvider,
    setProvider,
    openaiKey,
    setOpenAIKey,
    anthropicKey,
    setAnthropicKey,
    geminiKey,
    setGeminiKey,
    customKey,
    setCustomKey,
    customBaseUrl,
    setCustomBaseUrl,
    customModel,
    setCustomModel,
    selectedText,
  } = useResumeStore();

  // API Local state for credentials
  const [activeKeyInput, setActiveKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [showKeysConfig, setShowKeysConfig] = useState(false);

  // Sync key input when provider changes
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedProvider === "openai") setActiveKeyInput(openaiKey);
    else if (selectedProvider === "anthropic") setActiveKeyInput(anthropicKey);
    else if (selectedProvider === "gemini") setActiveKeyInput(geminiKey);
    else if (selectedProvider === "custom") setActiveKeyInput(customKey);
    setShowKey(false);
  }, [selectedProvider, openaiKey, anthropicKey, geminiKey, customKey]);

  // General processing states
  const [isLoading, setIsLoading] = useState(false);
  const [currentActionLabel, setCurrentActionLabel] = useState("");

  // Diff states for Selection Enhancer
  const [originalText, setOriginalText] = useState("");
  const [suggestedText, setSuggestedText] = useState("");
  const [hasSuggestion, setHasSuggestion] = useState(false);

  // Resume evaluation states
  const [jobDescription, setJobDescription] = useState("");
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [evaluationReport, setEvaluationReport] = useState<ResumeEvaluationReport | null>(null);
  const [evaluationError, setEvaluationError] = useState("");
  const [reportOpen, setReportOpen] = useState(false);

  // Cover Letter states
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);

  // Key configurations helpers
  const activeKey =
    selectedProvider === "openai"
      ? openaiKey
      : selectedProvider === "anthropic"
        ? anthropicKey
        : selectedProvider === "gemini"
          ? geminiKey
          : customKey;
  const isKeySaved = !!activeKey;

  const handleSaveKey = () => {
    if (selectedProvider === "openai") setOpenAIKey(activeKeyInput);
    else if (selectedProvider === "anthropic") setAnthropicKey(activeKeyInput);
    else if (selectedProvider === "gemini") setGeminiKey(activeKeyInput);
    else if (selectedProvider === "custom") setCustomKey(activeKeyInput);
    toast.success(
      `${selectedProvider === "custom" ? "Custom" : selectedProvider.toUpperCase()} API Key saved locally!`,
    );
    setShowKeysConfig(false);
  };

  const handleQuickAction = async (type: keyof typeof PROMPT_TEMPLATES) => {
    const textToImprove = selectedText || editorService.getSelectedText();
    if (!textToImprove) {
      toast.error("Please highlight/select some text in the editor first!");
      return;
    }

    if (!activeKey) {
      toast.error(
        `Please save your ${selectedProvider === "custom" ? "Custom" : selectedProvider.toUpperCase()} API Key first.`,
      );
      setShowKeysConfig(true);
      return;
    }

    setOriginalText(textToImprove);
    setIsLoading(true);
    setCurrentActionLabel(PROMPT_TEMPLATES[type].label);

    try {
      const result = await callAI(
        selectedProvider,
        activeKey,
        PROMPT_TEMPLATES[type].system,
        textToImprove,
        customBaseUrl,
        customModel,
      );
      setSuggestedText(result);
      setHasSuggestion(true);
      toast.success("AI improvement generated!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during generation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTailorToJD = async () => {
    const textToImprove = selectedText || editorService.getSelectedText();
    if (!textToImprove) {
      toast.error("Please select a block of text/bullet in the editor to tailor!");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please paste a target Job Description in the Job Target Audit tab!");
      return;
    }

    if (!activeKey) {
      toast.error(
        `Please save your ${selectedProvider === "custom" ? "Custom" : selectedProvider.toUpperCase()} API Key first.`,
      );
      setShowKeysConfig(true);
      return;
    }

    setOriginalText(textToImprove);
    setIsLoading(true);
    setCurrentActionLabel("Tailoring text to Job Description");

    const systemPrompt = `You are an elite career coach and executive resume strategist specializing in software engineering and technology sectors. 
Your task is to rewrite the provided selected resume excerpt to align perfectly with the target Job Description (JD) provided.

Apply these precise targeting rules:
1. TECHNICAL ALIGNMENT: Map the candidate's achievements directly to high-priority tech stacks, languages, systems, and methodologies featured in the JD.
2. OUTCOME MAPPING: Frame achievements to demonstrate that the candidate has successfully resolved the exact challenges, scale requirements, or performance problems described in the JD.
3. ATS PARSING DENSITY: Seamlessly incorporate critical tech and domain keywords from the JD without losing grammatical flow.
4. HONEST BRANDING: Enhance the alignment, framing, active verbs, and quantification of the excerpt, but never invent fictional skills or false facts.

CRITICAL RESTRICTION: Return ONLY the rewritten excerpt itself. Absolutely no introductory words, no markdown block wrappers (do not wrap in \`\`\`), no quotes, and no post-rewrite commentary. Output must be directly pasteable.`;
    const userPrompt = `SELECTED EXCERPT:\n${textToImprove}\n\nTARGET JOB DESCRIPTION:\n${jobDescription}`;

    try {
      const result = await callAI(
        selectedProvider,
        activeKey,
        systemPrompt,
        userPrompt,
        customBaseUrl,
        customModel,
      );
      setSuggestedText(result);
      setHasSuggestion(true);
      toast.success("Excerpt successfully tailored!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during tailoring");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSuggestion = () => {
    editorService.replaceSelection(suggestedText);
    toast.success("Applied suggestion to editor!");
    handleDiscardSuggestion();
  };

  const handleDiscardSuggestion = () => {
    setOriginalText("");
    setSuggestedText("");
    setHasSuggestion(false);
  };

  const handleRunEvaluation = async () => {
    setEvaluationLoading(true);
    setEvaluationError("");
    setEvaluationReport(null);

    if (!activeKey) {
      setEvaluationLoading(false);
      setEvaluationError("Save an AI key to run resume evaluation. Local evaluation is disabled.");
      setShowKeysConfig(true);
      toast.error("Save an AI key to run evaluation.");
      return;
    }

    try {
      const prompt = buildEvaluationPrompt(doc.markdown, jobDescription);
      const result = await callAI(
        selectedProvider,
        activeKey,
        prompt.system,
        prompt.user,
        customBaseUrl,
        customModel,
      );
      const report = parseEvaluationResponse(result, jobDescription.trim().length > 0);
      setEvaluationReport(report);
      toast.success("Resume evaluation complete.");
    } catch (err: any) {
      setEvaluationError(
        err?.message
          ? `AI evaluation failed. ${err.message}`
          : "AI evaluation failed. Please retry after checking your provider settings.",
      );
      toast.error("AI evaluation failed.");
    } finally {
      setEvaluationLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste a target Job Description first!");
      return;
    }

    if (!activeKey) {
      toast.error(
        `Please save your ${selectedProvider === "custom" ? "Custom" : selectedProvider.toUpperCase()} API Key first.`,
      );
      setShowKeysConfig(true);
      return;
    }

    setCoverLetterLoading(true);
    setCoverLetter("");

    const systemPrompt = `You are an executive career strategist and master of persuasive writing. 
Your objective is to write an outstanding, tailored cover letter of under 400 words that links the candidate's actual resume accomplishments directly to the values and requirements of the target Job Description (JD).

Rigorously apply the following professional writing standards:
1. CAPTIVATING INTRO: Start with a strong hook expressing enthusiasm for the target role, showing immediate awareness of the company's business space.
2. RESUME INTEGRATION: Highlight 2-3 of the most impressive, metric-driven accomplishments from the candidate's resume that prove their ability to solve the primary challenges of the target job.
3. CULTURE & VALUE ALIGNMENT: Articulate why this specific candidate is an ideal cultural and strategic fit, drawing on subtle hints inside the JD.
4. CALL TO ACTION: Conclude with a confident, highly professional closing and a clear call to action regarding interviews.
5. COMPACT STYLE: Keep paragraphs brief, punchy, and highly personalized. Avoid generic templates (e.g., "I am writing to express my interest...").

CRITICAL RESTRICTION: Return ONLY the cover letter in beautiful Markdown format with clear spacing, but do not surround or wrap it with markdown codeblocks.`;
    const userPrompt = `CANDIDATE RESUME:\n${doc.markdown}\n\nTARGET JOB DESCRIPTION:\n${jobDescription}`;

    try {
      const result = await callAI(
        selectedProvider,
        activeKey,
        systemPrompt,
        userPrompt,
        customBaseUrl,
        customModel,
      );
      setCoverLetter(result);
      toast.success("Cover letter successfully generated!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during cover letter drafting");
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success("Cover letter copied to clipboard!");
  };

  return (
    <aside className="w-[420px] h-full border-l border-border bg-card flex flex-col overflow-hidden shrink-0 shadow-2xl relative z-10 animate-in slide-in-from-right duration-200">
      {/* Sidebar Header */}
      <div className="h-14 border-b border-border bg-secondary/30 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-indigo-500/10 rounded">
            <Sparkles className="size-4 text-indigo-400 fill-indigo-400 animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-sm font-bold tracking-tight text-transparent">
            ResumeOS AI Assistant
          </span>
        </div>
        <Button variant="ghost" size="icon" className="size-8" onClick={toggleAIPanel}>
          <X className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 flex flex-col">
        <div className="p-4 space-y-4">
          {/* BYOK Configuration Card */}
          <Card className="border-indigo-500/20 bg-indigo-950/5">
            <CardHeader
              className="p-3.5 pb-2 cursor-pointer flex flex-row items-center justify-between"
              onClick={() => setShowKeysConfig(!showKeysConfig)}
            >
              <div className="flex items-center gap-2">
                <Key className="size-3.5 text-indigo-400" />
                <span className="text-xs font-semibold">AI Settings (BYOK)</span>
                <Badge
                  variant={isKeySaved ? "secondary" : "outline"}
                  className={`text-[10px] py-0 px-1.5 ${isKeySaved ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 border-amber-500/20"}`}
                >
                  {isKeySaved ? "Configured" : "Needs Key"}
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground underline hover:text-foreground">
                {showKeysConfig ? "Collapse" : "Configure"}
              </span>
            </CardHeader>

            {showKeysConfig && (
              <CardContent className="p-3.5 pt-0 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    AI Provider
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full bg-secondary border border-border rounded-md text-xs py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="openai">OpenAI (GPT-4o-mini)</option>
                    <option value="anthropic">Anthropic (Claude Haiku)</option>
                    <option value="gemini">Google Gemini (1.5 Flash)</option>
                    <option value="custom">OpenAI-Compatible (DeepSeek, etc.)</option>
                  </select>
                </div>

                {selectedProvider === "custom" && (
                  <>
                    <div className="space-y-1.5 animate-in fade-in duration-150">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Base URL
                      </label>
                      <Input
                        type="text"
                        value={customBaseUrl}
                        onChange={(e) => setCustomBaseUrl(e.target.value)}
                        placeholder="https://api.deepseek.com/v1"
                        className="text-xs h-8 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5 animate-in fade-in duration-150">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Model Name
                      </label>
                      <Input
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="deepseek-chat"
                        className="text-xs h-8 font-mono"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      API Key
                    </label>
                    <a
                      href={
                        selectedProvider === "openai"
                          ? "https://platform.openai.com/api-keys"
                          : selectedProvider === "anthropic"
                            ? "https://console.anthropic.com/settings/keys"
                            : selectedProvider === "gemini"
                              ? "https://aistudio.google.com/app/apikey"
                              : "https://platform.deepseek.com/"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      Get{" "}
                      {selectedProvider === "custom" ? "Custom" : selectedProvider.toUpperCase()}{" "}
                      Key
                    </a>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <Input
                        type={showKey ? "text" : "password"}
                        value={activeKeyInput}
                        onChange={(e) => setActiveKeyInput(e.target.value)}
                        placeholder={`Paste ${selectedProvider === "custom" ? "Custom" : selectedProvider.toUpperCase()} API Key`}
                        className="text-xs py-1 h-8 pr-8 font-mono"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-2 py-1 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowKey(!showKey)}
                      >
                        {showKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleSaveKey}
                      className="h-8 text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground leading-normal">
                  API keys are stored in your browser local storage. Requests are sent directly from
                  this browser to the selected provider. Do not use shared devices for sensitive
                  keys.
                </p>
              </CardContent>
            )}
          </Card>

          {/* Main AI Interaction Tabs */}
          <Tabs defaultValue={ENABLE_IMPROVE_TEXT ? "improve" : "job"} className="w-full">
            <TabsList
              className={cn(
                "grid w-full h-9 p-0.5 bg-secondary/50 rounded-lg",
                ENABLE_IMPROVE_TEXT ? "grid-cols-3" : "grid-cols-2",
              )}
            >
              {ENABLE_IMPROVE_TEXT && (
                <TabsTrigger value="improve" className="text-[11px] font-medium py-1.5 rounded-md">
                  Improve Text
                </TabsTrigger>
              )}
              <TabsTrigger value="job" className="text-[11px] font-medium py-1.5 rounded-md">
                Resume Evaluation
              </TabsTrigger>
              <TabsTrigger value="cover" className="text-[11px] font-medium py-1.5 rounded-md">
                Cover Letter
              </TabsTrigger>
            </TabsList>

            {/* --- TAB 1: SELECTION ENHANCER --- */}
            {ENABLE_IMPROVE_TEXT && (
              <TabsContent value="improve" className="mt-4 space-y-4">
                {/* Highlight State Inspector */}
                <div className="p-3.5 border border-border/80 rounded-lg bg-secondary/20">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">
                    Selection Inspector
                  </span>
                  {selectedText ? (
                    <div className="space-y-2">
                      <div className="p-2 border border-border bg-card rounded text-xs leading-relaxed max-h-24 overflow-y-auto whitespace-pre-wrap font-mono text-muted-foreground italic">
                        &ldquo;{selectedText}&rdquo;
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="size-3" /> Ready to enhance ({selectedText.length}{" "}
                          chars)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center space-y-1.5">
                      <AlertCircle className="size-5 text-amber-400/80 mx-auto" />
                      <p className="text-xs text-muted-foreground px-2 leading-relaxed">
                        No selection detected. Please highlight a bullet, phrase, or paragraph in
                        the editor to use AI quick actions.
                      </p>
                    </div>
                  )}
                </div>

                {/* Standard Prompt Library */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                    AI Quick-Action Library
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(PROMPT_TEMPLATES).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => handleQuickAction(key as any)}
                        disabled={isLoading || !selectedText}
                        className="w-full flex items-start gap-3 p-2.5 rounded-lg border border-border bg-card hover:bg-secondary/40 text-left transition-all group disabled:opacity-50 disabled:hover:bg-card cursor-pointer disabled:cursor-not-allowed"
                      >
                        <div className="p-1.5 bg-indigo-500/10 rounded text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 shrink-0">
                          <Wand2 className="size-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-foreground leading-none group-hover:text-indigo-400">
                            {item.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground leading-normal">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loader */}
                {isLoading && (
                  <div className="p-8 text-center space-y-3 border border-indigo-500/20 rounded-lg bg-indigo-950/5">
                    <RefreshCw className="size-6 text-indigo-400 animate-spin mx-auto" />
                    <p className="text-xs text-muted-foreground animate-pulse font-medium">
                      {currentActionLabel}... Please stand by
                    </p>
                  </div>
                )}

                {/* Suggestion & Diff View */}
                {hasSuggestion && (
                  <Card className="border-emerald-500/30 bg-emerald-950/5 overflow-hidden animate-in fade-in duration-200">
                    <CardHeader className="p-3 border-b border-emerald-500/10 bg-emerald-500/5">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="size-3.5 text-emerald-400 fill-emerald-400" />
                          <span className="text-xs font-bold text-emerald-400">
                            AI Rewrite Suggestion
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:text-foreground"
                          onClick={handleDiscardSuggestion}
                        >
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 space-y-3.5">
                      {/* Side-by-Side Diff */}
                      <div className="grid grid-cols-1 gap-2.5 h-[240px] overflow-hidden rounded-md border border-border text-[11px] font-mono">
                        <div className="flex flex-col bg-red-950/10 h-1/2 overflow-auto border-b border-border">
                          <div className="bg-red-950/30 text-red-500 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shrink-0">
                            Original
                          </div>
                          <div className="p-2 text-red-300 leading-relaxed whitespace-pre-wrap flex-1 italic">
                            - {originalText}
                          </div>
                        </div>
                        <div className="flex flex-col bg-emerald-950/10 h-1/2 overflow-auto">
                          <div className="bg-emerald-950/30 text-emerald-400 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shrink-0">
                            Suggested Suggestion
                          </div>
                          <div className="p-2 text-emerald-300 leading-relaxed whitespace-pre-wrap flex-1">
                            + {suggestedText}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAcceptSuggestion}
                          className="flex-1 text-xs h-9 bg-emerald-600 hover:bg-emerald-500 text-white gap-1"
                        >
                          <Check className="size-3.5" /> Accept Suggestion
                        </Button>
                        <Button
                          onClick={handleDiscardSuggestion}
                          variant="outline"
                          className="text-xs h-9 border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-950/10 gap-1"
                        >
                          <X className="size-3.5" /> Discard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}

            {/* --- TAB 2: RESUME EVALUATION --- */}
            <TabsContent value="job" className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Target className="size-4 text-indigo-400" />
                  Target Job Description (Optional)
                </div>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste a JD for targeted keyword coverage, semantic alignment, and role-specific recommendations. Leave blank for a general resume review."
                  className="h-32 text-xs leading-relaxed resize-none focus-visible:ring-indigo-500"
                />
              </div>

              <Button
                onClick={handleRunEvaluation}
                disabled={evaluationLoading}
                className="w-full text-xs bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 h-9"
              >
                {evaluationLoading ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <BarChart3 className="size-3.5" />
                )}
                Evaluate Resume
              </Button>

              {/* Custom tailoring loader */}
              {isLoading && currentActionLabel.includes("Tailoring") && (
                <div className="p-8 text-center space-y-3 border border-indigo-500/20 rounded-lg bg-indigo-950/5">
                  <RefreshCw className="size-6 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs text-muted-foreground animate-pulse font-medium">
                    Tailoring excerpt to job criteria...
                  </p>
                </div>
              )}

              {/* Suggestion Diff showing within Job Tab too */}
              {hasSuggestion && currentActionLabel.includes("Tailoring") && (
                <Card className="border-emerald-500/30 bg-emerald-950/5 overflow-hidden animate-in fade-in duration-200 mt-2">
                  <CardHeader className="p-3 border-b border-emerald-500/10 bg-emerald-500/5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-emerald-400 fill-emerald-400" />
                        Tailored Rewrite Suggested
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-foreground"
                        onClick={handleDiscardSuggestion}
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 space-y-3.5">
                    <div className="grid grid-cols-1 gap-2.5 h-[220px] overflow-hidden rounded-md border border-border text-[11px] font-mono">
                      <div className="flex flex-col bg-red-950/10 h-1/2 overflow-auto border-b border-border">
                        <div className="bg-red-950/30 text-red-500 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shrink-0">
                          Original Selection
                        </div>
                        <div className="p-2 text-red-300 leading-relaxed whitespace-pre-wrap flex-1 italic">
                          - {originalText}
                        </div>
                      </div>
                      <div className="flex flex-col bg-emerald-950/10 h-1/2 overflow-auto">
                        <div className="bg-emerald-950/30 text-emerald-400 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider shrink-0">
                          AI Rewritten Excerpt
                        </div>
                        <div className="p-2 text-emerald-300 leading-relaxed whitespace-pre-wrap flex-1">
                          + {suggestedText}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleAcceptSuggestion}
                        className="flex-1 text-xs h-9 bg-emerald-600 hover:bg-emerald-500 text-white gap-1"
                      >
                        <Check className="size-3.5" /> Integrate Text
                      </Button>
                      <Button
                        onClick={handleDiscardSuggestion}
                        variant="outline"
                        className="text-xs h-9 border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-950/10 gap-1"
                      >
                        <X className="size-3.5" /> Discard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {evaluationError && (
                <div className="rounded-md border border-amber-500/20 bg-amber-950/10 p-3 text-[11px] leading-relaxed text-amber-300">
                  {evaluationError}
                </div>
              )}

              {evaluationReport && (
                <EvaluationSummaryCard
                  report={evaluationReport}
                  onOpenReport={() => setReportOpen(true)}
                />
              )}
            </TabsContent>

            {/* --- TAB 3: COVER LETTER --- */}
            <TabsContent value="cover" className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Briefcase className="size-4 text-indigo-400" />
                  Target Job Description (JD)
                </div>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target Job Description here to write a matching cover letter..."
                  className="h-28 text-xs leading-relaxed resize-none focus-visible:ring-indigo-500"
                />
              </div>

              <Button
                onClick={handleGenerateCoverLetter}
                disabled={coverLetterLoading || !jobDescription.trim()}
                className="w-full text-xs bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5 h-9"
              >
                {coverLetterLoading ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <FileText className="size-3.5" />
                )}
                Draft Tailored Cover Letter
              </Button>

              {coverLetterLoading && (
                <div className="p-8 text-center space-y-3 border border-indigo-500/20 rounded-lg bg-indigo-950/5">
                  <RefreshCw className="size-6 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs text-muted-foreground animate-pulse font-medium">
                    Drafting cover letter...
                  </p>
                </div>
              )}

              {/* Cover Letter Output Card */}
              {coverLetter && (
                <Card className="border-border bg-secondary/10 overflow-hidden animate-in fade-in duration-200">
                  <CardHeader className="p-3 border-b border-border bg-secondary/30 flex flex-row items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Drafted Cover Letter</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-indigo-400 hover:text-indigo-300"
                      onClick={handleCopyCoverLetter}
                    >
                      <Clipboard className="size-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-3.5">
                    <ScrollArea className="h-[280px] pr-2.5">
                      <div className="text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap font-sans">
                        {coverLetter}
                      </div>
                    </ScrollArea>
                    <Button
                      onClick={handleCopyCoverLetter}
                      className="w-full mt-3 text-xs bg-secondary hover:bg-secondary/80 text-foreground gap-1.5 h-8"
                    >
                      <Clipboard className="size-3.5" /> Copy Cover Letter
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Panel Footer Security Note */}
      <div className="h-10 border-t border-border bg-secondary/30 flex items-center justify-center px-4 shrink-0 text-[9px] text-muted-foreground gap-1">
        <HelpCircle className="size-3 text-muted-foreground" />
        <span>
          Local browser key storage. Provider requests are sent directly from this browser.
        </span>
      </div>
      {evaluationReport && (
        <EvaluationReportDialog
          report={evaluationReport}
          open={reportOpen}
          onOpenChange={setReportOpen}
          mounted={mounted}
        />
      )}
    </aside>
  );
}

function scoreTone(score: number) {
  if (score >= 75) return "text-emerald-400";
  if (score >= 55) return "text-amber-400";
  return "text-red-400";
}

function progressTone(score: number) {
  if (score >= 75) return "[&>div]:bg-emerald-500";
  if (score >= 55) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-red-500";
}

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied.`);
}

function EvaluationSummaryCard({
  report,
  onOpenReport,
}: {
  report: ResumeEvaluationReport;
  onOpenReport: () => void;
}) {
  const topIssues = [...report.criticalIssues, ...report.recommendations].slice(0, 4);

  return (
    <Card className="border-indigo-500/20 bg-indigo-950/5 animate-in fade-in duration-200">
      <CardHeader className="p-4 border-b border-indigo-500/10 bg-indigo-500/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Award className="size-4" />
            Resume Evaluation
          </CardTitle>
          <Badge variant="outline" className="text-[10px]">
            AI
          </Badge>
        </div>
        <CardDescription className="text-[10px]">
          {report.metadata.hasJobDescription ? "JD-aware review" : "General resume review"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-muted-foreground">Overall Score</span>
            <span className={cn("font-bold font-mono", scoreTone(report.overallScore))}>
              {report.overallScore}%
            </span>
          </div>
          <Progress
            value={report.overallScore}
            className={cn("h-2", progressTone(report.overallScore))}
          />
        </div>

        {topIssues.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Priority Fixes
            </span>
            <ul className="space-y-2 text-[11px] leading-relaxed text-muted-foreground">
              {topIssues.map((issue, index) => (
                <li key={`${issue.title}-${index}`} className="flex gap-2 items-start">
                  <span
                    className={cn(
                      "size-1.5 rounded-full mt-1.5 shrink-0",
                      issue.severity === "critical" ? "bg-red-400" : "bg-amber-400",
                    )}
                  />
                  <span>{issue.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.missingKeywords.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Missing Keywords
            </span>
            <div className="flex flex-wrap gap-1.5">
              {report.missingKeywords.slice(0, 8).map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="text-[10px] py-0.5 px-2 bg-indigo-950/40 border-indigo-500/20 text-indigo-300"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={onOpenReport}
          variant="outline"
          className="w-full text-xs border-indigo-500/20 text-indigo-400 hover:bg-indigo-950/10"
        >
          View Full Report
        </Button>
      </CardContent>
    </Card>
  );
}

function EvaluationReportDialog({
  report,
  open,
  onOpenChange,
  mounted,
}: {
  report: ResumeEvaluationReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mounted: boolean;
}) {
  const chartData = report.categoryScores.map((category) => ({
    category: category.label.replace(" & ", " / "),
    score: category.score,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b border-border bg-card">
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-indigo-400" />
            Resume Evaluation Report
          </DialogTitle>
          <DialogDescription>
            {report.metadata.hasJobDescription
              ? "AI resume and job-description alignment analysis."
              : "General resume analysis. Add a job description for role-specific coverage."}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-88px)]">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-[220px_1fr] gap-6">
              <Card className="p-4 space-y-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Overall Score
                </div>
                <div className={cn("text-5xl font-bold font-mono", scoreTone(report.overallScore))}>
                  {report.overallScore}
                </div>
                <Progress
                  value={report.overallScore}
                  className={cn("h-2", progressTone(report.overallScore))}
                />
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  AI-generated review from the supplied resume and optional job description.
                </div>
              </Card>

              <Card className="p-4">
                {mounted ? (
                  <ChartContainer
                    config={{ score: { label: "Score", color: "oklch(0.68 0.16 260)" } }}
                    className="h-[260px] w-full"
                  >
                    <RadarChart data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Radar
                        dataKey="score"
                        stroke="var(--color-score)"
                        fill="var(--color-score)"
                        fillOpacity={0.24}
                      />
                    </RadarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[260px] rounded-md bg-secondary/40" />
                )}
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {report.categoryScores.map((category) => (
                <CategoryScoreCard key={category.id} category={category} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <IssueColumn
                title="Critical Issues"
                icon={<ShieldAlert className="size-4 text-red-400" />}
                issues={report.criticalIssues}
                empty="No critical issues found."
              />
              <IssueColumn
                title="Recommendations"
                icon={<AlertCircle className="size-4 text-amber-400" />}
                issues={report.recommendations}
                empty="No recommendations yet."
              />
              <IssueColumn
                title="Nice-to-haves"
                icon={<Sparkles className="size-4 text-emerald-400" />}
                issues={report.niceToHaves}
                empty="No nice-to-haves yet."
              />
            </div>

            {report.keywordCoverage.length > 0 && (
              <ReportSection title="JD Coverage Map">
                <div className="grid grid-cols-2 gap-2">
                  {report.keywordCoverage.map((item) => (
                    <KeywordCoverageRow key={item.keyword} item={item} />
                  ))}
                </div>
              </ReportSection>
            )}

            {report.suggestedPlacements.length > 0 && (
              <ReportSection
                title="Suggested Keyword Placement"
                action={() => copyText(report.suggestedPlacements.join("\n"), "Placements")}
              >
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {report.suggestedPlacements.map((placement, index) => (
                    <li key={`${placement}-${index}`} className="flex gap-2">
                      <span className="text-indigo-400">{index + 1}.</span>
                      <span>{placement}</span>
                    </li>
                  ))}
                </ul>
              </ReportSection>
            )}

            {report.bulletRewrites.length > 0 && (
              <ReportSection title="Copy-ready Bullet Rewrites">
                <div className="space-y-3">
                  {report.bulletRewrites.map((rewrite, index) => (
                    <Card key={`${rewrite.original}-${index}`} className="p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-red-300 font-bold mb-1">
                            Original
                          </div>
                          <div className="text-muted-foreground whitespace-pre-wrap">
                            {rewrite.original}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">
                              Rewrite
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-6"
                              onClick={() => copyText(rewrite.rewrite, "Rewrite")}
                            >
                              <Copy className="size-3.5" />
                            </Button>
                          </div>
                          <div className="text-emerald-200 whitespace-pre-wrap">
                            {rewrite.rewrite}
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-muted-foreground">{rewrite.reason}</div>
                    </Card>
                  ))}
                </div>
              </ReportSection>
            )}

            <div className="grid grid-cols-3 gap-4">
              <TextListCard
                title="Recruiter Perspective"
                items={[report.recruiterSummary]}
                copyLabel="Summary"
              />
              <TextListCard title="Likely Interview Questions" items={report.interviewQuestions} />
              <TextListCard title="Skills Gap" items={report.skillsGap} />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function CategoryScoreCard({ category }: { category: EvaluationCategoryScore }) {
  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold">{category.label}</div>
        <div className={cn("text-xs font-bold font-mono", scoreTone(category.score))}>
          {category.score}
        </div>
      </div>
      <Progress value={category.score} className={cn("h-1.5", progressTone(category.score))} />
      <div className="text-[11px] leading-relaxed text-muted-foreground">{category.summary}</div>
    </Card>
  );
}

function IssueColumn({
  title,
  icon,
  issues,
  empty,
}: {
  title: string;
  icon: React.ReactNode;
  issues: EvaluationIssue[];
  empty: string;
}) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </div>
      {issues.length === 0 ? (
        <div className="text-xs text-muted-foreground">{empty}</div>
      ) : (
        <ul className="space-y-3">
          {issues.map((issue, index) => (
            <li key={`${issue.title}-${index}`} className="space-y-1">
              <div className="text-xs font-semibold">{issue.title}</div>
              <div className="text-[11px] leading-relaxed text-muted-foreground">
                {issue.detail}
              </div>
              {issue.section && (
                <Badge variant="outline" className="text-[10px]">
                  {issue.section}
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function KeywordCoverageRow({ item }: { item: KeywordCoverageItem }) {
  const color =
    item.status === "covered"
      ? "text-emerald-400 border-emerald-500/20"
      : item.status === "weak"
        ? "text-amber-400 border-amber-500/20"
        : item.status === "missing"
          ? "text-red-400 border-red-500/20"
          : "text-muted-foreground border-border";

  return (
    <div className="rounded-md border border-border p-3 space-y-1">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">{item.keyword}</span>
        <Badge variant="outline" className={cn("text-[10px]", color)}>
          {item.status}
        </Badge>
      </div>
      {(item.placement || item.evidence) && (
        <div className="text-[11px] leading-relaxed text-muted-foreground">
          {item.evidence || item.placement}
        </div>
      )}
    </div>
  );
}

function ReportSection({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: () => void;
}) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        {action && (
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={action}>
            <Copy className="size-3.5" />
            Copy
          </Button>
        )}
      </div>
      {children}
    </Card>
  );
}

function TextListCard({
  title,
  items,
  copyLabel,
}: {
  title: string;
  items: string[];
  copyLabel?: string;
}) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        {copyLabel && items[0] && (
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            onClick={() => copyText(items[0], copyLabel)}
          >
            <Copy className="size-3.5" />
          </Button>
        )}
      </div>
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground">Not available for this report.</div>
      ) : (
        <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
