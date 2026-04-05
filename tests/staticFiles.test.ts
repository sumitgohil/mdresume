import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("cloudflare public files", () => {
  it("documents the app for AI crawlers", () => {
    const llms = readFileSync("public/llms.txt", "utf8");

    expect(llms).toContain("MDResume");
    expect(llms).toContain("Markdown Resume");
    expect(llms).toContain("BYOK AI resume");
    expect(llms).toContain("/ai-resume");
    expect(llms).toContain("/templates");
  });

  it("sets security headers for Cloudflare Pages", () => {
    const headers = readFileSync("public/_headers", "utf8");

    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("Permissions-Policy");
  });

  it("keeps indexable routes and editor crawl policy explicit", () => {
    const sitemap = readFileSync("src/pages/sitemap.xml.ts", "utf8");
    const robots = readFileSync("src/pages/robots.txt.ts", "utf8");
    const editor = readFileSync("src/pages/editor/index.astro", "utf8");

    expect(sitemap).toContain('"/ai-resume"');
    expect(sitemap).not.toContain('"/editor"');
    expect(robots).toContain("Disallow: /editor");
    expect(robots).toContain("GPTBot");
    expect(robots).toContain("ClaudeBot");
    expect(editor).toContain('content="noindex, nofollow"');
  });
});
