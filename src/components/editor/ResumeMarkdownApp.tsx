import { Navbar } from "@/components/Navbar";
import { StatusBar } from "@/components/StatusBar";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AIPanel } from "@/components/AIPanel";
import { useResumeStore } from "@/store/resumeStore";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

export function ResumeMarkdownApp() {
  const { viewMode, settingsOpen, aiPanelOpen } = useResumeStore();

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Navbar />
      <main className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex overflow-hidden min-w-0">
          {viewMode !== "preview" && (
            <section
              className={cn(
                "flex flex-col overflow-hidden bg-[#1e1e1e] min-w-0",
                viewMode === "split" ? "w-1/2 border-r border-border" : "flex-1",
              )}
            >
              <PaneHeader label="EDITOR.MD" />
              <div className="flex-1 overflow-hidden">
                <ResumeEditor />
              </div>
            </section>
          )}
          {viewMode !== "editor" && (
            <section
              className={cn(
                "flex flex-col overflow-hidden bg-muted/40 min-w-0",
                viewMode === "split" ? "w-1/2" : "flex-1",
              )}
            >
              <PaneHeader label="LIVE PREVIEW" />
              <div className="flex-1 overflow-auto">
                <div className="mx-auto my-8 shadow-xl bg-white rounded-sm border border-border w-fit">
                  <ResumePreview />
                </div>
              </div>
            </section>
          )}
        </div>
        {settingsOpen && <SettingsPanel />}
        {aiPanelOpen && <AIPanel />}
      </main>
      <StatusBar />
      <Toaster />
    </div>
  );
}

function PaneHeader({ label }: { label: string }) {
  return (
    <div className="h-8 border-b border-border bg-card flex items-center px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
      {label}
    </div>
  );
}
