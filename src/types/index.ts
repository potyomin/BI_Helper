export type ColorRole =
  | "Primary"
  | "Secondary"
  | "Accent"
  | "Background"
  | "Text"
  | "Success"
  | "Warning"
  | "Error"
  | "Neutral";

export type BIColor = {
  id: string;
  name: string;
  hex: string;
  role: ColorRole;
};

export type Palette = {
  id: string;
  name: string;
  colors: BIColor[];
};

export type DaxTemplate = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  code: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type SymbolItem = {
  id: string;
  symbol: string;
  label: string;
  category?: string;
  imageDataUrl?: string;
  mimeType?: string;
};

export type ToastMessage = {
  id: string;
  message: string;
};

export type PowerBITheme = {
  name: string;
  dataColors: string[];
  background: string;
  foreground: string;
  tableAccent: string;
  good: string;
  bad: string;
  neutral: string;
  minimum: string;
  center: string;
  maximum: string;
};

export type VisualIdeaType =
  | "column"
  | "line"
  | "area"
  | "bar"
  | "histogram"
  | "boxplot"
  | "combo"
  | "kpi"
  | "funnel"
  | "waterfall"
  | "heatmap"
  | "scatter"
  | "pie"
  | "donut"
  | "treemap"
  | "radar"
  | "table"
  | "sankey"
  | "map"
  | "custom";

export type VisualIdea = {
  id: string;
  title: string;
  description: string;
  type: VisualIdeaType;
  imageDataUrl?: string;
  tags: string[];
  favorite: boolean;
};

export type ThemeMode = "light" | "dark";
