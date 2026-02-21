import { describe, expect, it } from "vitest";
import { examples, findTemplate, templates, THEMES } from "../src/data/resume";

describe("resume content data", () => {
  it("keeps every template mapped to a real theme", () => {
    const themeIds = new Set(THEMES.map((theme) => theme.id));

    expect(templates).toHaveLength(THEMES.length);
    for (const template of templates) {
      expect(themeIds.has(template.themeId)).toBe(true);
      expect(template.sampleMarkdown).toContain("## Professional Summary");
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
});
