import { Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const pageMeta: Array<{
  matcher: (path: string) => boolean;
  title: string;
  description: string;
}> = [
  {
    matcher: (path) => path === "/",
    title: "Дашборд",
    description: "Обзор палитр, DAX-шаблонов и статуса качества BI-дашборда.",
  },
  {
    matcher: (path) => path.startsWith("/palettes"),
    title: "Палитры",
    description: "Управляйте BI-палитрами и копируйте цвета в нужных форматах.",
  },
  {
    matcher: (path) => path.startsWith("/theme-generator"),
    title: "Генератор темы",
    description: "Генерируйте JSON-тему Power BI из сохраненных палитр.",
  },
  {
    matcher: (path) => path.startsWith("/dax-library"),
    title: "DAX-библиотека",
    description: "Храните, ищите и переиспользуйте DAX-шаблоны.",
  },
  {
    matcher: (path) => path.startsWith("/icons-symbols"),
    title: "Иконки и символы",
    description: "Быстро копируйте символы для KPI и условного форматирования.",
  },
  {
    matcher: (path) => path.startsWith("/checklist"),
    title: "Чеклист дашборда",
    description: "Проверяйте качество BI-дашборда перед публикацией.",
  },
  {
    matcher: (path) => path.startsWith("/visual-ideas"),
    title: "Идеи визуализаций",
    description: "Галерея графиков для вдохновения и хранения референсов.",
  },
];

const Header = () => {
  const { pathname } = useLocation();
  const current = pageMeta.find((item) => item.matcher(pathname)) ?? pageMeta[0];
  const { mode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">BI Helper</p>
          <h2 className="text-xl font-extrabold text-slate-900">{current.title}</h2>
          <p className="text-sm text-slate-600">{current.description}</p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          title={mode === "dark" ? "Переключить на светлую тему" : "Переключить на темную тему"}
        >
          {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {mode === "dark" ? "День" : "Ночь"}
        </button>
      </div>
    </header>
  );
};

export default Header;
