import type { BIColor, Palette, PowerBITheme } from "../types";
import { isValidHex, normalizeHex } from "./colorUtils";

const FALLBACK_COLOR = "#1F77B4";
const FALLBACK_BACKGROUND = "#FFFFFF";
const FALLBACK_FOREGROUND = "#252423";
const FALLBACK_SUCCESS = "#2CA02C";
const FALLBACK_ERROR = "#D62728";
const FALLBACK_NEUTRAL = "#8A97A8";

const toSafeHex = (value: string): string | null => (isValidHex(value) ? normalizeHex(value) : null);

const getValidColors = (colors: BIColor[]): string[] => {
  const deduped = new Set<string>();
  for (const color of colors) {
    const safeHex = toSafeHex(color.hex);
    if (safeHex) {
      deduped.add(safeHex);
    }
  }
  return [...deduped];
};

const findColorByRole = (colors: BIColor[], role: BIColor["role"]): string | undefined => {
  const value = colors.find((color) => color.role === role)?.hex;
  if (!value) {
    return undefined;
  }
  return toSafeHex(value) ?? undefined;
};

const findColorByRoles = (colors: BIColor[], roles: BIColor["role"][]): string | undefined => {
  for (const role of roles) {
    const value = findColorByRole(colors, role);
    if (value) {
      return value;
    }
  }
  return undefined;
};

export const buildThemeFromPalette = (palette: Palette | null): PowerBITheme => {
  const colors = palette?.colors ?? [];
  const validColors = getValidColors(colors);
  const firstColor = validColors[0];

  const dataColors = validColors.length > 0 ? validColors : [FALLBACK_COLOR];
  const background = findColorByRole(colors, "Background") ?? firstColor ?? FALLBACK_BACKGROUND;
  const foreground = findColorByRole(colors, "Text") ?? firstColor ?? FALLBACK_FOREGROUND;
  const tableAccent = findColorByRole(colors, "Primary") ?? firstColor ?? FALLBACK_COLOR;
  const good = findColorByRoles(colors, ["Success", "Accent", "Primary"]) ?? FALLBACK_SUCCESS;
  const bad = findColorByRoles(colors, ["Error", "Warning", "Accent"]) ?? FALLBACK_ERROR;
  const neutral = findColorByRoles(colors, ["Neutral", "Secondary", "Background"]) ?? FALLBACK_NEUTRAL;
  const minimum = findColorByRoles(colors, ["Secondary", "Background", "Neutral"]) ?? background;
  const center = findColorByRoles(colors, ["Accent", "Primary", "Text"]) ?? tableAccent;
  const maximum = findColorByRoles(colors, ["Primary", "Success", "Accent"]) ?? tableAccent;
  const themeName = `${(palette?.name ?? "BI Helper").trim() || "BI Helper"} Theme`;

  return {
    name: themeName,
    dataColors,
    background,
    foreground,
    tableAccent,
    good,
    bad,
    neutral,
    minimum,
    center,
    maximum,
  };
};
