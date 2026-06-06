import { parseResume } from "@/lib/resumeSchema";

export function sanitizeMarkdownFilename(name: string) {
  const cleaned = name
    .trim()
    .replace(/\.md$/i, "")
    .replace(/\.markdown$/i, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/\.\.+/g, ".")
    .replace(/^[._-]+|[._-]+$/g, "")
    .slice(0, 80);

  return `${cleaned || "resume"}.md`;
}

export function getImportedResumeName(markdown: string, filename: string) {
  const parsed = parseResume(markdown);
  if (parsed.data.name?.trim()) return parsed.data.name.trim();
  if (parsed.bodyHeader?.name.trim()) return parsed.bodyHeader.name.trim();
  return (
    filename
      .replace(/\.(md|markdown)$/i, "")
      .replace(/[-_]+/g, " ")
      .trim() || "Imported Resume"
  );
}

export function isMarkdownFile(file: File) {
  const name = file.name.toLowerCase();
  return name.endsWith(".md") || name.endsWith(".markdown");
}

export function downloadMarkdown(markdown: string, resumeName: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = sanitizeMarkdownFilename(resumeName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
