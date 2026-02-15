---
title: "Building an open-source Markdown resume editor"
description: "How MDResume combines static Astro pages, React islands, Markdown content, and live resume previews."
publishDate: 2026-06-05
tags: ["Astro", "Open Source", "Markdown"]
---

MDResume starts from a simple belief: resume content should be portable. Markdown keeps the writing experience plain,
reviewable, and easy to version, while templates handle presentation separately.

The Astro frontend keeps public pages static so visitors, search engines, and social previews can understand the product
without waiting for client-side rendering. The editor itself hydrates as a React island only where interactivity is
needed.

That split gives the project a practical architecture: fast marketing pages, typed content, reusable previews, and a
browser-first editor that remains easy to host on Cloudflare Pages.
