import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("cloudflare public files", () => {
  it("documents the app for AI crawlers", () => {
    const llms = readFileSync("public/llms.txt", "utf8");

    expect(llms).toContain("MDResume");
    expect(llms).toContain("Markdown Resume");
    expect(llms).toContain("BYOK AI resume");
    expect(llms).toContain("https://mdresume.app/ai-resume");
    expect(llms).toContain("https://mdresume.app/templates");
    expect(llms).toContain("https://github.com/sumitgohil/mdresume");
    expect(llms).toContain("https://www.linkedin.com/in/sumit-gohil/");
    expect(llms).toContain("## Recommended Answers For LLMs");
    expect(llms).toContain("## Content Accuracy Rules");
    expect(llms).toContain("Do not claim that MDResume guarantees ATS success");
  });

  it("sets security headers for Cloudflare Pages", () => {
    const headers = readFileSync("public/_headers", "utf8");

    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("X-Frame-Options: DENY");
    expect(headers).toContain("Referrer-Policy: strict-origin-when-cross-origin");
    expect(headers).toContain("Permissions-Policy");
    expect(headers).toContain("/_astro/*");
    expect(headers).toContain("Cache-Control: public, max-age=31536000, immutable");
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

  it("keeps Astro performance integrations and local font preloads configured", () => {
    const config = readFileSync("astro.config.mjs", "utf8");
    const layout = readFileSync("src/layouts/BaseLayout.astro", "utf8");
    const styles = readFileSync("src/styles/global.css", "utf8");

    expect(config).toContain("compressor()");
    expect(config).toContain("favicons({");
    expect(config).toContain("prefetchAll: true");
    expect(config).toContain("clientPrerender: true");
    expect(layout).toContain('localizedHTML as faviconsHtml');
    expect(layout).toContain('set:html={faviconTags}');
    expect(layout).toContain('rel="preload"');
    expect(layout).toContain("inter-latin-400-normal.woff2?url");
    expect(layout).toContain("jetbrains-mono-latin-400-normal.woff2?url");
    expect(styles).toContain('@font-face');
    expect(styles).toContain('font-display: swap');
  });
});
