import { describe, expect, it } from "vitest";
import {
  getImportedResumeName,
  isMarkdownFile,
  sanitizeMarkdownFilename,
} from "../src/lib/markdownFiles";

describe("markdown file helpers", () => {
  it("sanitizes downloaded resume filenames", () => {
    expect(sanitizeMarkdownFilename("Alex Chen.md")).toBe("Alex-Chen.md");
    expect(sanitizeMarkdownFilename("  senior resume 2026.markdown  ")).toBe("senior-resume-2026.md");
    expect(sanitizeMarkdownFilename("../../../secret")).toBe("secret.md");
    expect(sanitizeMarkdownFilename("")).toBe("resume.md");
  });

  it("prefers parsed resume names when importing Markdown", () => {
    expect(
      getImportedResumeName(
        `---
name: Priya Nair
---

## Summary`,
        "fallback-file.md",
      ),
    ).toBe("Priya Nair");

    expect(getImportedResumeName("# Jane Doe\njane@example.com\n\n## Summary", "fallback-file.md")).toBe(
      "Jane Doe",
    );
  });

  it("falls back to a readable filename when imported Markdown has no name", () => {
    expect(getImportedResumeName("## Summary", "backend_engineer-resume.markdown")).toBe(
      "backend engineer resume",
    );
    expect(getImportedResumeName("## Summary", ".md")).toBe("Imported Resume");
  });

  it("accepts Markdown file extensions only", () => {
    expect(isMarkdownFile(new File([""], "resume.md"))).toBe(true);
    expect(isMarkdownFile(new File([""], "resume.markdown"))).toBe(true);
    expect(isMarkdownFile(new File([""], "resume.txt"))).toBe(false);
    expect(isMarkdownFile(new File([""], "resume.pdf"))).toBe(false);
  });
});
