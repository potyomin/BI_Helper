import React from "react";
import { Download, Wand2 } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import CodeBlock from "../components/CodeBlock";
import Select from "../components/Select";
import type { Palette } from "../types";
import { buildThemeFromPalette } from "../utils/themeGenerator";
import { copyToClipboard } from "../utils/clipboard";
import { useToast } from "../hooks/useToast";

type ThemeGeneratorProps = {
  palettes: Palette[];
};

const ThemeGenerator = ({ palettes }: ThemeGeneratorProps) => {
  const [selectedPaletteId, setSelectedPaletteId] = React.useState(palettes[0]?.id ?? "");
  const { showToast } = useToast();

  React.useEffect(() => {
    if (palettes.length === 0) {
      setSelectedPaletteId("");
      return;
    }

    const exists = palettes.some((palette) => palette.id === selectedPaletteId);
    if (!exists) {
      setSelectedPaletteId(palettes[0].id);
    }
  }, [palettes, selectedPaletteId]);

  const selectedPalette = palettes.find((palette) => palette.id === selectedPaletteId) ?? null;
  const generatedTheme = buildThemeFromPalette(selectedPalette);
  const themeJson = JSON.stringify(generatedTheme, null, 2);
  const paletteOptions = React.useMemo(
    () =>
      palettes.map((palette) => ({
        value: palette.id,
        label: palette.name,
      })),
    [palettes]
  );

  const themeUsageSteps = [
    "Нажмите «Скачать JSON» и сохраните файл темы.",
    "Откройте Power BI Desktop.",
    "Перейдите: «Вид» -> «Темы» -> «Обзор тем».",
    "Выберите скачанный JSON-файл и импортируйте тему.",
  ];

  const copyJson = async () => {
    const result = await copyToClipboard(themeJson);
    showToast(result.ok ? "JSON скопирован" : result.message ?? "Не удалось скопировать");
  };

  const downloadJson = () => {
    const blob = new Blob([themeJson], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const filename = `${(selectedPalette?.name ?? "bi-helper-theme")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}.json`;

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);

    showToast("Файл темы скачан");
  };

  if (palettes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">Нет доступных палитр</p>
        <p className="mt-1 text-sm text-slate-600">
          Сначала создайте палитру, затем вернитесь сюда для генерации JSON-темы Power BI.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <h3 className="text-lg font-bold text-slate-900">Как использовать генератор темы</h3>
        <p className="mt-1 text-sm text-slate-600">
          Генератор формирует JSON-тему Power BI из вашей палитры. Эта тема задает цвета для новых визуалов в отчете.
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          {themeUsageSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-bold text-slate-900">Генерация JSON-темы Power BI</h3>
        <p className="mt-1 text-sm text-slate-600">
          Выберите палитру, и BI Helper автоматически подставит цвета в структуру темы.
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <label className="block text-sm">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Палитра</span>
            <Select value={selectedPaletteId} onChange={setSelectedPaletteId} options={paletteOptions} />
          </label>
          <Button variant="secondary" className="self-end" onClick={copyJson}>
            <Wand2 size={16} />
            Копировать JSON
          </Button>
          <Button className="self-end" onClick={downloadJson}>
            <Download size={16} />
            Скачать JSON
          </Button>
        </div>

        <div className="mt-4 grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 md:grid-cols-2">
          <p>
            <span className="font-semibold">dataColors:</span> все валидные цвета палитры
          </p>
          <p>
            <span className="font-semibold">background:</span> роль «Background», иначе первый цвет
          </p>
          <p>
            <span className="font-semibold">foreground:</span> роль «Text», иначе первый цвет
          </p>
          <p>
            <span className="font-semibold">tableAccent:</span> роль «Primary», иначе первый цвет
          </p>
          <p>
            <span className="font-semibold">good / bad / neutral:</span> semantic colors based on Success / Error / Neutral roles
          </p>
          <p>
            <span className="font-semibold">minimum / center / maximum:</span> gradient colors for heatmaps and conditional formatting
          </p>
          <p>
            <span className="font-semibold">name:</span> generated from selected palette title
          </p>
        </div>
      </Card>

      <CodeBlock code={themeJson} title="powerbi-theme.json" onCopy={copyJson} />
    </div>
  );
};

export default ThemeGenerator;
