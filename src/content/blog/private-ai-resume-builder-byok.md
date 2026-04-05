---
title: "What a private AI resume builder should do with BYOK"
description: "A clear privacy model for BYOK AI resume builders: browser-local keys, explicit requests, and resume content that stays editable."
publishDate: 2026-05-29
tags: ["AI Resume", "BYOK", "Privacy"]
---

A private AI resume builder should be explicit about how AI is used. BYOK means "bring your own key": you provide a
provider API key, decide when to run an AI action, and keep the resume workflow usable even when AI is turned off.

This model is different from uploading your resume to a hosted service and hoping the defaults are reasonable. With a
browser-first BYOK workflow, the product can focus on editing, previewing, and exporting, while AI remains an optional
assistant for review tasks.

The most useful AI actions are narrow: compare a resume against a job description, identify missing keywords, suggest
bullet rewrites, and draft a cover letter. Each action should produce suggestions you can inspect, reject, or edit.

API keys should be stored locally in the browser, not treated as an account credential for the resume builder. The user
should also understand that requests still go to the selected AI provider when they run an AI action.

MDResume follows this practical boundary. It is a Markdown resume builder first, with optional BYOK AI tools for people
who want a focused review pass while keeping control of the final resume.
