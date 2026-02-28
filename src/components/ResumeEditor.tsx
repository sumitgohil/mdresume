/* eslint-disable @typescript-eslint/no-explicit-any */
import Editor from "@monaco-editor/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useResumeStore, useActiveResume } from "@/store/resumeStore";
import { editorService } from "@/lib/editorService";
import { RESUME_FRONTMATTER_FIELDS, validateResumeMarkdown } from "@/lib/resumeSchema";

export function ResumeEditor() {
  const doc = useActiveResume();
  const setMarkdown = useResumeStore((s) => s.setMarkdown);
  const setSelectedText = useResumeStore((s) => s.setSelectedText);
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const validationIssues = useMemo(() => validateResumeMarkdown(doc.markdown), [doc.markdown]);
  const visibleIssues = validationIssues.filter((issue) => issue.severity !== "info").slice(0, 2);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = editor?.getModel();
    if (!monaco || !model) return;

    const markers = validationIssues
      .filter((issue) => issue.severity === "error" && issue.line)
      .map((issue) => ({
        severity: monaco.MarkerSeverity.Error,
        message: issue.message,
        startLineNumber: issue.line,
        startColumn: 1,
        endLineNumber: issue.line,
        endColumn: model.getLineMaxColumn(issue.line),
      }));

    monaco.editor.setModelMarkers(model, "resume-schema", markers);
  }, [validationIssues]);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editorService.setEditor(editor);

    const selection = editor.getSelection();
    if (selection) {
      setSelectedText(editor.getModel()?.getValueInRange(selection) || "");
    }

    editor.onDidChangeCursorSelection((e: any) => {
      const text = editor.getModel()?.getValueInRange(e.selection) || "";
      setSelectedText(text);
    });
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="border-b border-white/10 bg-[#252526] px-3 py-2 text-[11px] leading-relaxed text-zinc-300">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span className="font-semibold text-zinc-100">Schema:</span>
          <span>Use frontmatter fields: {RESUME_FRONTMATTER_FIELDS.join(", ")}.</span>
          <span>Or start with # Name plus a contact line.</span>
          <span>Custom syntax: :accent[text], :muted[text].</span>
        </div>
        {visibleIssues.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {visibleIssues.map((issue) => (
              <span
                key={issue.id}
                className={issue.severity === "error" ? "text-red-300" : "text-amber-300"}
              >
                {issue.message}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="min-h-0 flex-1">
        {mounted ? (
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={doc.markdown}
            onChange={(v) => setMarkdown(v ?? "")}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontFamily: "JetBrains Mono, ui-monospace, monospace",
              fontSize: 13,
              minimap: { enabled: false },
              wordWrap: "on",
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: "line",
            }}
          />
        ) : (
          <div className="h-full bg-[#1e1e1e] p-4 font-mono text-xs text-zinc-500">
            Loading editor...
          </div>
        )}
      </div>
    </div>
  );
}
