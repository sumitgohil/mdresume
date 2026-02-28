/* eslint-disable @typescript-eslint/no-explicit-any */
import { useResumeStore } from "@/store/resumeStore";

let activeEditor: any = null;

export const editorService = {
  setEditor(editor: any) {
    activeEditor = editor;
  },

  getEditor() {
    return activeEditor;
  },

  getSelectedText(): string {
    if (!activeEditor) return "";
    const selection = activeEditor.getSelection();
    if (!selection) return "";
    return activeEditor.getModel()?.getValueInRange(selection) || "";
  },

  replaceSelection(newText: string) {
    if (!activeEditor) return;
    const selection = activeEditor.getSelection();
    if (!selection) return;

    const range = {
      startLineNumber: selection.startLineNumber,
      startColumn: selection.startColumn,
      endLineNumber: selection.endLineNumber,
      endColumn: selection.endColumn,
    };

    activeEditor.executeEdits("ai-improve", [
      {
        range,
        text: newText,
        forceMoveMarkers: true,
      },
    ]);

    // Refresh selection state in Zustand store
    const updatedSelection = activeEditor.getSelection();
    if (updatedSelection) {
      const text = activeEditor.getModel()?.getValueInRange(updatedSelection) || "";
      useResumeStore.getState().setSelectedText(text);
    }
  },
};
