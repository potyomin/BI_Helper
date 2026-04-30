import React from "react";
import { Copy, FileUp, PencilLine, Plus, Search, Trash2 } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import CodeBlock from "../components/CodeBlock";
import type { DaxTemplate } from "../types";
import { createId } from "../utils/constants";
import { copyToClipboard } from "../utils/clipboard";
import { useToast } from "../hooks/useToast";

type DaxLibraryProps = {
  templates: DaxTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<DaxTemplate[]>>;
};

type FormState = {
  title: string;
  description: string;
  tags: string;
  code: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  tags: "",
  code: "",
};

const normalizeTags = (rawTags: string): string[] =>
  rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const titleCase = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed[0].toUpperCase() + trimmed.slice(1);
};

const parseDaxTemplatesFromText = (text: string): DaxTemplate[] => {
  const lines = text.replace(/\r/g, "").split("\n");
  const templates: DaxTemplate[] = [];
  const startRegex = /^([^=].*?)\s*=\s*$/;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    const startMatch = line.match(startRegex);
    const isCandidate =
      Boolean(startMatch) &&
      !line.startsWith("-") &&
      !line.startsWith("Примечание") &&
      !line.includes("DATATABLE(") &&
      line.length > 2 &&
      line.length < 130;

    if (!isCandidate || !startMatch) {
      i += 1;
      continue;
    }

    const title = titleCase(startMatch[1]);
    const codeLines = [`${startMatch[1]} =`];
    let j = i + 1;

    while (j < lines.length) {
      const current = lines[j];
      const trimmed = current.trim();
      const nextStart = trimmed.match(startRegex);

      const isNewTemplate = Boolean(nextStart) && (lines[j - 1]?.trim() === "" || lines[j - 1] === undefined);
      const isSectionBreak = /^=+$/.test(trimmed);

      if (isNewTemplate || isSectionBreak) {
        break;
      }

      codeLines.push(current);
      j += 1;
    }

    const code = codeLines.join("\n").trim();
    if (code.length > 10) {
      templates.push({
        id: createId(),
        title,
        description: "Импортировано из файла DAX-кодов.",
        tags: ["import", "dax", "файл"],
        code,
      });
    }

    i = j;
  }

  return templates;
};

const mergeImportedTemplates = (current: DaxTemplate[], imported: DaxTemplate[]): DaxTemplate[] => {
  const existingTitles = new Set(current.map((template) => template.title.trim().toLowerCase()));
  const existingCodes = new Set(current.map((template) => template.code.trim()));
  const prepared: DaxTemplate[] = [];

  for (const template of imported) {
    const normalizedTitle = template.title.trim().toLowerCase();
    const normalizedCode = template.code.trim();

    if (existingCodes.has(normalizedCode)) {
      continue;
    }

    if (existingTitles.has(normalizedTitle)) {
      let counter = 2;
      let nextTitle = `${template.title} (${counter})`;
      while (existingTitles.has(nextTitle.toLowerCase())) {
        counter += 1;
        nextTitle = `${template.title} (${counter})`;
      }
      prepared.push({
        ...template,
        title: nextTitle,
      });
      existingTitles.add(nextTitle.toLowerCase());
      existingCodes.add(normalizedCode);
    } else {
      prepared.push(template);
      existingTitles.add(normalizedTitle);
      existingCodes.add(normalizedCode);
    }
  }

  return [...prepared, ...current];
};

const DaxLibrary = ({ templates, setTemplates }: DaxLibraryProps) => {
  const [search, setSearch] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [formError, setFormError] = React.useState<string>("");
  const [activeTag, setActiveTag] = React.useState<string>("all");
  const importInputRef = React.useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const popularTags = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const template of templates) {
      for (const tag of template.tags) {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      }
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [templates]);

  const filteredTemplates = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    return templates.filter((template) => {
      if (activeTag !== "all" && !template.tags.includes(activeTag)) {
        return false;
      }
      if (!term) {
        return true;
      }
      const bag = [template.title, template.description, template.tags.join(" "), template.code]
        .join(" ")
        .toLowerCase();
      return bag.includes(term);
    });
  }, [templates, search, activeTag]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
  };

  const saveTemplate = () => {
    const title = form.title.trim();
    const code = form.code.trim();
    if (!title || !code) {
      setFormError("Нужны как минимум название и DAX-код.");
      return;
    }

    const payload: Omit<DaxTemplate, "id"> = {
      title,
      description: form.description.trim(),
      tags: normalizeTags(form.tags),
      code,
    };

    if (editingId) {
      setTemplates((current) =>
        current.map((template) => (template.id === editingId ? { ...template, ...payload } : template))
      );
      showToast("Шаблон обновлен");
    } else {
      setTemplates((current) => [{ id: createId(), ...payload }, ...current]);
      showToast("Шаблон добавлен");
    }
    resetForm();
  };

  const editTemplate = (template: DaxTemplate) => {
    setEditingId(template.id);
    setForm({
      title: template.title,
      description: template.description,
      tags: template.tags.join(", "),
      code: template.code,
    });
    setFormError("");
  };

  const removeTemplate = (templateId: string) => {
    setTemplates((current) => current.filter((template) => template.id !== templateId));
    if (editingId === templateId) {
      resetForm();
    }
    showToast("Шаблон удален");
  };

  const copyCode = async (code: string) => {
    const result = await copyToClipboard(code);
    showToast(result.ok ? "DAX скопирован" : result.message ?? "Не удалось скопировать");
  };

  const importFromTextFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseDaxTemplatesFromText(text);
    if (parsed.length === 0) {
      showToast("Не удалось распознать формулы в файле");
      return;
    }

    setTemplates((current) => mergeImportedTemplates(current, parsed));
    showToast(`Импортировано формул: ${parsed.length}`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingId ? "Редактирование DAX-шаблона" : "Новый DAX-шаблон"}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Можно добавить вручную или импортировать из `.txt` файла с мерами.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              ref={importInputRef}
              type="file"
              accept=".txt,.dax,.md"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }
                void importFromTextFile(file);
                event.target.value = "";
              }}
            />
            <Button
              variant="secondary"
              onClick={() => {
                importInputRef.current?.click();
              }}
            >
              <FileUp size={16} />
              Импорт из файла
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            label="Название"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Название шаблона"
          />
          <Input
            label="Теги (через запятую)"
            value={form.tags}
            onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
            placeholder="kpi, ranking, time-intelligence"
          />
        </div>
        <div className="mt-3">
          <Textarea
            label="Описание"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            placeholder="Короткое пояснение"
            rows={2}
          />
        </div>
        <div className="mt-3">
          <Textarea
            label="DAX-код"
            value={form.code}
            onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
            placeholder="Measure = ..."
            rows={8}
            error={formError || undefined}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={saveTemplate}>
            <Plus size={16} />
            {editingId ? "Сохранить изменения" : "Добавить шаблон"}
          </Button>
          {editingId ? (
            <Button variant="secondary" onClick={resetForm}>
              Отменить редактирование
            </Button>
          ) : null}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Шаблоны</h3>
            <p className="text-sm text-slate-600">
              Всего: {templates.length}, показано: {filteredTemplates.length}
            </p>
          </div>
          <div className="relative w-full sm:w-96">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              placeholder="Поиск по названию, описанию, тегам, коду..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag("all")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              activeTag === "all"
                ? "bg-brand-500 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Все
          </button>
          {popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                activeTag === tag
                  ? "bg-brand-500 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600">
            Ничего не найдено.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="max-w-4xl">
                    <h4 className="text-base font-bold text-slate-900">{template.title}</h4>
                    <p className="text-sm text-slate-600">{template.description || "Без описания"}</p>
                    {template.tags.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {template.tags.map((tag) => (
                          <span
                            key={`${template.id}-${tag}`}
                            className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => copyCode(template.code)}>
                      <Copy size={14} />
                      Копировать
                    </Button>
                    <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => editTemplate(template)}>
                      <PencilLine size={14} />
                      Редактировать
                    </Button>
                    <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => removeTemplate(template.id)}>
                      <Trash2 size={14} />
                      Удалить
                    </Button>
                  </div>
                </div>

                <div className="mt-3">
                  <CodeBlock
                    code={template.code}
                    title="DAX"
                    onCopy={() => {
                      void copyCode(template.code);
                    }}
                    maxHeightClassName="max-h-72"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DaxLibrary;
