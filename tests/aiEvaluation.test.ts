import { describe, expect, it } from "vitest";
import { buildEvaluationPrompt, parseEvaluationResponse } from "../src/lib/aiEvaluation";
import { EVALUATION_CATEGORIES } from "../src/lib/resumeEvaluation";

const minimalReport = {
  overallScore: 133,
  categoryScores: [
    {
      id: "keywordAlignment",
      label: "Custom label",
      score: -10,
      summary: "Compared against the supplied role.",
    },
  ],
  criticalIssues: [
    {
      severity: "critical",
      title: "Missing role focus",
      detail: "The resume does not name the target role.",
      section: "Summary",
    },
  ],
  recommendations: [],
  niceToHaves: [],
  keywordCoverage: [{ keyword: "React", status: "covered", placement: "Skills" }],
  missingKeywords: ["GraphQL"],
  suggestedPlacements: ["Add GraphQL to a real project bullet."],
  bulletRewrites: [
    {
      original: "- Built dashboards.",
      rewrite: "- Built dashboards that reduced reporting time by [X]%.",
      reason: "Adds measurable impact.",
    },
  ],
  recruiterSummary: "Strong base with a few targeting gaps.",
  interviewQuestions: ["How did you measure dashboard adoption?"],
  skillsGap: ["GraphQL"],
};

describe("AI evaluation parsing and prompts", () => {
  it("normalizes model JSON into the full 13-category report shape", () => {
    const report = parseEvaluationResponse(JSON.stringify(minimalReport), true);

    expect(report.overallScore).toBe(100);
    expect(report.categoryScores).toHaveLength(EVALUATION_CATEGORIES.length);
    expect(report.categoryScores[0]).toMatchObject({
      id: "keywordAlignment",
      label: "Custom label",
      score: 0,
    });
    expect(report.categoryScores[1]).toMatchObject({
      id: EVALUATION_CATEGORIES[1].id,
      label: EVALUATION_CATEGORIES[1].label,
      score: 60,
      summary: "Not evaluated in detail.",
    });
    expect(report.metadata).toMatchObject({ hasJobDescription: true, source: "ai" });
    expect(new Date(report.metadata.generatedAt).toString()).not.toBe("Invalid Date");
  });

  it("accepts JSON wrapped in a markdown code fence", () => {
    const report = parseEvaluationResponse(`\`\`\`json
${JSON.stringify({ ...minimalReport, overallScore: 72 })}
\`\`\``, false);

    expect(report.overallScore).toBe(72);
    expect(report.metadata.hasJobDescription).toBe(false);
  });

  it("builds prompts that forbid invented resume facts", () => {
    const prompt = buildEvaluationPrompt("## Experience", "React engineer role");

    expect(prompt.system).toContain("Return ONLY valid JSON");
    expect(prompt.system).toContain("Do not invent candidate experience");
    expect(prompt.system).toContain("keywordAlignment: Keyword & JD Alignment");
    expect(prompt.user).toContain("RESUME MARKDOWN:");
    expect(prompt.user).toContain("JOB DESCRIPTION STATUS: Provided");
    expect(prompt.user).toContain("React engineer role");
  });

  it("marks job description context as absent when none is supplied", () => {
    const prompt = buildEvaluationPrompt("## Experience", "   ");

    expect(prompt.user).toContain("JOB DESCRIPTION STATUS: Not provided");
    expect(prompt.user).not.toContain("TARGET JOB DESCRIPTION:");
  });
});
