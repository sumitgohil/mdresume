import { describe, expect, it } from "vitest";
import { examples, findTemplate, templates, THEMES } from "../src/data/resume";
import { parseResume, validateResumeMarkdown } from "../src/lib/resumeSchema";

describe("resume content data", () => {
  it("keeps theme, template, and example identifiers unique", () => {
    const themeIds = THEMES.map((theme) => theme.id);
    const templateIds = templates.map((template) => template.id);
    const exampleIds = examples.map((example) => example.id);

    expect(new Set(themeIds).size).toBe(themeIds.length);
    expect(new Set(templateIds).size).toBe(templateIds.length);
    expect(new Set(exampleIds).size).toBe(exampleIds.length);
  });

  it("keeps every template mapped to a real theme", () => {
    const themeIds = new Set(THEMES.map((theme) => theme.id));

    expect(templates).toHaveLength(THEMES.length);
    for (const template of templates) {
      expect(themeIds.has(template.themeId)).toBe(true);
      expect(template.sampleMarkdown).toContain("## Professional Summary");
      expect(template.name.trim()).toBeTruthy();
      expect(template.description.trim()).toBeTruthy();
      expect(template.audience.trim()).toBeTruthy();
    }
  });

  it("keeps every example mapped to a real template", () => {
    const templateIds = new Set(templates.map((template) => template.id));

    for (const example of examples) {
      expect(templateIds.has(example.templateId)).toBe(true);
      expect(example.tags.length).toBeGreaterThan(0);
      expect(findTemplate(example.templateId).id).toBe(example.templateId);
    }
  });

  it("keeps example resumes parseable and complete enough for the editor", () => {
    for (const example of examples) {
      const parsed = parseResume(example.markdown);
      const issues = validateResumeMarkdown(example.markdown);
      const blockingIssues = issues.filter((issue) => issue.severity !== "info");

      expect(parsed.data.name, example.id).toBeTruthy();
      expect(parsed.data.title || example.role, example.id).toBeTruthy();
      expect(parsed.data.email || parsed.data.phone, example.id).toBeTruthy();
      expect(parsed.content, example.id).toContain("## ");
      expect(parsed.content.match(/^\s*[-*]\s+/gm)?.length || 0, example.id).toBeGreaterThanOrEqual(3);
      expect(blockingIssues, example.id).toEqual([]);
    }
  });

  it("falls back to the first template for unknown template ids", () => {
    expect(findTemplate("does-not-exist")).toBe(templates[0]);
  });
});
