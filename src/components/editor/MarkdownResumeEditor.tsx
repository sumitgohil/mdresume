import {
  Code2,
  Columns2,
  Download,
  Eye,
  FileText,
  Printer,
  Upload,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo, useRef, useState } from "react";
import { SAMPLE_MARKDOWN, templates, THEMES, type ResumeTheme } from "@/data/resume";
import { parseResume } from "@/lib/resumeParser";

type ViewMode = "editor" | "split" | "preview";

function exportMarkdown(markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mdresume.md";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function MarkdownResumeEditor() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [theme, setTheme] = useState<ResumeTheme>("modern-pro");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const parsed = useMemo(() => parseResume(markdown), [markdown]);

  async function importMarkdown(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    setMarkdown(text);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const showEditor = viewMode !== "preview";
  const showPreview = viewMode !== "editor";

  return (
    <div className="md-editor-shell">
      <div className="md-editor-toolbar">
        <div className="md-editor-brand">
          <FileText size={16} />
          <span>{parsed.data.name || "Untitled Resume"}</span>
        </div>

        <div className="md-segmented" aria-label="View mode">
          <button className={viewMode === "editor" ? "active" : ""} onClick={() => setViewMode("editor")}>
            <Code2 size={15} />
            Editor
          </button>
          <button className={viewMode === "split" ? "active" : ""} onClick={() => setViewMode("split")}>
            <Columns2 size={15} />
            Split
          </button>
          <button className={viewMode === "preview" ? "active" : ""} onClick={() => setViewMode("preview")}>
            <Eye size={15} />
            Preview
          </button>
        </div>

        <select
          aria-label="Resume template"
          value={theme}
          onChange={(event) => setTheme(event.target.value as ResumeTheme)}
        >
          {templates.map((template) => (
            <option key={template.id} value={template.themeId}>
              {template.name}
            </option>
          ))}
        </select>

        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
          hidden
          onChange={(event) => importMarkdown(event.target.files?.[0])}
        />

        <button onClick={() => fileInputRef.current?.click()}>
          <Upload size={15} />
          Import
        </button>
        <button onClick={() => exportMarkdown(markdown)}>
          <Download size={15} />
          Export
        </button>
        <button className="primary" onClick={() => window.print()}>
          <Printer size={15} />
          Save PDF
        </button>
      </div>

      <div className={`md-editor-grid mode-${viewMode}`}>
        {showEditor && (
          <section className="md-pane">
            <div className="md-pane-header">EDITOR.MD</div>
            <textarea value={markdown} spellCheck={false} onChange={(event) => setMarkdown(event.target.value)} />
          </section>
        )}

        {showPreview && (
          <section className="md-pane md-preview-pane">
            <div className="md-pane-header">
              LIVE PREVIEW
              <div className="md-theme-swatches" aria-label="Theme colors">
                {THEMES.find((item) => item.id === theme)?.swatches.map((swatch) => (
                  <span key={swatch} style={{ background: swatch }} />
                ))}
              </div>
            </div>
            <div className="md-preview-scroll">
              <article id="resume-print-area" className={`resume-paper editor-paper theme-${theme}`}>
                {parsed.data.name && <h1>{parsed.data.name}</h1>}
                {(parsed.data.title || parsed.data.email || parsed.data.location) && (
                  <p className="resume-meta">
                    {[parsed.data.title, parsed.data.email, parsed.data.location].filter(Boolean).join(" | ")}
                  </p>
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsed.content}</ReactMarkdown>
              </article>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
