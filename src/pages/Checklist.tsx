import React from "react";
import { RotateCcw } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import type { ChecklistItem } from "../types";
import { useToast } from "../hooks/useToast";

type ChecklistProps = {
  items: ChecklistItem[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
};

const Checklist = ({ items, setItems }: ChecklistProps) => {
  const { showToast } = useToast();
  const completed = items.filter((item) => item.completed).length;

  const toggleItem = (id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const resetChecklist = () => {
    setItems((current) => current.map((item) => ({ ...item, completed: false })));
    showToast("Чеклист сброшен");
  };

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">Чеклист пуст</p>
        <p className="mt-1 text-sm text-slate-600">Для этого пространства нет пунктов проверки.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold text-slate-900">Прогресс качества</p>
            <p className="text-sm text-slate-600">
              Выполнено {completed} из {items.length}
            </p>
          </div>
          <Button variant="secondary" onClick={resetChecklist}>
            <RotateCcw size={16} />
            Сбросить
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-2">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
              />
              <span className={`text-sm ${item.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                {item.text}
              </span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Checklist;
