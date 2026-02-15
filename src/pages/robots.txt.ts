import { SITE } from "@/lib/seo";

export function GET() {
  return new Response(
    `User-agent: *
Allow: /
Disallow: /editor

Sitemap: ${SITE.origin}/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
