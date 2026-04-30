import { Braces, ChartNoAxesColumnIncreasing, CheckSquare, LayoutDashboard, Palette, Sigma, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Дашборд", icon: LayoutDashboard },
  { to: "/palettes", label: "Палитры", icon: Palette },
  { to: "/theme-generator", label: "Генератор темы", icon: Braces },
  { to: "/dax-library", label: "DAX-библиотека", icon: Sigma },
  { to: "/icons-symbols", label: "Иконки и символы", icon: Sparkles },
  { to: "/visual-ideas", label: "Идеи визуализаций", icon: ChartNoAxesColumnIncreasing },
  { to: "/checklist", label: "Чеклист", icon: CheckSquare },
];

const Sidebar = () => (
  <aside className="w-full border-b border-slate-200 bg-white/95 backdrop-blur md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
    <div className="border-b border-slate-200 px-4 py-4 md:px-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Инструменты Power BI</p>
      <h1 className="text-lg font-extrabold text-slate-900">BI Helper</h1>
    </div>

    <nav className="flex gap-2 overflow-x-auto px-3 py-3 md:flex-col md:overflow-visible md:px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition whitespace-nowrap ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
            end={item.to === "/"}
          >
            <Icon size={16} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  </aside>
);

export default Sidebar;
