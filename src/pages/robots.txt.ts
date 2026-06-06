import { SITE } from "@/lib/seo";

export function GET() {
  return new Response(
    `# MDResume allows search and AI discovery by default.
# The interactive editor remains excluded because it is a client-side workspace, not a crawlable content page.

User-agent: *
Allow: /
Disallow: /editor

# AI crawler policy: allow discovery unless this policy is changed later.
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
