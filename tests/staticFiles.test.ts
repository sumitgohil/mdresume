import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("cloudflare public files", () => {
  it("documents the app for AI crawlers", () => {
    const llms = readFileSync("public/llms.txt", "utf8");

    expect(llms).toContain("MDResume");
    expect(llms).toContain("React island");
    expect(llms).toContain("/templates");
  });

  it("sets security headers for Cloudflare Pages", () => {
    const headers = readFileSync("public/_headers", "utf8");

    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("Permissions-Policy");
  });
});
