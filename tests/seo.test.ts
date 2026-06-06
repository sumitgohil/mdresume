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
  organizationSchema,
  softwareApplicationSchema,
  SITE,
  webApplicationSchema,
  webPageSchema,
} from "../src/lib/seo";

describe("seo helpers", () => {
  it("creates deterministic canonical URLs", () => {
    expect(getCanonicalUrl("/templates/")).toBe("https://mdresume.app/templates");
    expect(getCanonicalUrl("examples")).toBe("https://mdresume.app/examples");
    expect(getCanonicalUrl("/")).toBe("https://mdresume.app/");
  });

  it("normalizes titles and descriptions", () => {
    expect(getSeoTitle("Resume Templates")).toBe("Resume Templates | MDResume");
    expect(getSeoTitle("Resume Templates | MDResume")).toBe("Resume Templates | MDResume");
    expect(getSeoTitle()).toBe("MDResume | Open-source Markdown Resume Builder");
    expect(getSeoDescription("x".repeat(180))).toHaveLength(160);
    expect(getImageAlt("AI Resume Builder")).toContain("AI Resume Builder");
    expect(getImageAlt("Ignored", "Custom preview")).toBe("Custom preview");
  });

  it("creates deterministic generated OG image URLs", () => {
    expect(getOgLocale("en")).toBe("en_US");
    expect(getOgImageFilename("/", "en")).toBe("en-home");
    expect(getOgImageFilename("/templates", "en")).toBe("en-templates");
    expect(getOgImageFilename("/ai-resume", "en")).toBe("en-ai-resume");
    expect(getOgImageFilename("/blog/ats-resume-guide-software-engineers", "en")).toBe(
      "en-blog--ats-resume-guide-software-engineers",
    );
    expect(getOgImageUrl({ pathname: "/ai-resume" })).toBe("https://mdresume.app/_og/en-ai-resume.png");
    expect(getOgImageUrl({ image: "/custom.png", pathname: "/ai-resume" })).toBe(
      "https://mdresume.app/custom.png",
    );
  });

  it("returns valid JSON-LD compatible schema objects", () => {
    const schemas = [
      organizationSchema(),
      webPageSchema("/templates", "Resume Templates", "Browse templates"),
      webApplicationSchema(),
      softwareApplicationSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "AI Resume", path: "/ai-resume" },
      ]),
      blogPostingSchema({
        pathname: "/blog/ats-resume-guide-software-engineers",
        title: "ATS Resume Guide for Software Engineers",
        description: "Use job descriptions to place resume keywords honestly.",
        publishDate: "2026-06-06",
        tags: ["ATS", "Software Engineering"],
      }),
    ];

    for (const schema of schemas) {
      expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
      expect(schema).toHaveProperty("@context", "https://schema.org");
    }
  });

  it("links creator schema entities back to the public LinkedIn profile", () => {
    const organization = organizationSchema();
    const application = webApplicationSchema();
    const post = blogPostingSchema({
      pathname: "/blog/resume-bullet-points-software-engineers",
      title: "Resume Bullet Points for Software Engineers",
      description: "Write software engineer resume bullets with credible impact.",
      publishDate: "2026-06-05",
    });

    expect(SITE.authorUrl).toBe("https://www.linkedin.com/in/sumit-gohil/");
    expect(organization.founder).toMatchObject({ name: SITE.author, url: SITE.authorUrl });
    expect(application.creator).toMatchObject({ name: SITE.author, url: SITE.authorUrl });
    expect(post.author).toMatchObject({ name: SITE.author, url: SITE.authorUrl });
  });
});
