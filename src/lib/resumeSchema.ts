export const RESUME_FRONTMATTER_FIELDS = [
  "name",
  "title",
  "email",
  "phone",
  "location",
  "github",
  "linkedin",
  "website",
] as const;

export type ResumeFrontmatterField = (typeof RESUME_FRONTMATTER_FIELDS)[number];

export interface ResumeFrontmatter {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  [k: string]: string | undefined;
}

export type ValidationSeverity = "info" | "warning" | "error";

export interface ResumeValidationIssue {
  id: string;
  severity: ValidationSeverity;
  message: string;
  line?: number;
}

export interface ParsedResume {
  data: ResumeFrontmatter;
  content: string;
  bodyHeader?: {
    name: string;
    contact?: string;
  };
  frontmatterError?: ResumeValidationIssue;
}

function unquoteValue(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

export function parseResume(md: string): ParsedResume {
  if (!md.startsWith("---")) {
    const bodyHeader = extractBodyHeader(md);
    if (!bodyHeader) return { data: {}, content: md };
    return {
      data: {},
      content: bodyHeader.content,
      bodyHeader: {
        name: bodyHeader.name,
        contact: bodyHeader.contact,
      },
    };
  }

  const lines = md.split("\n");
  if (lines[0].trim() !== "---") return { data: {}, content: md };

  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closingIndex === -1) {
    return {
      data: {},
      content: md,
      frontmatterError: {
        id: "frontmatter-unclosed",
        severity: "error",
        message: "Frontmatter starts with --- but is missing a closing --- line.",
        line: 1,
      },
    };
  }

  const data: ResumeFrontmatter = {};
  const frontmatterLines = lines.slice(1, closingIndex);
  for (let index = 0; index < frontmatterLines.length; index++) {
    const line = frontmatterLines[index];
    if (!line.trim()) continue;

    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!match) {
      return {
        data,
        content: lines.slice(closingIndex + 1).join("\n"),
        frontmatterError: {
          id: "frontmatter-invalid-line",
          severity: "error",
          message: "Frontmatter lines must use key: value format.",
          line: index + 2,
        },
      };
    }

    data[match[1]] = unquoteValue(match[2].trim());
  }

  return { data, content: lines.slice(closingIndex + 1).join("\n") };
}

function isPlainContactLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/^(#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s*|```|~~~|---+$)/.test(trimmed)) return false;
  return true;
}

function extractBodyHeader(md: string) {
  const lines = md.split("\n");
  const headingIndex = lines.findIndex((line) => /^#\s+.+/.test(line.trim()));
  if (headingIndex === -1) return null;

  const headingMatch = lines[headingIndex].trim().match(/^#\s+(.+?)\s*#*\s*$/);
  const name = headingMatch?.[1]?.trim();
  if (!name) return null;

  let contactIndex = -1;
  let contact: string | undefined;
  for (let index = headingIndex + 1; index < lines.length; index++) {
    if (!lines[index].trim()) continue;
    if (isPlainContactLine(lines[index])) {
      contactIndex = index;
      contact = lines[index].trim();
    }
    break;
  }

  const contentLines = lines.filter((_, index) => index !== headingIndex && index !== contactIndex);
  return {
    name,
    contact,
    content: contentLines.join("\n").replace(/^\s*\n/, ""),
  };
}

function hasValue(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function isLikelyUrl(value: string) {
  return /^(https?:\/\/)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}(\/\S*)?$/.test(value.trim());
}

export function validateResumeMarkdown(md: string): ResumeValidationIssue[] {
  const parsed = parseResume(md);
  const issues: ResumeValidationIssue[] = [];
  const hasFrontmatter = md.startsWith("---") && md.split("\n")[0].trim() === "---";
  const hasName = hasValue(parsed.data.name) || (!hasFrontmatter && hasValue(parsed.bodyHeader?.name));
  const hasContact =
    hasValue(parsed.data.email) ||
    hasValue(parsed.data.phone) ||
    (!hasFrontmatter && hasValue(parsed.bodyHeader?.contact));

  if (parsed.frontmatterError) issues.push(parsed.frontmatterError);

  if (!parsed.content.trim()) {
    issues.push({
      id: "empty-body",
      severity: "error",
      message: "Resume body is empty. Add sections below the frontmatter.",
    });
  }

  if (!hasName) {
    issues.push({
      id: "missing-name",
      severity: "warning",
      message: "Add a name field in frontmatter so the preview can render a consistent header.",
      line: 1,
    });
  }

  if (!hasContact) {
    issues.push({
      id: "missing-contact",
      severity: "warning",
      message: "Add at least one direct contact method, such as email or phone.",
      line: 1,
    });
  }

  if (hasValue(parsed.data.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.data.email)) {
    issues.push({
      id: "invalid-email",
      severity: "warning",
      message: "Email frontmatter does not look like a valid email address.",
      line: 1,
    });
  }

  for (const field of ["github", "linkedin", "website"] as const) {
    const value = parsed.data[field];
    if (hasValue(value) && !isLikelyUrl(value)) {
      issues.push({
        id: `invalid-${field}`,
        severity: "warning",
        message: `${field} should be a valid URL or domain-style link.`,
        line: 1,
      });
    }
  }

  const words = md.trim().split(/\s+/).filter(Boolean).length;
  if (words > 1100) {
    issues.push({
      id: "resume-too-long",
      severity: "info",
      message: "Resume is over 1,100 words. Consider tightening content for one or two pages.",
    });
  }

  const sectionMatches = parsed.content.match(/^##\s+.+$/gm) || [];
  if (sectionMatches.length < 3) {
    issues.push({
      id: "few-sections",
      severity: "info",
      message:
        "Most resumes scan better with clear sections for summary, skills, experience, and education.",
    });
  }

  const bulletMatches = parsed.content.match(/^\s*[-*]\s+/gm) || [];
  if (bulletMatches.length < 3) {
    issues.push({
      id: "few-bullets",
      severity: "info",
      message: "Add achievement bullets so recruiters can scan impact quickly.",
    });
  }

  return issues;
}
