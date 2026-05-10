import { describe, expect, it } from "vitest";
import { SAMPLE_MARKDOWN } from "../src/data/resume";
import { parseResume } from "../src/lib/resumeParser";

describe("resume parser", () => {
  it("extracts frontmatter and body content", () => {
    const parsed = parseResume(SAMPLE_MARKDOWN);

    expect(parsed.data.name).toBe("Alex Chen");
    expect(parsed.data.title).toBe("Senior Software Engineer");
    expect(parsed.content).toContain("## Professional Summary");
  });

  it("trims parsed body content after frontmatter", () => {
    const parsed = parseResume(`---
name: "Quoted Name"
title: 'Quoted Title'
---

# Body
`);

    expect(parsed.data.name).toBe("Quoted Name");
    expect(parsed.data.title).toBe("Quoted Title");
    expect(parsed.content).toBe("# Body");
  });

  it("falls back to body-only content when frontmatter is absent", () => {
    const parsed = parseResume("# Jane Doe\n\n## Experience");

    expect(parsed.data).toEqual({});
    expect(parsed.content).toContain("Jane Doe");
  });

  it("preserves malformed frontmatter as body content instead of dropping resume text", () => {
    const markdown = "---\nname: Alex Chen\n\n## Experience";
    const parsed = parseResume(markdown);

    expect(parsed.data).toEqual({});
    expect(parsed.content).toBe(markdown);
  });
});
