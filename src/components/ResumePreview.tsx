import ReactMarkdown from "react-markdown";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { parseResume } from "@/lib/parseResume";
import { remarkResumeDirectives } from "@/lib/resumeMarkdownDirectives";
import { useResumeStore, useActiveResume } from "@/store/resumeStore";

const MARGIN_MAP = {
  narrow: "1.5rem 1.75rem",
  normal: "2.75rem 2.5rem",
  wide: "3.5rem 3.25rem",
};

const PAPER_WIDTH = {
  A4: 794, // ~A4 @96dpi
  Letter: 816,
};

const resumeRemarkPlugins = [remarkGfm, remarkDirective, remarkResumeDirectives];

export function ResumePreview() {
  const doc = useActiveResume();
  const isAutoAdjusting = useResumeStore((s) => s.isAutoAdjusting);
  const [debounced, setDebounced] = useState(doc.markdown);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(doc.markdown), 120);
    return () => clearTimeout(t);
  }, [doc.markdown]);

  const { data, content, bodyHeader } = useMemo(() => parseResume(debounced), [debounced]);
  const s = doc.settings;

  const style = {
    "--rp-body-font": `"${s.bodyFont}", ui-sans-serif, system-ui, sans-serif`,
    "--rp-heading-font": `"${s.headingFont}", ui-sans-serif, system-ui, sans-serif`,
    "--rp-heading-weight": s.headingWeight,
    "--rp-font-size": `${s.fontSize}px`,
    "--rp-heading-scale": String(s.headingScale),
    "--rp-line-height": String(s.lineHeight),
    "--rp-section-spacing": `${s.sectionSpacing}px`,
    "--rp-paragraph-spacing": `${s.paragraphSpacing}px`,
    "--rp-print-width": s.paperSize === "A4" ? "210mm" : "8.5in",
    padding: MARGIN_MAP[s.margins],
    width: `${PAPER_WIDTH[s.paperSize]}px`,
    maxWidth: "100%",
  } as CSSProperties & Record<string, string>;

  const contacts = [
    data.email,
    data.phone,
    data.location,
    data.github,
    data.linkedin,
    data.website,
  ].filter(Boolean);
  const headerName = data.name || bodyHeader?.name;
  const headerTitle = data.title;
  const bodyContact = contacts.length === 0 ? bodyHeader?.contact : undefined;

  return (
    <div
      id="resume-print-area"
      className={`resume-preview theme-${doc.theme} ${s.showDividers ? "with-dividers" : "no-dividers"} ${isAutoAdjusting ? "auto-adjusting-active" : ""}`}
      style={style}
    >
      {(headerName || headerTitle || contacts.length > 0 || bodyContact) && (
        <header className="resume-header">
          {headerName && <div className="name">{headerName}</div>}
          {headerTitle && <div className="title">{headerTitle}</div>}
          {contacts.length > 0 && (
            <div className="contact">
              {contacts.map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>
          )}
          {bodyContact && (
            <div className="contact body-contact">
              <ReactMarkdown
                remarkPlugins={resumeRemarkPlugins}
                components={{
                  p: "span",
                }}
              >
                {bodyContact}
              </ReactMarkdown>
            </div>
          )}
        </header>
      )}
      <ReactMarkdown remarkPlugins={resumeRemarkPlugins}>{content}</ReactMarkdown>
    </div>
  );
}
