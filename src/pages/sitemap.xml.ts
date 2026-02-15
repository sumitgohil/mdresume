import { getCollection } from "astro:content";
import { getCanonicalUrl } from "@/lib/seo";

const staticPages = ["/", "/templates", "/examples", "/blog"];

export async function GET() {
  const posts = await getCollection("blog");
  const urls = [
    ...staticPages,
    ...posts.map((post) => `/blog/${post.id}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${getCanonicalUrl(path)}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
