# MDResume Astro

MDResume is an open-source Markdown resume builder frontend. The public pages are static Astro routes for speed and SEO, while the resume editor hydrates as a React island only on `/editor`.

## Stack

- Astro static output
- React island for the Markdown editor
- Typed resume template and example data
- Astro content collection for blog posts
- Vitest for helper and content contract tests
- Cloudflare Pages-ready static deployment

## Commands

Run commands from this directory:

| Command | Action |
| :-- | :-- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start local development server |
| `pnpm test` | Run Vitest tests |
| `pnpm build` | Build the static site to `dist/` |
| `pnpm preview` | Preview the production build locally |

## Routes

- `/` - MDResume landing page
- `/templates` - live resume template gallery
- `/examples` - curated example resumes
- `/blog` - build notes and resume workflow articles
- `/editor` - client-only Markdown resume editor
- `/sitemap.xml`, `/robots.txt`, `/llms.txt` - SEO and crawler discovery files

## Cloudflare Pages

Use these Cloudflare Pages settings:

- Framework preset: `Astro`
- Build command: `pnpm build`
- Build output directory: `dist`
- Node version: `22.12.0` or newer

The `public/_headers` file adds basic security headers and long-lived caching for Astro assets.
