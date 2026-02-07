export type ParsedResume = {
  data: Record<string, string>;
  content: string;
};

function unquoteValue(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function parseResume(markdown: string): ParsedResume {
  if (!markdown.startsWith("---")) return { data: {}, content: markdown };

  const lines = markdown.split("\n");
  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closingIndex === -1) return { data: {}, content: markdown };

  const data: Record<string, string> = {};
  for (const line of lines.slice(1, closingIndex)) {
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = unquoteValue(match[2].trim());
  }

  return {
    data,
    content: lines.slice(closingIndex + 1).join("\n").trim(),
  };
}
