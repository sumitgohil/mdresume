import { describe, expect, it } from "vitest";
import { SAMPLE_MARKDOWN } from "../src/data/resume";
import { parseResume, validateResumeMarkdown } from "../src/lib/resumeSchema";

function issueIds(markdown: string) {
  return validateResumeMarkdown(markdown).map((issue) => issue.id);
}

describe("resume schema parser and validation", () => {
  it("accepts the bundled sample resume without warning-level validation issues", () => {
    const issues = validateResumeMarkdown(SAMPLE_MARKDOWN);

    expect(issues.filter((issue) => issue.severity !== "info")).toEqual([]);
  });

  it("extracts a plain Markdown body header when frontmatter is absent", () => {
    const parsed = parseResume(`# Jane Doe
jane@example.com | linkedin.com/in/janedoe

## Summary

- Built support tooling for hiring teams.
- Improved onboarding completion by 20%.
- Wrote clear docs for teammates.

## Experience

## Education`);

    expect(parsed.data).toEqual({});
    expect(parsed.bodyHeader).toEqual({
      name: "Jane Doe",
      contact: "jane@example.com | linkedin.com/in/janedoe",
    });
    expect(parsed.content).not.toContain("# Jane Doe");
    expect(parsed.content).not.toContain("jane@example.com");
  });

  it("reports malformed frontmatter without discarding the body", () => {
    const parsed = parseResume(`---
name Alex Chen
---

## Summary`);

    expect(parsed.frontmatterError).toMatchObject({
      id: "frontmatter-invalid-line",
      severity: "error",
      line: 2,
    });
    expect(parsed.content).toContain("## Summary");
  });

  it("flags unclosed frontmatter, missing identity, and missing contact details", () => {
    const ids = issueIds(`---
name: Alex Chen

## Summary`);

    expect(ids).toContain("frontmatter-unclosed");
    expect(ids).toContain("missing-name");
    expect(ids).toContain("missing-contact");
  });

  it("validates contact fields and URL-like profile links", () => {
    const ids = issueIds(`---
name: Alex Chen
email: not-an-email
github: alexchen
linkedin: linkedin.com/in/alexchen
website: https://alexchen.dev
---

## Summary

## Experience

## Education

- One
- Two
- Three`);

    expect(ids).toContain("invalid-email");
    expect(ids).toContain("invalid-github");
    expect(ids).not.toContain("invalid-linkedin");
    expect(ids).not.toContain("invalid-website");
  });

  it("warns when a resume has too little scan-friendly structure", () => {
    const ids = issueIds(`---
name: Alex Chen
email: alex@example.com
---

Short summary only.`);

    expect(ids).toContain("few-sections");
    expect(ids).toContain("few-bullets");
  });
});
