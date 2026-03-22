import { useResumeStore, useActiveResume, type ResumeSettings } from "@/store/resumeStore";
import {
  ChevronDown,
  FileText as PaperIcon,
  Type,
  LayoutGrid,
  Sparkles,
  Wand2,
  Undo2,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { THEMES } from "@/lib/themeRegistry";
import { ENABLE_IMPROVE_TEXT } from "@/lib/aiFeatures";

const FONTS = [
  "Inter",
  "Roboto",
  "Lato",
  "Open Sans",
  "Source Sans Pro",
  "Merriweather",
  "Georgia",
  "Playfair Display",
  "JetBrains Mono",
];

const pageFitButtonClassName =
  "h-7 px-2 text-[9px] font-semibold border-indigo-500/25 bg-indigo-500/10 text-indigo-300 shadow-none transition-colors hover:border-indigo-400/45 hover:bg-indigo-500/20 hover:text-indigo-100 focus-visible:ring-indigo-500/40 disabled:bg-indigo-500/10 disabled:text-indigo-300 disabled:hover:border-indigo-500/25 disabled:hover:bg-indigo-500/10";

function Section({
  icon: Icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: typeof Type;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="px-4 pb-4 pt-1 space-y-4">{children}</div>}
    </div>
  );
}

function FieldLabel({ children, value }: { children: React.ReactNode; value?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs text-muted-foreground">{children}</label>
      {value !== undefined && (
        <span className="text-xs font-mono text-muted-foreground">{value}</span>
      )}
    </div>
  );
}

function NativeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-secondary border border-border rounded-md text-sm py-2 px-3 pr-8 focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="size-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
    </div>
  );
}

function RadioRow<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-1 bg-secondary p-1 rounded-md">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "py-1.5 text-xs font-medium rounded transition-colors",
            value === o.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsPanel() {
  const doc = useActiveResume();
  const setSettings = useResumeStore((s) => s.setSettings);
  const setTheme = useResumeStore((s) => s.setTheme);
  const toggleAIPanel = useResumeStore((s) => s.toggleAIPanel);
  const s = doc.settings;

  const viewMode = useResumeStore((s) => s.viewMode);
  const isAutoAdjusting = useResumeStore((s) => s.isAutoAdjusting);
  const setIsAutoAdjusting = useResumeStore((s) => s.setIsAutoAdjusting);

  const [currentPageEstimate, setCurrentPageEstimate] = useState<string>("1.0");
  const [lastFit, setLastFit] = useState<{
    before: ResumeSettings;
    after: ResumeSettings;
    targetPages: number;
    tooDense: boolean;
  } | null>(null);

  // Sync page length estimates reactively
  useEffect(() => {
    const checkElement = () => {
      const element = document.getElementById("resume-print-area");
      if (!element) {
        setCurrentPageEstimate("N/A (Editor Mode)");
        return null;
      }

      const activeDocSettings =
        useResumeStore.getState().resumes[useResumeStore.getState().activeId].settings;
      // Use 1112 for A4 and 1046 for Letter to give a safe 10px threshold for print-bleed/margin rounding
      const pageHeight = activeDocSettings.paperSize === "A4" ? 1112 : 1046;
      setCurrentPageEstimate((element.offsetHeight / pageHeight).toFixed(1));

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const height = entry.contentRect.height;
          const sObj =
            useResumeStore.getState().resumes[useResumeStore.getState().activeId].settings;
          const pHeight = sObj.paperSize === "A4" ? 1112 : 1046;
          const pages = (height / pHeight).toFixed(1);
          setCurrentPageEstimate(pages);
        }
      });

      observer.observe(element);
      return observer;
    };

    let activeObserver = checkElement();

    const timer = setInterval(() => {
      if (!document.getElementById("resume-print-area")) {
        if (activeObserver) {
          activeObserver.disconnect();
          activeObserver = null;
        }
        setCurrentPageEstimate("N/A (Editor Mode)");
      } else if (!activeObserver) {
        activeObserver = checkElement();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (activeObserver) activeObserver.disconnect();
    };
  }, [doc, viewMode]);

  const runAutoAdjust = async (targetPages: number) => {
    const element = document.getElementById("resume-print-area");
    if (!element) {
      toast.error("Please switch to Split or Preview mode first to fit layout!");
      return;
    }

    setIsAutoAdjusting(true);
    const toastId = toast.loading(`Page Fit Assistant: fitting to ${targetPages} page(s)...`);

    const sObj = useResumeStore.getState().resumes[useResumeStore.getState().activeId].settings;
    const setSettingsFn = useResumeStore.getState().setSettings;
    // Use 1112 for A4 and 1046 for Letter to give a safe 10px threshold for print-bleed/margin rounding
    const pageHeight = sObj.paperSize === "A4" ? 1112 : 1046;
    const targetHeight = targetPages * pageHeight;

    const originalSettings = { ...sObj };
    let currentSettings = { ...sObj };

    // Fluid continuous relaxation layout search
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      await new Promise((resolve) => setTimeout(resolve, 16));

      const height = element.offsetHeight;
      const error = height - targetHeight;

      // Tight, ultra-precise subpixel tolerance bounds
      if (error <= 0 && error >= -12) {
        break;
      }

      if (error > 0) {
        const newFontSize = Math.max(11, currentSettings.fontSize - 0.1);
        const newSectionSpacing = Math.max(10, currentSettings.sectionSpacing - 0.5);
        const newParagraphSpacing = Math.max(2, currentSettings.paragraphSpacing - 0.25);
        const newLineHeight = Math.max(1.2, currentSettings.lineHeight - 0.01);

        if (
          newFontSize === currentSettings.fontSize &&
          newSectionSpacing === currentSettings.sectionSpacing &&
          newParagraphSpacing === currentSettings.paragraphSpacing &&
          newLineHeight === currentSettings.lineHeight
        ) {
          break;
        }

        currentSettings = {
          ...currentSettings,
          fontSize: parseFloat(newFontSize.toFixed(2)),
          sectionSpacing: parseFloat(newSectionSpacing.toFixed(2)),
          paragraphSpacing: parseFloat(newParagraphSpacing.toFixed(2)),
          lineHeight: parseFloat(newLineHeight.toFixed(2)),
        };
        setSettingsFn(currentSettings);
      } else {
        const newFontSize = Math.min(18, currentSettings.fontSize + 0.1);
        const newSectionSpacing = Math.min(36, currentSettings.sectionSpacing + 0.5);
        const newParagraphSpacing = Math.min(16, currentSettings.paragraphSpacing + 0.25);
        const newLineHeight = Math.min(1.8, currentSettings.lineHeight + 0.01);

        if (
          newFontSize === currentSettings.fontSize &&
          newSectionSpacing === currentSettings.sectionSpacing &&
          newParagraphSpacing === currentSettings.paragraphSpacing &&
          newLineHeight === currentSettings.lineHeight
        ) {
          break;
        }

        currentSettings = {
          ...currentSettings,
          fontSize: parseFloat(newFontSize.toFixed(2)),
          sectionSpacing: parseFloat(newSectionSpacing.toFixed(2)),
          paragraphSpacing: parseFloat(newParagraphSpacing.toFixed(2)),
          lineHeight: parseFloat(newLineHeight.toFixed(2)),
        };
        setSettingsFn(currentSettings);
      }
    }

    setIsAutoAdjusting(false);
    toast.dismiss(toastId);

    const finalHeight = element.offsetHeight;
    const tooDense =
      currentSettings.fontSize < 12 ||
      currentSettings.lineHeight < 1.3 ||
      currentSettings.sectionSpacing < 12 ||
      currentSettings.paragraphSpacing < 3;
    setLastFit({
      before: originalSettings,
      after: currentSettings,
      targetPages,
      tooDense,
    });

    if (finalHeight <= targetHeight) {
      if (tooDense) {
        toast.warning(
          `Fitted to ${targetPages} page(s), but layout is dense. Consider shortening content.`,
        );
      } else {
        toast.success(`Fitted layout onto ${targetPages} page(s) successfully!`);
      }
    } else {
      toast.warning(
        `Adjusted to minimum layout sizing, but content still exceeds ${targetPages} page(s). Consider shortening text.`,
      );
    }
  };

  const undoFit = () => {
    if (!lastFit) return;
    setSettings(lastFit.before);
    setLastFit(null);
    toast.success("Restored layout settings from before the fit.");
  };

  return (
    <aside className="w-[340px] border-l border-border bg-card overflow-y-auto shrink-0 flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">Themes</h2>
      </div>
      <div className="p-3 grid grid-cols-2 gap-2 border-b border-border">
        {THEMES.map((t) => {
          const active = doc.theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "text-left p-3 rounded-lg border transition-all relative",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground/40 bg-background",
              )}
            >
              <div className="flex gap-1 mb-2">
                {t.swatches.map((c, i) => (
                  <span key={i} className="size-2.5 rounded-full" style={{ background: c }} />
                ))}
                {active && <span className="ml-auto text-primary text-xs">✓</span>}
              </div>
              <div className="text-[11px] font-semibold leading-tight">{t.label}</div>
              <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                {t.description}
              </div>
            </button>
          );
        })}
      </div>

      <Section icon={PaperIcon} title="Paper & Layout">
        <div>
          <FieldLabel>Paper Size</FieldLabel>
          <RadioRow
            value={s.paperSize}
            onChange={(v) => setSettings({ paperSize: v })}
            options={[
              { value: "A4", label: "A4" },
              { value: "Letter", label: "Letter" },
            ]}
          />
        </div>
        <div>
          <FieldLabel>Margins</FieldLabel>
          <RadioRow
            value={s.margins}
            onChange={(v) => setSettings({ margins: v })}
            options={[
              { value: "narrow", label: "Narrow" },
              { value: "normal", label: "Normal" },
              { value: "wide", label: "Wide" },
            ]}
          />
        </div>

        <div className="border-t border-border/60 pt-4 mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-indigo-400">
              <Sparkles className="size-3.5 text-indigo-400 fill-indigo-400 animate-pulse" />
              Page Fit Assistant
            </span>
            {isAutoAdjusting && (
              <Badge
                variant="outline"
                className="text-[9px] py-0 px-1 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse"
              >
                Fitting...
              </Badge>
            )}
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Adjusts typography and spacing to target a page count. If the result gets too dense,
            shorten content instead of relying on smaller type.
          </p>

          <div className="flex items-center justify-between bg-secondary p-2.5 rounded-md border border-border">
            <div className="space-y-0.5">
              <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                Current Length
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-bold font-mono">
                  {currentPageEstimate === "N/A (Editor Mode)" ? "N/A" : `~${currentPageEstimate}`}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {currentPageEstimate === "N/A (Editor Mode)" ? "Editor Mode" : "Pages"}
                </span>
              </div>
            </div>

            {currentPageEstimate !== "N/A (Editor Mode)" && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={() => runAutoAdjust(1)}
                  disabled={isAutoAdjusting}
                  variant="outline"
                  className={pageFitButtonClassName}
                >
                  Fit 1 Pg
                </Button>
                <Button
                  size="sm"
                  onClick={() => runAutoAdjust(2)}
                  disabled={isAutoAdjusting}
                  variant="outline"
                  className={pageFitButtonClassName}
                >
                  Fit 2 Pg
                </Button>
              </div>
            )}
          </div>

          {lastFit && (
            <div className="rounded-md border border-border bg-secondary/60 p-2.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Fit Summary: {lastFit.targetPages} Pg
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={undoFit}
                  className="h-6 px-2 text-[10px] gap-1"
                >
                  <Undo2 className="size-3" />
                  Undo Fit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-mono text-muted-foreground">
                <span>
                  Font {lastFit.before.fontSize}px {"->"} {lastFit.after.fontSize}px
                </span>
                <span>
                  Line {lastFit.before.lineHeight} {"->"} {lastFit.after.lineHeight}
                </span>
                <span>
                  Section {lastFit.before.sectionSpacing}px {"->"} {lastFit.after.sectionSpacing}px
                </span>
                <span>
                  Para {lastFit.before.paragraphSpacing}px {"->"} {lastFit.after.paragraphSpacing}px
                </span>
              </div>
              {lastFit.tooDense && (
                <div className="flex gap-1.5 text-[10px] leading-relaxed text-amber-400">
                  <AlertTriangle className="size-3 shrink-0 mt-0.5" />
                  The fitted layout is dense. Shortening bullets will usually read better.
                </div>
              )}
            </div>
          )}
        </div>
      </Section>

      <Section icon={Type} title="Typography">
        <div>
          <FieldLabel>Body Font</FieldLabel>
          <NativeSelect
            value={s.bodyFont}
            onChange={(v) => setSettings({ bodyFont: v })}
            options={FONTS.map((f) => ({ value: f, label: f }))}
          />
        </div>
        <div>
          <FieldLabel>Heading Font</FieldLabel>
          <NativeSelect
            value={s.headingFont}
            onChange={(v) => setSettings({ headingFont: v })}
            options={FONTS.map((f) => ({ value: f, label: f }))}
          />
        </div>
        <div>
          <FieldLabel>Heading Weight</FieldLabel>
          <NativeSelect
            value={s.headingWeight}
            onChange={(v) => setSettings({ headingWeight: v as typeof s.headingWeight })}
            options={[
              { value: "400", label: "Regular" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semibold" },
              { value: "700", label: "Bold" },
              { value: "800", label: "Extrabold" },
            ]}
          />
        </div>
        <div>
          <FieldLabel value={`${parseFloat(s.fontSize.toFixed(2))}px`}>Font Size</FieldLabel>
          <Slider
            value={[s.fontSize]}
            min={11}
            max={20}
            step={1}
            onValueChange={([v]) => setSettings({ fontSize: v })}
          />
        </div>
        <div>
          <FieldLabel value={parseFloat(s.headingScale.toFixed(2)).toString()}>
            Heading Scale
          </FieldLabel>
          <Slider
            value={[s.headingScale]}
            min={1}
            max={1.8}
            step={0.1}
            onValueChange={([v]) => setSettings({ headingScale: v })}
          />
        </div>
        <div>
          <FieldLabel value={parseFloat(s.lineHeight.toFixed(2)).toString()}>
            Line Height
          </FieldLabel>
          <Slider
            value={[s.lineHeight]}
            min={1.2}
            max={2}
            step={0.1}
            onValueChange={([v]) => setSettings({ lineHeight: v })}
          />
        </div>
      </Section>

      <Section icon={LayoutGrid} title="Spacing & Dividers">
        <div>
          <FieldLabel value={`${parseFloat(s.sectionSpacing.toFixed(2))}px`}>
            Section Spacing
          </FieldLabel>
          <Slider
            value={[s.sectionSpacing]}
            min={8}
            max={48}
            step={2}
            onValueChange={([v]) => setSettings({ sectionSpacing: v })}
          />
        </div>
        <div>
          <FieldLabel value={`${parseFloat(s.paragraphSpacing.toFixed(2))}px`}>
            Paragraph Spacing
          </FieldLabel>
          <Slider
            value={[s.paragraphSpacing]}
            min={2}
            max={20}
            step={1}
            onValueChange={([v]) => setSettings({ paragraphSpacing: v })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Show Section Dividers</label>
          <Switch
            checked={s.showDividers}
            onCheckedChange={(v) => setSettings({ showDividers: v })}
          />
        </div>
      </Section>

      {ENABLE_IMPROVE_TEXT && (
        <Section icon={Wand2} title="AI Assistant" defaultOpen={false}>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Use selected-text rewrite tools from the AI panel when this experimental feature is
            enabled.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-indigo-400 border-indigo-500/20 hover:bg-indigo-950/20 hover:text-indigo-300"
            onClick={toggleAIPanel}
          >
            <Sparkles className="size-3.5 fill-indigo-400 text-indigo-400 animate-pulse" />
            Open AI Improve Panel
          </Button>
        </Section>
      )}

      <div className="p-4 text-[10px] text-muted-foreground text-center">
        MDResume · v0.2 · Auto-saved locally
      </div>
    </aside>
  );
}
