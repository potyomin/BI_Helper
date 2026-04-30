import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Palettes from "./pages/Palettes";
import ThemeGenerator from "./pages/ThemeGenerator";
import DaxLibrary from "./pages/DaxLibrary";
import IconsLibrary from "./pages/IconsLibrary";
import Checklist from "./pages/Checklist";
import VisualIdeas from "./pages/VisualIdeas";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  COLOR_ROLES,
  DEFAULT_CHECKLIST,
  DEFAULT_DAX_TEMPLATES,
  DEFAULT_PALETTES,
  DEFAULT_SYMBOLS,
  DEFAULT_VISUAL_IDEAS,
  STORAGE_KEYS,
} from "./utils/constants";
import type { BIColor, ChecklistItem, DaxTemplate, Palette, SymbolItem, VisualIdea, VisualIdeaType } from "./types";

const colorNameMap: Record<string, string> = {
  "Primary Blue": "Синий основной",
  "Secondary Orange": "Оранжевый дополнительный",
  "Accent Green": "Зеленый акцент",
  Background: "Фон",
  Text: "Текст",
  Warning: "Предупреждение",
  Error: "Ошибка",
};

const daxDefaultRuById: Record<string, Pick<DaxTemplate, "title" | "description">> = {
  "dax-dynamic-title": {
    title: "Динамический заголовок",
    description: "Формирует динамический заголовок отчета по выбранному году.",
  },
  "dax-selected-region": {
    title: "Выбранный регион",
    description: "Возвращает выбранный регион или значение по умолчанию.",
  },
  "dax-kpi-color": {
    title: "Цвет KPI",
    description: "Условный цвет KPI по пороговым значениям.",
  },
  "dax-sales-yoy": {
    title: "Продажи год-к-году %",
    description: "Год-к-году для продаж в процентах.",
  },
  "dax-rank-by-value": {
    title: "Ранг по значению",
    description: "Ранжирует категории по выбранной метрике по убыванию.",
  },
};

const validRoles = new Set(COLOR_ROLES);

const maybeTranslatePaletteName = (name: string): string => {
  if (name === "Default BI Palette") {
    return "Базовая BI-палитра";
  }
  const numberedPalette = name.match(/^Palette\s+(\d+)$/i);
  if (numberedPalette) {
    return `Палитра ${numberedPalette[1]}`;
  }
  return name;
};

const maybeTranslateColorName = (name: string): string => {
  if (name in colorNameMap) {
    return colorNameMap[name];
  }
  const numberedColor = name.match(/^Color\s+(\d+)$/i);
  if (numberedColor) {
    return `Цвет ${numberedColor[1]}`;
  }
  return name;
};

const normalizePaletteColor = (color: BIColor): BIColor => {
  const safeRole = validRoles.has(color.role) ? color.role : "Primary";
  return {
    ...color,
    name: maybeTranslateColorName(color.name),
    role: safeRole,
  };
};

const maybeTranslateSymbolLabel = (label: string): string => {
  const map: Record<string, string> = {
    Up: "Рост",
    Down: "Падение",
    Stable: "Стабильно",
    Success: "Успех",
    Error: "Ошибка",
    Warning: "Предупреждение",
    Star: "Избранное",
    Square: "Квадрат",
    "Right Arrow": "Стрелка вправо",
    "Left Arrow": "Стрелка влево",
  };
  return map[label] ?? label;
};

const validVisualTypes = new Set<VisualIdeaType>([
  "column",
  "line",
  "area",
  "bar",
  "histogram",
  "boxplot",
  "combo",
  "kpi",
  "funnel",
  "waterfall",
  "heatmap",
  "scatter",
  "pie",
  "donut",
  "treemap",
  "radar",
  "table",
  "sankey",
  "map",
  "custom",
]);

function App() {
  const [palettes, setPalettes] = useLocalStorage<Palette[]>(STORAGE_KEYS.palettes, DEFAULT_PALETTES);
  const [daxTemplates, setDaxTemplates] = useLocalStorage<DaxTemplate[]>(
    STORAGE_KEYS.daxTemplates,
    DEFAULT_DAX_TEMPLATES
  );
  const [checklist, setChecklist] = useLocalStorage<ChecklistItem[]>(STORAGE_KEYS.checklist, DEFAULT_CHECKLIST);
  const [symbols, setSymbols] = useLocalStorage<SymbolItem[]>(STORAGE_KEYS.symbols, DEFAULT_SYMBOLS);
  const [visualIdeas, setVisualIdeas] = useLocalStorage<VisualIdea[]>(STORAGE_KEYS.visualIdeas, DEFAULT_VISUAL_IDEAS);

  React.useEffect(() => {
    setPalettes((current) => {
      let changed = false;
      const next = current.map((palette) => {
        const nextName = maybeTranslatePaletteName(palette.name);
        const nextColors = palette.colors.map((color) => {
          const normalized = normalizePaletteColor(color);
          if (normalized.name !== color.name || normalized.role !== color.role) {
            changed = true;
          }
          return normalized;
        });

        if (nextName !== palette.name) {
          changed = true;
        }
        return {
          ...palette,
          name: nextName,
          colors: nextColors,
        };
      });
      return changed ? next : current;
    });
  }, [setPalettes]);

  React.useEffect(() => {
    setDaxTemplates((current) => {
      let changed = false;
      const existingIds = new Set(current.map((item) => item.id));
      const next = current.map((template) => {
        const ru = daxDefaultRuById[template.id];
        if (!ru) {
          return template;
        }
        if (template.title === ru.title && template.description === ru.description) {
          return template;
        }
        changed = true;
        return {
          ...template,
          title: ru.title,
          description: ru.description,
        };
      });

      for (const fallbackTemplate of DEFAULT_DAX_TEMPLATES) {
        if (!existingIds.has(fallbackTemplate.id)) {
          changed = true;
          next.push(fallbackTemplate);
        }
      }

      return changed ? next : current;
    });
  }, [setDaxTemplates]);

  React.useEffect(() => {
    setSymbols((current) => {
      let changed = false;
      const existingIds = new Set(current.map((item) => item.id));
      const next: SymbolItem[] = current.map((symbol) => {
        const nextLabel = maybeTranslateSymbolLabel(symbol.label);
        const nextCategory = symbol.category ?? "Пользовательские";
        if (nextLabel !== symbol.label) {
          changed = true;
        }
        if (nextCategory !== symbol.category) {
          changed = true;
        }
        return {
          ...symbol,
          label: nextLabel,
          category: nextCategory,
          imageDataUrl: symbol.imageDataUrl,
          mimeType: symbol.mimeType,
        };
      });

      for (const fallbackSymbol of DEFAULT_SYMBOLS) {
        if (!existingIds.has(fallbackSymbol.id)) {
          changed = true;
          next.push({
            ...fallbackSymbol,
            category: fallbackSymbol.category ?? "Пользовательские",
            imageDataUrl: fallbackSymbol.imageDataUrl,
            mimeType: fallbackSymbol.mimeType,
          });
        }
      }

      return changed ? next : current;
    });
  }, [setSymbols]);

  React.useEffect(() => {
    setVisualIdeas((current) => {
      let changed = false;
      const next = current.map((idea) => {
        const safeType = validVisualTypes.has(idea.type) ? idea.type : "custom";
        const favorite = idea.favorite ?? false;
        if (safeType !== idea.type || favorite !== idea.favorite) {
          changed = true;
        }
        return {
          ...idea,
          type: safeType,
          favorite,
        };
      });

      const existingIds = new Set(next.map((idea) => idea.id));
      for (const fallbackIdea of DEFAULT_VISUAL_IDEAS) {
        if (!existingIds.has(fallbackIdea.id)) {
          changed = true;
          next.push(fallbackIdea);
        }
      }

      return changed ? next : current;
    });
  }, [setVisualIdeas]);

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={<Dashboard palettes={palettes} daxTemplates={daxTemplates} checklistItems={checklist} />}
        />
        <Route path="/palettes" element={<Palettes palettes={palettes} setPalettes={setPalettes} />} />
        <Route path="/theme-generator" element={<ThemeGenerator palettes={palettes} />} />
        <Route
          path="/dax-library"
          element={<DaxLibrary templates={daxTemplates} setTemplates={setDaxTemplates} />}
        />
        <Route path="/icons-symbols" element={<IconsLibrary items={symbols} setItems={setSymbols} />} />
        <Route path="/visual-ideas" element={<VisualIdeas ideas={visualIdeas} setIdeas={setVisualIdeas} />} />
        <Route path="/checklist" element={<Checklist items={checklist} setItems={setChecklist} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
