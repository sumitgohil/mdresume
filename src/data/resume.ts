import { THEMES, type ResumeTheme } from "../lib/themeRegistry";

export { THEMES };

export type ResumeTemplate = {
  id: string;
  name: string;
  description: string;
  themeId: ResumeTheme;
  audience: string;
  sampleMarkdown: string;
};

export type ResumeExample = {
  id: string;
  title: string;
  role: string;
  summary: string;
  tags: string[];
  templateId: string;
  markdown: string;
};

export const SAMPLE_MARKDOWN = `---
name: Alex Chen
title: Senior Software Engineer
email: alex.chen@email.com
phone: "(555) 234-5678"
location: San Francisco, CA
linkedin: linkedin.com/in/alexchen
github: github.com/alexchen
---

## Professional Summary

Senior Software Engineer with 7+ years of experience building platform services, developer tools, and reliable product infrastructure for B2B SaaS teams. Strong record of reducing latency, improving deployment quality, and translating ambiguous product requirements into maintainable systems used by revenue, support, and customer success teams.

## Technical Skills

**Languages:** TypeScript, JavaScript, Go, Python

**Frontend:** React, Astro, Next.js, design systems, accessibility

**Backend:** Node.js, GraphQL, REST, PostgreSQL, Redis, event-driven services

**Practices:** CI/CD, observability, API design, incident reviews, technical planning, mentoring

## Professional Experience

### Senior Software Engineer | Cloudlane

- Led a customer onboarding rewrite that reduced activation time by 42% and increased trial-to-paid conversion by 18%.
- Designed CI quality gates for accessibility, performance, and regression testing across 12 frontend packages.
- Built a GraphQL aggregation layer that removed duplicate client-side data fetching and reduced dashboard load time by 37%.
- Partnered with product managers to break down a 6-month platform roadmap into weekly release milestones with clear risk owners.
- Mentored five engineers through architecture reviews, pairing sessions, and production readiness checklists.
- Led post-incident reviews for authentication and billing issues, creating runbooks that reduced repeat incidents by 40%.

### Software Engineer | Stackframe

- Improved API response times by 55% by replacing nested database calls with cached read models.
- Shipped internal dashboards used daily by support, finance, and revenue operations teams.
- Built a typed integration SDK that reduced customer implementation time from three weeks to five days.
- Added structured logging and service-level alerts that helped teams detect failed sync jobs within five minutes.
- Collaborated with design and support to redesign account recovery flows, lowering manual recovery requests by 21%.

## Selected Projects

### Release Health Console

- Built a deployment visibility dashboard combining CI status, error rate, incident links, and rollback signals.
- Used by 40+ engineers during release reviews to identify risky deployments before customer impact.

### API Contract Test Suite

- Introduced contract tests for public GraphQL schema changes, catching breaking changes before release.
- Reduced emergency hotfixes tied to integration regressions from 6 per quarter to 1 per quarter.

## Leadership & Collaboration

- Facilitated weekly architecture office hours for frontend and platform engineers.
- Wrote implementation plans for billing, onboarding, and permissions projects that crossed three product teams.
- Interviewed senior frontend and full-stack candidates with a focus on debugging, product judgment, and systems thinking.

## Education

**B.S. Computer Science** | University of California, Berkeley`;

const FRONTEND_MARKDOWN = `---
name: Priya Nair
title: Senior Frontend Engineer
email: priya.nair@email.com
location: Austin, TX
linkedin: linkedin.com/in/priyanair
github: github.com/priyanair
---

## Professional Summary

Senior Frontend Engineer with 6+ years of experience building accessible product surfaces, design systems, and performance-focused React applications for B2B SaaS teams. Combines strong UI engineering with product judgment, design partnership, and a practical approach to shipping reliable interfaces.

## Technical Skills

**Core:** TypeScript, React, Next.js, Astro, HTML, CSS, browser APIs

**Product UI:** Design systems, accessibility, complex forms, dashboards, data visualization

**Quality:** Vitest, Playwright, Storybook, Lighthouse, visual regression, CI review gates

**Collaboration:** Design pairing, technical discovery, release planning, documentation

## Professional Experience

### Senior Frontend Engineer | AtlasWork

- Rebuilt the account setup flow in React, improving completion by 31% and reducing support tickets by 22%.
- Created reusable form, table, and navigation primitives adopted by 9 product squads.
- Reduced route-level JavaScript by 38% through bundle analysis, lazy loading, and server-rendered defaults.
- Led accessibility improvements for keyboard navigation, focus states, and form errors across the admin workspace.
- Partnered with design to define interaction patterns for filters, bulk actions, and empty states used across 40+ screens.
- Added Playwright coverage for high-risk billing and permissions flows, reducing UI regression escapes by 30%.

### Frontend Engineer | Northstar Labs

- Delivered accessible reporting dashboards for enterprise customers with WCAG-minded keyboard flows.
- Added visual regression checks to CI, catching layout issues before release and improving review confidence.
- Built a charting wrapper around shared tokens so product teams could ship consistent analytics experiences.
- Migrated legacy JavaScript modules to TypeScript, reducing runtime errors in the reporting area by 24%.
- Improved perceived performance by preloading critical route data and replacing blocking loaders with skeleton states.

## Selected Projects

### Design System Adoption Program

- Created migration guides, codemods, and examples that helped 20 engineers replace one-off UI patterns.
- Established component quality criteria covering keyboard support, visual states, testing, and documentation.

### Enterprise Reporting Refresh

- Redesigned dashboard IA with product and research, making high-priority reports available within two clicks.
- Improved Lighthouse performance score from 64 to 91 on the main reports route.

## Community & Mentoring

- Mentored three frontend engineers on component design, accessibility review, and debugging production UI issues.
- Hosted monthly UI quality reviews covering performance budgets, design consistency, and accessible interaction patterns.

## Education

**B.E. Computer Engineering** | University of Mumbai`;

const BACKEND_MARKDOWN = `---
name: Mateo Ruiz
title: Backend Platform Engineer
email: mateo.ruiz@email.com
location: Denver, CO
linkedin: linkedin.com/in/mateoruiz
github: github.com/mateoruiz
---

## Professional Summary

Backend Platform Engineer with 8 years of experience designing APIs, queues, and database-backed systems for high-volume workflow products. Focused on reliability, observability, data integrity, and predictable service ownership across distributed systems.

## Technical Skills

**Languages:** Go, TypeScript, Python, SQL

**Backend:** PostgreSQL, Redis, Kafka, GraphQL, REST, Node.js, workers, webhooks

**Infrastructure:** AWS, Docker, Kubernetes, Terraform, Datadog, OpenTelemetry

**Practices:** Domain modeling, incident response, schema design, load testing, service migrations

## Professional Experience

### Backend Platform Engineer | ClearRoute

- Split a monolithic billing service into 6 bounded services, reducing failed renewals by 27%.
- Introduced idempotent job processing for payment workflows handling 18M monthly events.
- Cut p95 API latency from 840ms to 290ms by redesigning query paths and cache invalidation.
- Designed a webhook delivery pipeline with retries, signatures, and replay tooling for 1,200 enterprise integrations.
- Created database migration playbooks that let teams ship schema changes with zero planned downtime.
- Added service-level objectives for billing, entitlement, and notification systems with weekly reliability reviews.

### Software Engineer | RelayOps

- Built audit logging and permission APIs used across compliance-sensitive customer workflows.
- Added service dashboards and alert thresholds that reduced incident triage time by 35%.
- Reworked background job scheduling to isolate slow customer imports from real-time workflow processing.
- Tuned PostgreSQL indexes and query plans for multi-tenant tables, reducing peak CPU usage by 29%.
- Documented API versioning standards adopted by product teams building external integrations.

## Selected Projects

### Entitlements Service

- Built a centralized entitlement service used by billing, admin, and product feature gates.
- Reduced duplicated authorization logic across 8 services and simplified enterprise plan changes.

### Async Import Framework

- Created resumable import jobs with progress tracking, retry safety, and operator controls.
- Supported customer migrations of up to 12M records without blocking normal application traffic.

## Leadership & Reliability

- Rotated as incident commander for platform incidents and wrote action-oriented postmortems.
- Mentored backend engineers on API design, database review, and service ownership expectations.
- Partnered with security to implement audit trails for permission, billing, and data export events.

## Education

**B.S. Software Engineering** | Colorado State University`;

const PRODUCT_MARKDOWN = `---
name: Jordan Lee
title: Senior Product Manager
email: jordan.lee@email.com
location: New York, NY
linkedin: linkedin.com/in/jordanlee
website: jordanlee.dev
---

## Professional Summary

Senior Product Manager with 7 years of experience launching workflow products, aligning engineering and go-to-market teams, and improving activation, retention, and expansion metrics. Strong at turning customer research into focused roadmaps and measurable product bets.

## Core Skills

**Product:** Roadmaps, discovery, analytics, launch planning, pricing experiments, product strategy

**Collaboration:** Engineering planning, stakeholder management, customer interviews, sales enablement

**Tools:** SQL, Amplitude, Figma, Jira, Notion, Looker, Salesforce

## Professional Experience

### Senior Product Manager | BrightDesk

- Led a self-serve onboarding initiative that increased first-week activation from 44% to 61%.
- Prioritized 18 customer-requested workflow improvements, reducing enterprise churn risk by 14%.
- Coordinated design, engineering, sales, and support teams across 4 major launches.
- Defined the roadmap for admin automation features that influenced $3.2M in expansion pipeline.
- Built product health dashboards covering activation, feature adoption, support volume, and retention cohorts.
- Ran discovery with 35 enterprise users to identify approval workflow gaps and package them into 3 quarterly bets.

### Product Manager | TempoHQ

- Built a pricing experiment roadmap that improved expansion revenue by 11% in two quarters.
- Created product health dashboards used in weekly leadership reviews.
- Launched role-based permissions for mid-market customers, contributing to a 16% increase in qualified trials.
- Partnered with customer success to create feedback loops from cancellation calls and renewal risk accounts.
- Wrote launch briefs, objection handling docs, and internal demos for sales and implementation teams.

## Selected Product Work

### Workflow Automation Launch

- Led discovery, scoping, beta rollout, and GA launch for conditional workflow rules.
- Drove adoption to 38% of active workspaces within 90 days by pairing in-product education with success outreach.

### Activation Diagnostics

- Used funnel analysis and customer interviews to identify the three highest-friction onboarding steps.
- Shipped guided setup improvements that reduced time-to-first-value from 4.8 days to 2.9 days.

## Research & Communication

- Conducted customer interviews with admins, finance operators, and implementation specialists.
- Wrote concise PRDs with problem framing, non-goals, analytics plans, and rollout risks.
- Presented product tradeoffs to executive stakeholders using customer evidence and revenue impact.

## Education

**MBA** | University of Michigan`;

const EARLY_CAREER_MARKDOWN = `---
name: Maya Patel
title: Junior Software Engineer
email: maya.patel@email.com
location: Raleigh, NC
github: github.com/mayapatel
website: mayapatel.dev
---

## Professional Summary

Junior Software Engineer with internship and project experience building React interfaces, Node.js APIs, and tested full-stack features. Comfortable learning quickly, documenting tradeoffs, asking clear questions, and shipping maintainable code with review feedback.

## Technical Skills

**Languages:** JavaScript, TypeScript, Python, SQL

**Frameworks:** React, Node.js, Express, Astro, Tailwind CSS

**Tools:** Git, GitHub Actions, PostgreSQL, Vitest, Playwright, Vercel

**Concepts:** REST APIs, authentication, relational data modeling, accessibility basics, debugging

## Experience

### Software Engineering Intern | Greenbyte

- Built an internal support dashboard that reduced manual customer lookup time by 40%.
- Added unit tests for API validation paths, increasing coverage from 62% to 81%.
- Documented setup steps and common debugging workflows for future interns.
- Implemented role-based filters for support agents using React state, URL params, and reusable query helpers.
- Fixed 14 accessibility issues across forms, including missing labels, focus order, and error messaging.
- Paired with a senior engineer to profile slow API responses and add indexes for common lookup paths.

### Campus Web Developer | NC State Engineering Lab

- Maintained lab project pages used by 600+ students and faculty each semester.
- Rebuilt publication pages from static HTML into reusable Astro components backed by Markdown content.
- Added GitHub Actions checks for formatting and broken links before publishing updates.

## Projects

### Campus Event Finder

- Built a searchable event app with React, Express, PostgreSQL, and saved filters.
- Added authentication, organizer dashboards, and email reminders for saved events.
- Wrote integration tests for event creation, filtering, and attendee registration flows.

### Markdown Portfolio

- Created a static portfolio generated from Markdown project files, frontmatter, and reusable layouts.
- Added project writeups explaining problem, stack, tradeoffs, screenshots, and what was learned.

### Budget Tracker API

- Built a Node.js REST API for expenses, categories, monthly budgets, and CSV export.
- Designed PostgreSQL tables, validation middleware, and seed data for demo accounts.

## Education Highlights

- Coursework: Data Structures, Databases, Web Applications, Software Engineering, Operating Systems.
- Capstone: Built a volunteer scheduling tool for a local nonprofit with a 4-person team.

## Education

**B.S. Computer Science** | North Carolina State University`;

const MANAGER_MARKDOWN = `---
name: Casey Morgan
title: Engineering Manager
email: casey.morgan@email.com
location: Seattle, WA
linkedin: linkedin.com/in/caseymorgan
---

## Professional Summary

Engineering Manager with 10 years across software delivery and people leadership. Builds clear planning systems, improves team execution, and keeps technical quality visible without slowing product momentum. Experienced in coaching senior engineers, hiring balanced teams, and leading reliability improvements across product platforms.

## Leadership Strengths

**People:** Hiring, coaching, performance feedback, career growth

**Delivery:** Roadmaps, estimation, incident review, dependency management, operating rhythms

**Technical:** Platform architecture, reliability, frontend systems, API design, migration planning

**Business Partnership:** Product planning, executive updates, customer escalation support, budgeting

## Professional Experience

### Engineering Manager | FinchCloud

- Led a 9-person platform team that delivered 96% of quarterly commitments across 3 product lines.
- Reworked planning rituals, reducing carryover work by 28% and improving cross-team visibility.
- Sponsored reliability investments that reduced customer-facing incidents from 11 to 4 per quarter.
- Hired 4 engineers and redesigned onboarding, reducing average ramp time from 10 weeks to 6 weeks.
- Coached two senior engineers into technical lead roles with explicit growth plans and architecture ownership.
- Partnered with product leadership to sequence a permissions migration without delaying customer-facing roadmap work.
- Introduced monthly quality reviews covering incidents, flaky tests, accessibility, performance, and maintainability.

### Staff Software Engineer | FinchCloud

- Guided a frontend platform migration adopted by 30 engineers across product teams.
- Mentored senior engineers through architecture proposals and rollout planning.
- Led the design of shared API client patterns that reduced duplicated error handling across the application.
- Built a migration plan that moved core dashboard routes to a new rendering stack with no customer downtime.
- Facilitated technical decision records for cross-team investments in testing, observability, and release safety.

### Senior Software Engineer | RelayWorks

- Built React and Node.js features for enterprise workflow automation used by finance and operations teams.
- Improved permission checks and audit trails for sensitive workflow actions, supporting SOC 2 readiness work.
- Mentored interns and new hires through code review, pairing, and small project ownership.

## Team & Operating Highlights

- Created team health dashboards combining delivery predictability, on-call load, incident follow-up, and hiring progress.
- Ran quarterly planning workshops that linked engineering investments to customer-visible outcomes.
- Established clear ownership for platform areas that previously had shared but unclear maintenance responsibility.

## Hiring & Mentoring

- Designed interview rubrics for frontend, backend, and staff engineering candidates.
- Conducted 80+ interviews with consistent scoring criteria and structured debriefs.
- Mentored managers and tech leads on feedback, delegation, and writing actionable growth plans.

## Education

**B.S. Information Systems** | University of Washington`;

const templateDetails: Record<ResumeTheme, Pick<ResumeTemplate, "name" | "description" | "audience" | "sampleMarkdown">> = {
  "modern-pro": {
    name: "Crisp",
    description: "Clean technical layout with a measured blue accent.",
    audience: "Software engineers and technical ICs",
    sampleMarkdown: SAMPLE_MARKDOWN,
  },
  "classic-elegant": {
    name: "Stark",
    description: "Conservative format for traditional hiring teams.",
    audience: "Corporate, consulting, and operations roles",
    sampleMarkdown: BACKEND_MARKDOWN,
  },
  minimal: {
    name: "Airy",
    description: "Quiet spacing and minimal visual noise.",
    audience: "Early-career and generalist resumes",
    sampleMarkdown: EARLY_CAREER_MARKDOWN,
  },
  "creative-bold": {
    name: "Vivid",
    description: "Sharper headings for product-minded builders.",
    audience: "Frontend, product, and startup roles",
    sampleMarkdown: FRONTEND_MARKDOWN,
  },
  executive: {
    name: "Formal",
    description: "Leadership-oriented structure with restrained weight.",
    audience: "Managers, staff engineers, and senior leaders",
    sampleMarkdown: MANAGER_MARKDOWN,
  },
  "tech-startup": {
    name: "Dense",
    description: "Compact format for technical depth and systems work.",
    audience: "Backend, platform, and infrastructure engineers",
    sampleMarkdown: BACKEND_MARKDOWN,
  },
  "nature-green": {
    name: "Calm",
    description: "Balanced enterprise layout with a soft accent.",
    audience: "Product, support, and cross-functional roles",
    sampleMarkdown: PRODUCT_MARKDOWN,
  },
  "warm-sunset": {
    name: "Warm",
    description: "A subtle warm accent for portfolio-driven profiles.",
    audience: "Creative technologists and product designers",
    sampleMarkdown: FRONTEND_MARKDOWN,
  },
  "rose-elegant": {
    name: "Dusk",
    description: "Typographic top-border style with a modern accent.",
    audience: "Senior ICs and polished personal brands",
    sampleMarkdown: SAMPLE_MARKDOWN,
  },
};

export const templates: ResumeTemplate[] = THEMES.map((theme) => ({
  id: theme.id,
  themeId: theme.id,
  ...templateDetails[theme.id],
}));

export const examples: ResumeExample[] = [
  {
    id: "software-engineer",
    title: "Senior Software Engineer Resume",
    role: "Senior Software Engineer",
    summary: "Outcome-led platform resume with product impact, reliability, and mentoring signals.",
    tags: ["TypeScript", "APIs", "Reliability"],
    templateId: "modern-pro",
    markdown: SAMPLE_MARKDOWN,
  },
  {
    id: "frontend-engineer",
    title: "Senior Frontend Engineer Resume",
    role: "Senior Frontend Engineer",
    summary: "Frontend example focused on design systems, accessibility, performance, and product delivery.",
    tags: ["React", "Design Systems", "A11y"],
    templateId: "creative-bold",
    markdown: FRONTEND_MARKDOWN,
  },
  {
    id: "backend-engineer",
    title: "Backend Platform Engineer Resume",
    role: "Backend Platform Engineer",
    summary: "Backend-focused resume for APIs, queues, databases, observability, and systems scale.",
    tags: ["Go", "PostgreSQL", "Cloud"],
    templateId: "tech-startup",
    markdown: BACKEND_MARKDOWN,
  },
  {
    id: "product-manager",
    title: "Senior Product Manager Resume",
    role: "Senior Product Manager",
    summary: "Product resume with activation, retention, roadmap, and cross-functional launch evidence.",
    tags: ["Roadmaps", "Launches", "Metrics"],
    templateId: "nature-green",
    markdown: PRODUCT_MARKDOWN,
  },
  {
    id: "early-career",
    title: "Junior Developer Resume",
    role: "Junior Software Engineer",
    summary: "First-role resume structure with internships, projects, tools, and concrete contribution bullets.",
    tags: ["Projects", "Internship", "Portfolio"],
    templateId: "minimal",
    markdown: EARLY_CAREER_MARKDOWN,
  },
  {
    id: "engineering-manager",
    title: "Engineering Manager Resume",
    role: "Engineering Manager",
    summary: "Leadership resume balancing team health, delivery systems, reliability, and technical judgment.",
    tags: ["Leadership", "Planning", "Reliability"],
    templateId: "executive",
    markdown: MANAGER_MARKDOWN,
  },
];

export function findTemplate(id: string) {
  return templates.find((template) => template.id === id) || templates[0];
}
