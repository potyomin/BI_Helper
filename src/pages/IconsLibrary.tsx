import React from "react";
import { Copy, ImagePlus, Plus, Trash2, X } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import type { SymbolItem } from "../types";
import { copyImageDataUrlToClipboard, copyToClipboard } from "../utils/clipboard";
import { createId } from "../utils/constants";
import { useToast } from "../hooks/useToast";

type IconsLibraryProps = {
  items: SymbolItem[];
  setItems: React.Dispatch<React.SetStateAction<SymbolItem[]>>;
};

const IconsLibrary = ({ items, setItems }: IconsLibraryProps) => {
  const [symbol, setSymbol] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [imageDataUrl, setImageDataUrl] = React.useState<string | undefined>(undefined);
  const [imageMimeType, setImageMimeType] = React.useState<string | undefined>(undefined);
  const [search, setSearch] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const filteredItems = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return items;
    }
    return items.filter((item) =>
      [item.symbol, item.label, item.category ?? "", item.imageDataUrl ? "image" : "text"]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [items, search]);

  const copyItem = async (item: SymbolItem) => {
    if (item.imageDataUrl) {
      const result = await copyImageDataUrlToClipboard(item.imageDataUrl);
      showToast(result.ok ? "Изображение скопировано" : result.message ?? "Не удалось скопировать изображение");
      return;
    }

    const result = await copyToClipboard(item.symbol);
    showToast(result.ok ? "Скопировано" : result.message ?? "Не удалось скопировать");
  };

  const addItem = () => {
    const normalizedSymbol = symbol.trim();
    const normalizedLabel = label.trim();
    if (!normalizedLabel) {
      showToast("Введите название");
      return;
    }
    if (!normalizedSymbol && !imageDataUrl) {
      showToast("Введите символ или загрузите изображение");
      return;
    }

    setItems((current) => [
      {
        id: createId(),
        symbol: normalizedSymbol || "[image]",
        label: normalizedLabel,
        category: category.trim() || "Пользовательские",
        imageDataUrl,
        mimeType: imageMimeType,
      },
      ...current,
    ]);
    setSymbol("");
    setLabel("");
    setCategory("");
    setImageDataUrl(undefined);
    setImageMimeType(undefined);
    showToast("Элемент добавлен");
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    showToast("Элемент удален");
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(typeof reader.result === "string" ? reader.result : undefined);
      setImageMimeType(file.type || "image/svg+xml");
      showToast("Изображение загружено");
    };
    reader.onerror = () => {
      showToast("Не удалось прочитать файл");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <h3 className="text-lg font-bold text-slate-900">Добавить символ или мини-иконку</h3>
        <p className="mt-1 text-sm text-slate-600">
          Можно добавить unicode-символ или загрузить SVG/PNG/JPG/WEBP. Кнопка копирования работает для обоих вариантов.
        </p>

        <div className="mt-3 grid gap-2 md:grid-cols-[120px_1fr_1fr_auto]">
          <Input
            label="Символ"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            placeholder="▲"
            maxLength={6}
          />
          <Input
            label="Название"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Рост"
          />
          <Input
            label="Категория"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Тренд / Статус / KPI"
          />
          <Button className="self-end" onClick={addItem}>
            <Plus size={16} />
            Добавить
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/svg+xml,image/png,image/jpeg,image/webp"
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
            Загрузить SVG/PNG
          </Button>
          {imageDataUrl ? (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                <img src={imageDataUrl} alt="Предпросмотр" className="h-8 w-8 rounded object-contain" />
                <span className="text-xs text-slate-600">Файл загружен</span>
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setImageDataUrl(undefined);
                  setImageMimeType(undefined);
                }}
              >
                <X size={16} />
                Убрать файл
              </Button>
            </>
          ) : null}
        </div>
      </Card>

      <Card className="p-4">
        <Input
          label="Поиск"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск по названию, категории и символу..."
        />
      </Card>

      {filteredItems.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Ничего не найдено</p>
          <p className="mt-1 text-sm text-slate-600">Добавьте новый элемент или измените запрос поиска.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-4">
              {item.imageDataUrl ? (
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-slate-200 bg-white">
                  <img src={item.imageDataUrl} alt={item.label} className="h-10 w-10 object-contain" />
                </div>
              ) : (
                <p className="text-4xl font-extrabold text-slate-900">{item.symbol}</p>
              )}
              <p className="mt-2 text-sm font-semibold text-slate-700">{item.label}</p>
              <p className="mt-1 text-xs text-slate-500">{item.category ?? "Без категории"}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" className="w-full" onClick={() => copyItem(item)}>
                  <Copy size={16} />
                  {item.imageDataUrl ? "Копировать SVG/изобр." : "Копировать"}
                </Button>
                <Button variant="danger" className="px-3" onClick={() => removeItem(item.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconsLibrary;
