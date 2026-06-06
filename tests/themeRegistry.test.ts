import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME_ID,
  isResumeTheme,
  normalizeResumeTheme,
  THEMES,
} from "../src/lib/themeRegistry";

describe("theme registry", () => {
  it("recognizes every registered theme id", () => {
    for (const theme of THEMES) {
      expect(isResumeTheme(theme.id)).toBe(true);
      expect(normalizeResumeTheme(theme.id)).toBe(theme.id);
      expect(theme.swatches).toHaveLength(3);
    }
  });

  it("falls back to the default theme for stale persisted values", () => {
    expect(normalizeResumeTheme("missing-theme")).toBe(DEFAULT_THEME_ID);
    expect(normalizeResumeTheme(null)).toBe(DEFAULT_THEME_ID);
    expect(normalizeResumeTheme(undefined)).toBe(DEFAULT_THEME_ID);
  });
});
