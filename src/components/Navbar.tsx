import { useResumeStore, useActiveResume } from "@/store/resumeStore";
import {
  ArrowLeft,
  Code2,
  Columns2,
  Eye,
  FileText,
  Plus,
  Settings as SettingsIcon,
  Download,
  Upload,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadMarkdown, getImportedResumeName, isMarkdownFile } from "@/lib/markdownFiles";
import { toast } from "sonner";

export function Navbar() {
  const doc = useActiveResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    setName,
    viewMode,
    setViewMode,
    toggleSettings,
    newResume,
    aiPanelOpen,
    toggleAIPanel,
    importMarkdown,
  } = useResumeStore();

  const handleExportMarkdown = () => {
    downloadMarkdown(doc.markdown, doc.name);
    toast.success("Markdown exported.");
  };

  const handleBack = () => {
    if (document.referrer) {
      const referrer = new URL(document.referrer);
      if (referrer.origin === window.location.origin) {
        window.history.back();
        return;
      }
    }

    window.location.assign("/");
  };

  const handleImportMarkdown = async (file: File | undefined) => {
    if (!file) return;

    if (!isMarkdownFile(file)) {
      toast.error("Please import a .md or .markdown file.");
      return;
    }

    try {
      const markdown = await file.text();
      if (!markdown.trim()) {
        toast.error("That Markdown file is empty.");
        return;
      }

      importMarkdown(markdown, getImportedResumeName(markdown, file.name));
      toast.success("Markdown imported into the active resume.");
    } catch {
      toast.error("Could not read that Markdown file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="h-6 w-px bg-border mx-1" />

      <div className="flex items-center bg-secondary rounded-lg p-1 gap-1">
        <ViewToggle
          icon={Code2}
          label="Editor"
          active={viewMode === "editor"}
          onClick={() => setViewMode("editor")}
        />
        <ViewToggle
          icon={Columns2}
          label="Split"
          active={viewMode === "split"}
          onClick={() => setViewMode("split")}
        />
        <ViewToggle
          icon={Eye}
          label="Preview"
          active={viewMode === "preview"}
          onClick={() => setViewMode("preview")}
        />
      </div>

      <div className="h-6 w-px bg-border mx-1" />

      <div className="flex items-center gap-2 min-w-0">
        <FileText className="size-4 text-muted-foreground shrink-0" />
        <input
          value={doc.name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent border-none outline-none text-sm font-medium px-2 py-1 rounded hover:bg-secondary focus:bg-secondary min-w-0 w-48"
          placeholder="Resume name"
        />
      </div>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        onClick={toggleAIPanel}
        className={cn("gap-2", aiPanelOpen && "bg-secondary text-indigo-400")}
      >
        <Sparkles className="size-4 text-indigo-400 fill-indigo-400" />
        AI Tools
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,text/markdown,text/plain"
        className="hidden"
        onChange={(event) => handleImportMarkdown(event.target.files?.[0])}
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="gap-2"
      >
        <Upload className="size-4" />
        Import .md
      </Button>

      <Button variant="ghost" size="sm" onClick={handleExportMarkdown} className="gap-2">
        <Download className="size-4" />
        Export .md
      </Button>

      <Button variant="ghost" size="sm" onClick={toggleSettings} className="gap-2">
        <SettingsIcon className="size-4" />
        Settings
      </Button>

      <Button variant="outline" size="sm" onClick={newResume} className="gap-2">
        <Plus className="size-4" />
        New Resume
      </Button>

      <Button
        size="sm"
        onClick={() => window.print()}
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Download className="size-4" />
        Save as PDF
      </Button>
    </header>
  );
}

function ViewToggle({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Code2;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}
