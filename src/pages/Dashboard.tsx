import { CheckCircle2, Palette, Sigma, SwatchBook } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import type { ChecklistItem, DaxTemplate, Palette as PaletteType } from "../types";

type DashboardProps = {
  palettes: PaletteType[];
  daxTemplates: DaxTemplate[];
  checklistItems: ChecklistItem[];
};

const Dashboard = ({ palettes, daxTemplates, checklistItems }: DashboardProps) => {
  const colorsCount = palettes.reduce((sum, palette) => sum + palette.colors.length, 0);
  const completedChecklist = checklistItems.filter((item) => item.completed).length;

  const stats = [
    {
      label: "Палитры",
      value: palettes.length,
      icon: SwatchBook,
      accent: "text-brand-700 bg-brand-50",
    },
    {
      label: "Цвета",
      value: colorsCount,
      icon: Palette,
      accent: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "DAX-шаблоны",
      value: daxTemplates.length,
      icon: Sigma,
      accent: "text-amber-700 bg-amber-50",
    },
    {
      label: "Чеклист",
      value: `${completedChecklist}/${checklistItems.length}`,
      icon: CheckCircle2,
      accent: "text-sky-700 bg-sky-50",
    },
  ];

  const quickLinks = [
    { to: "/palettes", label: "Палитры", hint: "Создавайте и управляйте наборами цветов BI." },
    { to: "/theme-generator", label: "Генератор темы", hint: "Собирайте и экспортируйте JSON-тему Power BI." },
    { to: "/dax-library", label: "DAX-библиотека", hint: "Храните готовые меры и полезные фрагменты." },
    { to: "/icons-symbols", label: "Иконки и символы", hint: "Быстро копируйте символы для визуалов." },
    { to: "/visual-ideas", label: "Идеи визуализаций", hint: "Смотрите примеры графиков и храните референсы." },
    { to: "/checklist", label: "Чеклист", hint: "Проверьте качество дашборда перед публикацией." },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-2 ${stat.accent}`}>
                  <Icon size={20} />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <Card className="p-4 md:p-5">
        <h3 className="text-lg font-bold text-slate-900">Быстрые действия</h3>
        <p className="mt-1 text-sm text-slate-600">Переход к основным инструментам BI Helper.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-brand-200 hover:bg-brand-50/40"
            >
              <p className="font-semibold text-slate-900 group-hover:text-brand-700">{link.label}</p>
              <p className="mt-1 text-sm text-slate-600">{link.hint}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
