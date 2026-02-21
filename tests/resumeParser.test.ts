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

  it("falls back to body-only content when frontmatter is absent", () => {
    const parsed = parseResume("# Jane Doe\n\n## Experience");

    expect(parsed.data).toEqual({});
    expect(parsed.content).toContain("Jane Doe");
  });
});
