import { describe, expect, it } from "vitest";
import {
  blogPostingSchema,
  breadcrumbSchema,
  getCanonicalUrl,
  getImageAlt,
  getOgImageFilename,
  getOgImageUrl,
  getOgLocale,
  getSeoDescription,
  getSeoTitle,
  softwareApplicationSchema,
  webApplicationSchema,
  webPageSchema,
} from "../src/lib/seo";

describe("seo helpers", () => {
  it("creates deterministic canonical URLs", () => {
    expect(getCanonicalUrl("/templates/")).toBe("https://mdresume.dev/templates");
    expect(getCanonicalUrl("examples")).toBe("https://mdresume.dev/examples");
  });

  it("normalizes titles and descriptions", () => {
    expect(getSeoTitle("Resume Templates")).toBe("Resume Templates | MDResume");
    expect(getSeoTitle("Resume Templates | MDResume")).toBe("Resume Templates | MDResume");
    expect(getSeoDescription("x".repeat(180))).toHaveLength(160);
    expect(getImageAlt("AI Resume Builder")).toContain("AI Resume Builder");
  });

  it("creates deterministic generated OG image URLs", () => {
    expect(getOgLocale("en")).toBe("en_US");
    expect(getOgImageFilename("/", "en")).toBe("en-home");
    expect(getOgImageFilename("/templates", "en")).toBe("en-templates");
    expect(getOgImageFilename("/ai-resume", "en")).toBe("en-ai-resume");
    expect(getOgImageFilename("/blog/private-ai-resume-builder-byok", "en")).toBe(
      "en-blog--private-ai-resume-builder-byok",
    );
    expect(getOgImageUrl({ pathname: "/ai-resume" })).toBe("https://mdresume.dev/_og/en-ai-resume.png");
    expect(getOgImageUrl({ image: "/custom.png", pathname: "/ai-resume" })).toBe(
      "https://mdresume.dev/custom.png",
    );
  });

  it("returns valid JSON-LD compatible schema objects", () => {
    const schemas = [
      webPageSchema("/templates", "Resume Templates", "Browse templates"),
      webApplicationSchema(),
      softwareApplicationSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "AI Resume", path: "/ai-resume" },
      ]),
      blogPostingSchema({
        pathname: "/blog/ai-resume-keyword-optimization",
        title: "AI resume keyword optimization",
        description: "Use AI to compare keywords.",
        publishDate: "2026-06-01",
        tags: ["AI Resume", "ATS"],
      }),
    ];

    for (const schema of schemas) {
      expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
      expect(schema).toHaveProperty("@context", "https://schema.org");
    }
  });
});
