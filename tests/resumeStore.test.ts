import { describe, expect, it } from "vitest";
import { DEFAULT_THEME_ID } from "../src/lib/themeRegistry";
import { DEFAULT_SETTINGS, useResumeStore } from "../src/store/resumeStore";

describe("resume store", () => {
  it("updates the active resume document without replacing unrelated state", () => {
    const initial = useResumeStore.getState();
    const activeId = initial.activeId;

    initial.setName("Priya Nair");
    initial.setMarkdown("## Summary\n\n- Built accessible UI.");
    initial.setSettings({ fontSize: 16, margins: "wide" });

    const state = useResumeStore.getState();
    const active = state.resumes[activeId];

    expect(active.name).toBe("Priya Nair");
    expect(active.markdown).toContain("Built accessible UI");
    expect(active.settings).toMatchObject({ ...DEFAULT_SETTINGS, fontSize: 16, margins: "wide" });
    expect(state.viewMode).toBe(initial.viewMode);
  });

  it("normalizes stale theme values before storing them", () => {
    useResumeStore.getState().setTheme("missing-theme" as never);

    const active = useResumeStore.getState().resumes[useResumeStore.getState().activeId];

    expect(active.theme).toBe(DEFAULT_THEME_ID);
  });

  it("creates a new active resume and preserves existing documents", () => {
    const before = useResumeStore.getState();
    const previousIds = Object.keys(before.resumes);

    before.newResume();

    const after = useResumeStore.getState();
    const nextIds = Object.keys(after.resumes);

    expect(nextIds.length).toBe(previousIds.length + 1);
    expect(after.activeId).not.toBe(before.activeId);
    expect(after.resumes[after.activeId].name).toBe("Untitled Resume");
    for (const id of previousIds) {
      expect(after.resumes[id]).toBeTruthy();
    }
  });

  it("keeps settings and AI panels mutually exclusive when toggled", () => {
    const store = useResumeStore.getState();

    store.toggleAIPanel();
    expect(useResumeStore.getState()).toMatchObject({ aiPanelOpen: true, settingsOpen: false });

    useResumeStore.getState().toggleSettings();
    expect(useResumeStore.getState()).toMatchObject({ aiPanelOpen: false, settingsOpen: true });
  });
});
