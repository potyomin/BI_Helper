import React from "react";
import { Copy, Pipette, Trash2 } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import type { BIColor, ColorRole } from "../types";
import { COLOR_ROLE_LABELS, COLOR_ROLES } from "../utils/constants";
import { formatHsl, formatRgb, hexToHsl, hexToRgb, isValidHex, normalizeHex } from "../utils/colorUtils";

type EyeDropperCtor = new () => {
  open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>;
};

const ROLE_OPTIONS = COLOR_ROLES.map((role) => ({
  value: role,
  label: COLOR_ROLE_LABELS[role],
}));

type ColorCardProps = {
  color: BIColor;
  isActive?: boolean;
  onSelect?: () => void;
  onChangeName: (name: string) => void;
  onChangeRole: (role: ColorRole) => void;
  onChangeHex: (hex: string) => void;
  onDelete: () => void;
  onNotify: (message: string) => void;
  onCopy: (value: string, successMessage?: string) => void;
};

const ColorCard = ({
  color,
  isActive = false,
  onSelect,
  onChangeName,
  onChangeRole,
  onChangeHex,
  onDelete,
  onNotify,
  onCopy,
}: ColorCardProps) => {
  const abortRef = React.useRef<AbortController | null>(null);
  const [isPicking, setIsPicking] = React.useState(false);
  const validHex = isValidHex(color.hex);
  const normalizedHex = validHex ? normalizeHex(color.hex) : color.hex.toUpperCase();
  const rgb = validHex ? hexToRgb(normalizedHex) : null;
  const hsl = validHex ? hexToHsl(normalizedHex) : null;
  const rgbValue = rgb ? formatRgb(rgb) : "";
  const hslValue = hsl ? formatHsl(hsl) : "";
  const eyeDropperSupported = typeof window !== "undefined" && "EyeDropper" in window;

  const copyItems = [
    { label: "HEX", value: normalizedHex, toast: "Скопирован HEX" },
    { label: "RGB", value: rgbValue, toast: "Скопирован RGB" },
    { label: "HSL", value: hslValue, toast: "Скопирован HSL" },
    { label: "DAX-строка", value: `"${normalizedHex}"`, toast: "Скопирована DAX-строка" },
    { label: "JSON-значение", value: `"${normalizedHex}"`, toast: "Скопировано JSON-значение" },
  ];

  React.useEffect(
    () => () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    },
    []
  );

  const openEyeDropper = async () => {
    const Ctor = (window as Window & { EyeDropper?: EyeDropperCtor }).EyeDropper;

    if (!Ctor) {
      onNotify("Пипетка не поддерживается в этом браузере");
      return;
    }

    if (isPicking && abortRef.current) {
      abortRef.current.abort();
      return;
    }

    const abortController = new AbortController();
    abortRef.current = abortController;

    const handleRightClickCancel = (event: MouseEvent) => {
      if (event.button === 2) {
        event.preventDefault();
        abortController.abort();
      }
    };

    const handleContextMenuCancel = (event: MouseEvent) => {
      event.preventDefault();
      abortController.abort();
    };

    window.addEventListener("mousedown", handleRightClickCancel, true);
    window.addEventListener("contextmenu", handleContextMenuCancel, true);
    setIsPicking(true);

    try {
      const result = await new Ctor().open({ signal: abortController.signal });
      onChangeHex(result.sRGBHex);
      onNotify("Цвет выбран пипеткой");
    } catch (error) {
      const domError = error as DOMException;
      if (domError.name === "AbortError") {
        onNotify("Пипетка отменена");
      } else {
        onNotify("Не удалось выбрать цвет пипеткой");
      }
    } finally {
      window.removeEventListener("mousedown", handleRightClickCancel, true);
      window.removeEventListener("contextmenu", handleContextMenuCancel, true);
      abortRef.current = null;
      setIsPicking(false);
    }
  };

  return (
    <div
      id={`color-card-${color.id}`}
      className={`rounded-xl border bg-slate-50 p-3 transition ${isActive ? "border-brand-300 ring-2 ring-brand-100" : "border-slate-200"}`}
      onClick={onSelect}
    >
      <div className="grid gap-3 xl:grid-cols-[auto_1fr_190px_220px_auto] xl:items-end">
        <div className="flex items-center gap-2">
          <div
            className={`h-12 w-12 shrink-0 rounded-lg border ${validHex ? "border-slate-200" : "border-rose-300"}`}
            style={{ backgroundColor: validHex ? normalizedHex : "#ffffff" }}
            title={validHex ? normalizedHex : "Невалидный HEX"}
          />
          <input
            type="color"
            value={validHex ? normalizedHex : "#1F77B4"}
            onChange={(event) => onChangeHex(event.target.value)}
            className="h-10 w-10 cursor-pointer rounded-md border border-slate-200 bg-white p-1"
            aria-label="Выбор цвета"
          />
        </div>

        <Input
          label="Название"
          value={color.name}
          onChange={(event) => onChangeName(event.target.value)}
          placeholder="Название цвета"
        />

        <label className="block text-sm">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Роль</span>
          <Select value={color.role} onChange={onChangeRole} options={ROLE_OPTIONS} />
        </label>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Input
            label="HEX"
            value={color.hex}
            onChange={(event) => onChangeHex(event.target.value)}
            placeholder="#1F77B4"
            error={validHex || color.hex.trim() === "" ? undefined : "Введите валидный HEX"}
          />
          <Button
            variant="secondary"
            className="h-10 self-end px-3"
            onClick={() => {
              void openEyeDropper();
            }}
            title={
              isPicking
                ? "Остановить пипетку"
                : "Выбрать цвет с экрана (левая кнопка: выбрать, правая: отмена)"
            }
            disabled={!eyeDropperSupported}
          >
            <Pipette size={15} />
            {isPicking ? "Отмена" : "Пипетка"}
          </Button>
        </div>

        <Button variant="danger" className="h-10 self-end px-3" onClick={onDelete}>
          <Trash2 size={14} />
          Удалить
        </Button>
      </div>

      {eyeDropperSupported ? (
        <p className="mt-2 text-xs text-slate-500">
          Пипетка: левая кнопка мыши выбирает цвет, правая отменяет выбор. Также можно нажать Esc.
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-1.5">
        {copyItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!validHex || item.value.trim() === ""}
            onClick={() => onCopy(item.value, item.toast)}
          >
            <Copy size={12} />
            <span className="font-semibold">{item.label}:</span>
            <span>{item.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorCard;
