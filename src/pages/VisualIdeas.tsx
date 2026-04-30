import React from "react";
import { ImagePlus, PencilLine, Plus, Star, Trash2, X } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import type { VisualIdea, VisualIdeaType } from "../types";
import { createId } from "../utils/constants";
import { useToast } from "../hooks/useToast";

type VisualIdeasProps = {
  ideas: VisualIdea[];
  setIdeas: React.Dispatch<React.SetStateAction<VisualIdea[]>>;
};

type FormState = {
  title: string;
  description: string;
  type: VisualIdeaType;
  tags: string;
  imageDataUrl?: string;
};

const initialForm: FormState = {
  title: "",
  description: "",
  type: "custom",
  tags: "",
  imageDataUrl: undefined,
};

const chartTypes: Array<{ value: VisualIdeaType; label: string }> = [
  { value: "column", label: "Столбчатая (Column)" },
  { value: "bar", label: "Линейчатая (Bar)" },
  { value: "line", label: "Линейная (Line)" },
  { value: "area", label: "С областями (Area)" },
  { value: "combo", label: "Комбинированная (Combo)" },
  { value: "histogram", label: "Гистограмма (Histogram)" },
  { value: "boxplot", label: "Boxplot" },
  { value: "scatter", label: "Диаграмма рассеяния (Scatter)" },
  { value: "heatmap", label: "Тепловая карта (Heatmap)" },
  { value: "pie", label: "Круговая (Pie)" },
  { value: "donut", label: "Кольцевая (Donut)" },
  { value: "treemap", label: "Treemap" },
  { value: "radar", label: "Радар (Radar)" },
  { value: "waterfall", label: "Водопад (Waterfall)" },
  { value: "funnel", label: "Воронка (Funnel)" },
  { value: "sankey", label: "Sankey" },
  { value: "map", label: "Карта (Map)" },
  { value: "table", label: "Таблица (Table)" },
  { value: "kpi", label: "KPI-карточка" },
  { value: "custom", label: "Пользовательский" },
];

const chartTypeOptions = chartTypes.map((item) => ({
  value: item.value,
  label: item.label,
}));

const filterOptions: Array<{ value: VisualIdeaType | "all"; label: string }> = [
  { value: "all", label: "Все типы" },
  ...chartTypes.map((item) => ({
    value: item.value,
    label: item.label,
  })),
];

const getChartTypeLabel = (type: VisualIdeaType): string =>
  chartTypes.find((item) => item.value === type)?.label ?? type;

const parseTags = (raw: string): string[] =>
  raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const IdeaPreview = ({ type }: { type: VisualIdeaType }) => {
  switch (type) {
    case "column":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <rect x="20" y="58" width="22" height="45" fill="currentColor" opacity="0.55" />
          <rect x="56" y="42" width="22" height="61" fill="currentColor" opacity="0.75" />
          <rect x="92" y="28" width="22" height="75" fill="currentColor" />
          <rect x="128" y="52" width="22" height="51" fill="currentColor" opacity="0.7" />
          <rect x="164" y="36" width="22" height="67" fill="currentColor" opacity="0.88" />
        </svg>
      );
    case "bar":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <rect x="14" y="18" width="140" height="14" fill="currentColor" opacity="0.8" />
          <rect x="14" y="42" width="112" height="14" fill="currentColor" opacity="0.65" />
          <rect x="14" y="66" width="164" height="14" fill="currentColor" />
          <rect x="14" y="90" width="90" height="14" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case "line":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <polyline
            points="8,92 42,72 78,80 114,40 152,55 188,20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "area":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <path
            d="M8 92 L42 68 L78 76 L114 36 L152 50 L188 22 L188 108 L8 108 Z"
            fill="currentColor"
            opacity="0.35"
          />
          <polyline
            points="8,92 42,68 78,76 114,36 152,50 188,22"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "combo":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <rect x="20" y="58" width="20" height="45" fill="currentColor" opacity="0.4" />
          <rect x="52" y="34" width="20" height="69" fill="currentColor" opacity="0.6" />
          <rect x="84" y="44" width="20" height="59" fill="currentColor" opacity="0.5" />
          <rect x="116" y="62" width="20" height="41" fill="currentColor" opacity="0.4" />
          <polyline
            points="20,66 62,50 94,30 126,43 172,24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "histogram":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          {[16, 28, 48, 70, 90, 80, 60, 36].map((height, index) => (
            <rect
              key={index}
              x={16 + index * 22}
              y={106 - height}
              width="20"
              height={height}
              fill="currentColor"
              opacity={0.35 + index * 0.06}
            />
          ))}
        </svg>
      );
    case "boxplot":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          {[
            { x: 28, q1: 68, q3: 42, min: 28, max: 88, median: 54 },
            { x: 86, q1: 74, q3: 48, min: 34, max: 96, median: 61 },
            { x: 144, q1: 64, q3: 38, min: 24, max: 86, median: 50 },
          ].map((box, idx) => (
            <g key={idx}>
              <line x1={box.x + 12} x2={box.x + 12} y1={box.min} y2={box.max} stroke="currentColor" strokeWidth="2" />
              <rect x={box.x} y={box.q3} width="24" height={box.q1 - box.q3} fill="currentColor" opacity="0.35" />
              <line x1={box.x} x2={box.x + 24} y1={box.median} y2={box.median} stroke="currentColor" strokeWidth="2.5" />
            </g>
          ))}
        </svg>
      );
    case "kpi":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-3 text-brand-600">
          <text x="10" y="50" fontSize="34" fill="currentColor" fontWeight="700">
            12.4%
          </text>
          <text x="10" y="78" fontSize="14" fill="currentColor" opacity="0.8">
            +2.1 п.п. к прошлому периоду
          </text>
        </svg>
      );
    case "funnel":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <polygon points="12,14 188,14 166,36 34,36" fill="currentColor" opacity="0.25" />
          <polygon points="34,40 166,40 146,60 54,60" fill="currentColor" opacity="0.45" />
          <polygon points="54,64 146,64 126,82 74,82" fill="currentColor" opacity="0.65" />
          <polygon points="74,86 126,86 108,102 92,102" fill="currentColor" />
        </svg>
      );
    case "waterfall":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <rect x="14" y="52" width="22" height="42" fill="currentColor" opacity="0.7" />
          <rect x="48" y="62" width="22" height="32" fill="currentColor" opacity="0.4" />
          <rect x="82" y="42" width="22" height="52" fill="currentColor" opacity="0.7" />
          <rect x="116" y="70" width="22" height="24" fill="currentColor" opacity="0.4" />
          <rect x="150" y="30" width="22" height="64" fill="currentColor" />
        </svg>
      );
    case "heatmap":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 6 }).map((__, col) => (
              <rect
                key={`${row}-${col}`}
                x={12 + col * 30}
                y={12 + row * 24}
                width="24"
                height="18"
                fill="currentColor"
                opacity={0.2 + ((row + col) % 6) * 0.13}
              />
            ))
          )}
        </svg>
      );
    case "scatter":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          {[18, 40, 68, 96, 124, 152, 180].map((x, index) => (
            <circle key={x} cx={x} cy={88 - (index % 4) * 17} r={5 + (index % 3)} fill="currentColor" opacity="0.75" />
          ))}
        </svg>
      );
    case "pie":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <circle cx="100" cy="60" r="42" fill="currentColor" opacity="0.18" />
          <path d="M100 60 L100 18 A42 42 0 0 1 140 75 Z" fill="currentColor" opacity="0.88" />
          <path d="M100 60 L140 75 A42 42 0 0 1 78 96 Z" fill="currentColor" opacity="0.55" />
          <path d="M100 60 L78 96 A42 42 0 0 1 58 44 Z" fill="currentColor" opacity="0.75" />
        </svg>
      );
    case "donut":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <circle cx="100" cy="60" r="36" fill="none" stroke="currentColor" strokeWidth="18" opacity="0.2" />
          <circle
            cx="100"
            cy="60"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="18"
            strokeDasharray="150 226"
            strokeLinecap="round"
            transform="rotate(-90 100 60)"
          />
        </svg>
      );
    case "treemap":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <rect x="10" y="12" width="86" height="44" fill="currentColor" opacity="0.65" />
          <rect x="100" y="12" width="90" height="26" fill="currentColor" opacity="0.42" />
          <rect x="100" y="42" width="90" height="48" fill="currentColor" opacity="0.82" />
          <rect x="10" y="60" width="64" height="42" fill="currentColor" opacity="0.38" />
          <rect x="78" y="60" width="112" height="42" fill="currentColor" opacity="0.56" />
        </svg>
      );
    case "radar":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <polygon points="100,18 152,42 140,90 60,90 48,42" fill="currentColor" opacity="0.15" />
          <polygon points="100,28 140,46 130,82 70,82 60,46" fill="currentColor" opacity="0.35" />
          <polygon points="100,34 126,50 118,76 82,76 74,50" fill="currentColor" opacity="0.7" />
        </svg>
      );
    case "sankey":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <path d="M16 30 C60 30, 80 20, 120 20 L188 20" stroke="currentColor" strokeWidth="10" fill="none" opacity="0.65" />
          <path d="M16 58 C60 58, 80 64, 120 72 L188 72" stroke="currentColor" strokeWidth="12" fill="none" opacity="0.5" />
          <path d="M16 92 C60 92, 80 88, 120 100 L188 100" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.8" />
        </svg>
      );
    case "table":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <rect x="10" y="16" width="180" height="88" fill="none" stroke="currentColor" strokeWidth="2" />
          {[34, 52, 70, 88].map((y) => (
            <line key={y} x1="10" x2="190" y1={y} y2={y} stroke="currentColor" strokeWidth="1.5" opacity="0.65" />
          ))}
          {[70, 118, 158].map((x) => (
            <line key={x} x1={x} x2={x} y1="16" y2="104" stroke="currentColor" strokeWidth="1.5" opacity="0.65" />
          ))}
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <path
            d="M16 60 L42 38 L74 28 L110 38 L138 24 L168 36 L184 58 L170 84 L134 92 L98 86 L76 98 L44 90 L28 72 Z"
            fill="currentColor"
            opacity="0.32"
          />
          <circle cx="75" cy="56" r="7" fill="currentColor" />
          <circle cx="126" cy="64" r="7" fill="currentColor" />
          <circle cx="96" cy="44" r="7" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 120" className="h-28 w-full rounded-lg bg-slate-100 p-2 text-brand-600">
          <rect x="12" y="12" width="176" height="96" rx="8" fill="currentColor" opacity="0.12" />
          <text x="100" y="66" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="600">
            Пользовательский референс
          </text>
        </svg>
      );
  }
};

const VisualIdeas = ({ ideas, setIdeas }: VisualIdeasProps) => {
  const [form, setForm] = React.useState<FormState>(initialForm);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<VisualIdeaType | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);
  const [previewIdeaId, setPreviewIdeaId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const previewIdea = React.useMemo(
    () => ideas.find((idea) => idea.id === previewIdeaId) ?? null,
    [ideas, previewIdeaId]
  );

  const filteredIdeas = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    const matched = ideas.filter((idea) => {
      if (favoritesOnly && !idea.favorite) {
        return false;
      }
      if (filter !== "all" && idea.type !== filter) {
        return false;
      }
      if (!term) {
        return true;
      }
      return [idea.title, idea.description, idea.tags.join(" "), idea.type].join(" ").toLowerCase().includes(term);
    });

    return matched.sort((a, b) => {
      if (a.favorite !== b.favorite) {
        return a.favorite ? -1 : 1;
      }
      return a.title.localeCompare(b.title, "ru");
    });
  }, [ideas, search, filter, favoritesOnly]);

  React.useEffect(() => {
    if (!previewIdeaId) {
      return;
    }
    if (!ideas.some((idea) => idea.id === previewIdeaId)) {
      setPreviewIdeaId(null);
    }
  }, [ideas, previewIdeaId]);

  React.useEffect(() => {
    if (!previewIdeaId) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewIdeaId(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [previewIdeaId]);

  React.useEffect(() => {
    if (!previewIdeaId) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [previewIdeaId]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const addOrUpdateIdea = () => {
    const title = form.title.trim();
    if (!title) {
      showToast("Введите название идеи");
      return;
    }

    if (editingId) {
      setIdeas((current) =>
        current.map((idea) =>
          idea.id === editingId
            ? {
                ...idea,
                title,
                description: form.description.trim() || "Пользовательская идея визуализации",
                type: form.type,
                imageDataUrl: form.imageDataUrl,
                tags: parseTags(form.tags),
              }
            : idea
        )
      );
      showToast("Идея обновлена");
    } else {
      const newIdea: VisualIdea = {
        id: createId(),
        title,
        description: form.description.trim() || "Пользовательская идея визуализации",
        type: form.type,
        imageDataUrl: form.imageDataUrl,
        tags: parseTags(form.tags),
        favorite: false,
      };
      setIdeas((current) => [newIdea, ...current]);
      showToast("Идея добавлена");
    }

    resetForm();
  };

  const startEdit = (idea: VisualIdea) => {
    setPreviewIdeaId(null);
    setEditingId(idea.id);
    setForm({
      title: idea.title,
      description: idea.description,
      type: idea.type,
      tags: idea.tags.join(", "),
      imageDataUrl: idea.imageDataUrl,
    });
  };

  const removeIdea = (id: string) => {
    setIdeas((current) => current.filter((idea) => idea.id !== id));
    if (editingId === id) {
      resetForm();
    }
    if (previewIdeaId === id) {
      setPreviewIdeaId(null);
    }
    showToast("Идея удалена");
  };

  const toggleFavorite = (id: string) => {
    setIdeas((current) =>
      current.map((idea) => (idea.id === id ? { ...idea, favorite: !idea.favorite } : idea))
    );
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        imageDataUrl: typeof reader.result === "string" ? reader.result : undefined,
      }));
      showToast("Изображение загружено");
    };
    reader.onerror = () => {
      showToast("Не удалось прочитать изображение");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <h3 className="text-lg font-bold text-slate-900">
          {editingId ? "Редактировать идею визуализации" : "Добавить идею визуализации"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Создавайте карточки-референсы, отмечайте избранное и храните скриншоты графиков.
        </p>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Input
            label="Название"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Например: Воронка найма по этапам"
          />
          <label className="block text-sm">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Тип визуала</span>
            <Select value={form.type} onChange={(nextType) => setForm((current) => ({ ...current, type: nextType }))} options={chartTypeOptions} />
          </label>
        </div>

        <div className="mt-3">
          <Textarea
            label="Описание"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            rows={3}
            placeholder="Когда полезен этот график и какие метрики лучше показывать."
          />
        </div>
        <div className="mt-3">
          <Input
            label="Теги (через запятую)"
            value={form.tags}
            onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            placeholder="KPI, план-факт, тренд"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              handleImageFile(file);
              event.target.value = "";
            }}
          />
          <Button
            variant="secondary"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <ImagePlus size={16} />
            Загрузить изображение
          </Button>
          {form.imageDataUrl ? (
            <Button
              variant="secondary"
              onClick={() => {
                setForm((current) => ({ ...current, imageDataUrl: undefined }));
              }}
            >
              <X size={16} />
              Убрать изображение
            </Button>
          ) : null}
          <Button onClick={addOrUpdateIdea}>
            <Plus size={16} />
            {editingId ? "Сохранить изменения" : "Добавить идею"}
          </Button>
          {editingId ? (
            <Button variant="secondary" onClick={resetForm}>
              Отменить редактирование
            </Button>
          ) : null}
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <Input
            label="Поиск"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по названию, описанию и тегам..."
          />
          <label className="block text-sm">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Фильтр типа</span>
            <Select value={filter} onChange={setFilter} options={filterOptions} className="min-w-56" />
          </label>
          <Button
            variant={favoritesOnly ? "primary" : "secondary"}
            onClick={() => setFavoritesOnly((current) => !current)}
          >
            <Star size={16} />
            {favoritesOnly ? "Только избранное" : "Все + избранное"}
          </Button>
        </div>
      </Card>

      {filteredIdeas.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Идей пока нет</p>
          <p className="mt-1 text-sm text-slate-600">Добавьте первую идею или измените фильтры.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredIdeas.map((idea) => (
                        <Card
              key={idea.id}
              className="cursor-pointer p-4 transition hover:-translate-y-0.5 hover:shadow-soft"
              role="button"
              tabIndex={0}
              onClick={() => setPreviewIdeaId(idea.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setPreviewIdeaId(idea.id);
                }
              }}
            >
              {idea.imageDataUrl ? (
                <div className="flex h-36 w-full items-center justify-center rounded-lg border border-slate-200 bg-white p-2">
                  <img src={idea.imageDataUrl} alt={idea.title} className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <IdeaPreview type={idea.type} />
              )}
              <div className="mt-3 flex items-start justify-between gap-2">
                <h4 className="text-base font-bold text-slate-900">{idea.title}</h4>
                <button
                  type="button"
                  className={`rounded-md p-1.5 transition ${idea.favorite ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(idea.id);
                  }}
                  title={idea.favorite ? "Убрать из избранного" : "Добавить в избранное"}
                >
                  <Star size={17} fill={idea.favorite ? "currentColor" : "none"} />
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-600">{idea.description}</p>
              {idea.tags.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {idea.tags.map((tag) => (
                    <span key={`${idea.id}-${tag}`} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-3 flex gap-2">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    startEdit(idea);
                  }}
                >
                  <PencilLine size={15} />
                  Изменить
                </Button>
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeIdea(idea.id);
                  }}
                >
                  <Trash2 size={15} />
                  Удалить
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {previewIdea ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          onClick={() => setPreviewIdeaId(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{previewIdea.title}</h4>
                <p className="mt-0.5 text-xs text-slate-500">{getChartTypeLabel(previewIdea.type)}</p>
              </div>
              <Button variant="secondary" className="px-3" onClick={() => setPreviewIdeaId(null)}>
                <X size={16} />
                Закрыть
              </Button>
            </div>

            <div className="grid max-h-[calc(92vh-72px)] gap-4 overflow-y-auto p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3">
                {previewIdea.imageDataUrl ? (
                  <img
                    src={previewIdea.imageDataUrl}
                    alt={previewIdea.title}
                    className="max-h-[70vh] max-w-full object-contain"
                  />
                ) : (
                  <div className="w-full max-w-3xl">
                    <IdeaPreview type={previewIdea.type} />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-slate-700">{previewIdea.description}</p>
                {previewIdea.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {previewIdea.tags.map((tag) => (
                      <span key={`preview-${previewIdea.id}-${tag}`} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  Откройте редактирование, чтобы быстро обновить описание, теги или превью.
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" className="w-full" onClick={() => startEdit(previewIdea)}>
                    <PencilLine size={15} />
                    Изменить
                  </Button>
                  <Button variant="danger" className="w-full" onClick={() => removeIdea(previewIdea.id)}>
                    <Trash2 size={15} />
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VisualIdeas;

