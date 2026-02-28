export const EVALUATION_CATEGORIES = [
  { id: "keywordAlignment", label: "Keyword & JD Alignment" },
  { id: "narrative", label: "Storytelling & Narrative" },
  { id: "impact", label: "Impact & Achievement" },
  { id: "engagement", label: "Reviewer Interest" },
  { id: "structure", label: "Structure & Completeness" },
  { id: "writing", label: "Writing Quality" },
  { id: "lengthDensity", label: "Length & Density" },
  { id: "roleCustomization", label: "Role Customization" },
  { id: "credibility", label: "Credibility & Trust" },
  { id: "biasInclusivity", label: "Bias & Inclusivity" },
  { id: "advancedAi", label: "Advanced AI Insights" },
  { id: "memorability", label: "Differentiation" },
  { id: "markdownQuality", label: "Markdown Quality" },
] as const;

export type EvaluationCategoryId = (typeof EVALUATION_CATEGORIES)[number]["id"];
export type EvaluationIssueSeverity = "critical" | "recommendation" | "nice";

export interface EvaluationCategoryScore {
  id: EvaluationCategoryId;
  label: string;
  score: number;
  summary: string;
}

export interface EvaluationIssue {
  severity: EvaluationIssueSeverity;
  title: string;
  detail: string;
  section?: string;
}

export interface KeywordCoverageItem {
  keyword: string;
  status: "covered" | "missing" | "weak" | "notEvaluated";
  placement?: string;
  evidence?: string;
}

export interface BulletRewriteSuggestion {
  original: string;
  rewrite: string;
  reason: string;
}

export interface ResumeEvaluationReport {
  overallScore: number;
  categoryScores: EvaluationCategoryScore[];
  criticalIssues: EvaluationIssue[];
  recommendations: EvaluationIssue[];
  niceToHaves: EvaluationIssue[];
  keywordCoverage: KeywordCoverageItem[];
  missingKeywords: string[];
  suggestedPlacements: string[];
  bulletRewrites: BulletRewriteSuggestion[];
  recruiterSummary: string;
  interviewQuestions: string[];
  skillsGap: string[];
  metadata: {
    hasJobDescription: boolean;
    generatedAt: string;
    source: "ai";
  };
}
