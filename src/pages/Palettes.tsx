import React from "react";
import { Plus, Trash2 } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import ColorCard from "../components/ColorCard";
import type { BIColor, Palette } from "../types";
import { copyToClipboard } from "../utils/clipboard";
import { createId } from "../utils/constants";
import { isValidHex, normalizeHex } from "../utils/colorUtils";
import { useToast } from "../hooks/useToast";

type PalettesProps = {
  palettes: Palette[];
  setPalettes: React.Dispatch<React.SetStateAction<Palette[]>>;
};

const buildDefaultColor = (index: number): BIColor => ({
  id: createId(),
  name: `Цвет ${index}`,
  hex: "#1F77B4",
  role: "Primary",
});

const Palettes = ({ palettes, setPalettes }: PalettesProps) => {
  const [newPaletteName, setNewPaletteName] = React.useState("");
  const [activePaletteId, setActivePaletteId] = React.useState(palettes[0]?.id ?? "");
  const [activeColorId, setActiveColorId] = React.useState<string | null>(palettes[0]?.colors[0]?.id ?? null);
  const [draggedColorId, setDraggedColorId] = React.useState<string | null>(null);
  const [dragOverColorId, setDragOverColorId] = React.useState<string | null>(null);
  const dragInProgressRef = React.useRef(false);
  const previousPaletteRef = React.useRef(activePaletteId);
  const { showToast } = useToast();

  React.useEffect(() => {
    if (palettes.length === 0) {
      setActivePaletteId("");
      return;
    }

    const exists = palettes.some((palette) => palette.id === activePaletteId);
    if (!exists) {
      setActivePaletteId(palettes[0].id);
    }
  }, [palettes, activePaletteId]);

  const activePalette = React.useMemo(
    () => palettes.find((palette) => palette.id === activePaletteId) ?? null,
    [palettes, activePaletteId]
  );

  React.useEffect(() => {
    if (!activePalette) {
      setActiveColorId(null);
      return;
    }

    const exists = activePalette.colors.some((color) => color.id === activeColorId);
    if (!exists) {
      setActiveColorId(activePalette.colors[0]?.id ?? null);
    }
  }, [activePalette, activeColorId]);

  const scrollToColorCard = React.useCallback((colorId: string, behavior: ScrollBehavior = "smooth") => {
    const target = document.getElementById(`color-card-${colorId}`);
    if (target) {
      target.scrollIntoView({ behavior, block: "nearest" });
    }
  }, []);

  React.useEffect(() => {
    if (activePaletteId === previousPaletteRef.current) {
      return;
    }
    previousPaletteRef.current = activePaletteId;

    if (!activeColorId) {
      return;
    }
    scrollToColorCard(activeColorId, "auto");
  }, [activePaletteId, activeColorId, scrollToColorCard]);

  React.useEffect(() => {
    setDraggedColorId(null);
    setDragOverColorId(null);
    dragInProgressRef.current = false;
  }, [activePaletteId]);

  const createPalette = () => {
    const name = newPaletteName.trim() || `Палитра ${palettes.length + 1}`;
    const newPalette: Palette = { id: createId(), name, colors: [] };
    setPalettes((current) => [...current, newPalette]);
    setNewPaletteName("");
    setActivePaletteId(newPalette.id);
    setActiveColorId(null);
    showToast("Палитра создана");
  };

  const updatePalette = (paletteId: string, updater: (palette: Palette) => Palette) => {
    setPalettes((current) => current.map((palette) => (palette.id === paletteId ? updater(palette) : palette)));
  };

  const removePalette = (paletteId: string) => {
    setPalettes((current) => current.filter((palette) => palette.id !== paletteId));
    showToast("Палитра удалена");
  };

  const addColor = (paletteId: string) => {
    const palette = palettes.find((item) => item.id === paletteId);
    const nextIndex = (palette?.colors.length ?? 0) + 1;
    const newColor = buildDefaultColor(nextIndex);

    updatePalette(paletteId, (current) => ({
      ...current,
      colors: [...current.colors, newColor],
    }));
    setActiveColorId(newColor.id);
    window.requestAnimationFrame(() => {
      scrollToColorCard(newColor.id);
    });
    showToast("Цвет добавлен и выбран");
  };

  const moveColor = (paletteId: string, sourceColorId: string, targetColorId: string) => {
    if (sourceColorId === targetColorId) {
      return;
    }

    updatePalette(paletteId, (palette) => {
      const fromIndex = palette.colors.findIndex((item) => item.id === sourceColorId);
      const toIndex = palette.colors.findIndex((item) => item.id === targetColorId);
      if (fromIndex < 0 || toIndex < 0) {
        return palette;
      }

      const nextColors = [...palette.colors];
      const [movedColor] = nextColors.splice(fromIndex, 1);
      nextColors.splice(toIndex, 0, movedColor);

      return {
        ...palette,
        colors: nextColors,
      };
    });
    showToast("Порядок цветов обновлен");
  };

  const removeColor = (paletteId: string, colorId: string) => {
    updatePalette(paletteId, (palette) => ({
      ...palette,
      colors: palette.colors.filter((color) => color.id !== colorId),
    }));
    showToast("Цвет удален");
  };

  const updateColor = (paletteId: string, colorId: string, partial: Partial<BIColor>) => {
    updatePalette(paletteId, (palette) => ({
      ...palette,
      colors: palette.colors.map((color) => (color.id === colorId ? { ...color, ...partial } : color)),
    }));
  };

  const handleCopy = async (text: string, successMessage?: string) => {
    const result = await copyToClipboard(text);
    if (result.ok) {
      showToast(successMessage ?? "Скопировано");
      return;
    }
    showToast(result.message ?? "Не удалось скопировать");
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-bold text-slate-900">Новая палитра</h3>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Название палитры (необязательно)"
            value={newPaletteName}
            onChange={(event) => setNewPaletteName(event.target.value)}
          />
          <Button onClick={createPalette} className="sm:min-w-40">
            <Plus size={16} />
            Добавить палитру
          </Button>
        </div>
      </Card>

      {palettes.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-lg font-semibold text-slate-900">Палитр пока нет</p>
          <p className="mt-1 text-sm text-slate-600">Создайте первую палитру, чтобы работать с цветами.</p>
        </Card>
      ) : (
        <>
          <Card className="p-3">
            <div className="overflow-x-auto">
              <div className="flex w-max gap-2">
                {palettes.map((palette) => {
                  const active = palette.id === activePaletteId;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setActivePaletteId(palette.id)}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-brand-300 bg-brand-50 text-brand-700"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {palette.name} ({palette.colors.length})
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {activePalette ? (
            <Card className="p-4 md:p-5">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end">
                <Input
                  label="Название палитры"
                  value={activePalette.name}
                  onChange={(event) =>
                    updatePalette(activePalette.id, (current) => ({ ...current, name: event.target.value }))
                  }
                />
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => addColor(activePalette.id)}>
                    <Plus size={16} />
                    Добавить цвет
                  </Button>
                  <Button variant="danger" onClick={() => removePalette(activePalette.id)}>
                    <Trash2 size={16} />
                    Удалить палитру
                  </Button>
                </div>
              </div>

              {activePalette.colors.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-600">
                  В палитре пока нет цветов.
                </div>
              ) : (
                <>
                  <p className="mt-3 text-xs text-slate-500">
                    Перетаскивайте цветные квадраты, чтобы менять порядок цветов в палитре.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activePalette.colors.map((color) => {
                      const validHex = isValidHex(color.hex);
                      const previewHex = validHex ? normalizeHex(color.hex) : "#ffffff";
                      const isCurrent = color.id === activeColorId;
                      const isDropTarget = dragOverColorId === color.id && draggedColorId !== color.id;
                      const isDragged = draggedColorId === color.id;

                      return (
                        <button
                          key={`swatch-${color.id}`}
                          type="button"
                          title={`${color.name}: ${color.hex}`}
                          onClick={() => {
                            if (!dragInProgressRef.current) {
                              setActiveColorId(color.id);
                            }
                          }}
                          draggable
                          onDragStart={(event) => {
                            dragInProgressRef.current = true;
                            setDraggedColorId(color.id);
                            setDragOverColorId(color.id);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", color.id);
                          }}
                          onDragEnd={() => {
                            setDraggedColorId(null);
                            setDragOverColorId(null);
                            window.setTimeout(() => {
                              dragInProgressRef.current = false;
                            }, 0);
                          }}
                          onDragEnter={(event) => {
                            event.preventDefault();
                            setDragOverColorId(color.id);
                          }}
                          onDragOver={(event) => {
                            event.preventDefault();
                            event.dataTransfer.dropEffect = "move";
                          }}
                          onDrop={(event) => {
                            event.preventDefault();
                            const sourceColorId = draggedColorId ?? event.dataTransfer.getData("text/plain");
                            if (!sourceColorId) {
                              return;
                            }
                            moveColor(activePalette.id, sourceColorId, color.id);
                            setDraggedColorId(null);
                            setDragOverColorId(null);
                            dragInProgressRef.current = false;
                          }}
                          className={`h-8 w-8 rounded-md border-2 transition ${
                            isDropTarget
                              ? "scale-110 border-brand-400 ring-2 ring-brand-100"
                              : isCurrent
                                ? "border-brand-500 ring-2 ring-brand-100"
                                : "border-slate-200"
                          } ${isDragged ? "opacity-60" : "opacity-100"}`}
                          style={{ backgroundColor: previewHex }}
                          aria-label={`Выбрать цвет ${color.name}`}
                        />
                      );
                    })}
                  </div>

                  <div className="mt-4 space-y-2">
                    {activePalette.colors.map((color) => (
                      <ColorCard
                        key={color.id}
                        color={color}
                        isActive={color.id === activeColorId}
                        onSelect={() => setActiveColorId(color.id)}
                        onChangeName={(name) => updateColor(activePalette.id, color.id, { name })}
                        onChangeRole={(role) => updateColor(activePalette.id, color.id, { role })}
                        onChangeHex={(hex) => {
                          const value = hex.trim();
                          if (value === "") {
                            updateColor(activePalette.id, color.id, { hex: "" });
                            return;
                          }
                          updateColor(activePalette.id, color.id, {
                            hex: isValidHex(value) ? normalizeHex(value) : value.toUpperCase(),
                          });
                        }}
                        onDelete={() => removeColor(activePalette.id, color.id)}
                        onNotify={showToast}
                        onCopy={handleCopy}
                      />
                    ))}
                  </div>
                </>
              )}
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
};

export default Palettes;
