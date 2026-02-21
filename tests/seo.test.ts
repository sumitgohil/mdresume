import { describe, expect, it } from "vitest";
import {
  faqSchema,
  getCanonicalUrl,
  getSeoDescription,
  getSeoTitle,
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
  });

  it("returns valid JSON-LD compatible schema objects", () => {
    const schemas = [
      webPageSchema("/templates", "Resume Templates", "Browse templates"),
      webApplicationSchema(),
      faqSchema([{ question: "Is it open source?", answer: "Yes." }]),
    ];

    for (const schema of schemas) {
      expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
      expect(schema).toHaveProperty("@context", "https://schema.org");
    }
  });
});
