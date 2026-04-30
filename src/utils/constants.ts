import type { ChecklistItem, ColorRole, DaxTemplate, Palette, SymbolItem, VisualIdea } from "../types";

export const STORAGE_KEYS = {
  palettes: "bi-helper-palettes",
  daxTemplates: "bi-helper-dax-templates",
  checklist: "bi-helper-checklist",
  symbols: "bi-helper-symbols",
  visualIdeas: "bi-helper-visual-ideas",
  themeMode: "bi-helper-theme-mode",
} as const;

export const COLOR_ROLES: ColorRole[] = [
  "Primary",
  "Secondary",
  "Accent",
  "Background",
  "Text",
  "Success",
  "Warning",
  "Error",
  "Neutral",
];

export const COLOR_ROLE_LABELS: Record<ColorRole, string> = {
  Primary: "Основной",
  Secondary: "Дополнительный",
  Accent: "Акцент",
  Background: "Фон",
  Text: "Текст",
  Success: "Успех",
  Warning: "Предупреждение",
  Error: "Ошибка",
  Neutral: "Нейтральный",
};

export const createId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
};

export const DEFAULT_PALETTES: Palette[] = [
  {
    id: "palette-default-bi",
    name: "Базовая BI-палитра",
    colors: [
      { id: "color-primary", name: "Синий основной", hex: "#1F77B4", role: "Primary" },
      { id: "color-secondary", name: "Оранжевый дополнительный", hex: "#FF7F0E", role: "Secondary" },
      { id: "color-accent", name: "Зеленый акцент", hex: "#2CA02C", role: "Accent" },
      { id: "color-background", name: "Фон", hex: "#FFFFFF", role: "Background" },
      { id: "color-text", name: "Текст", hex: "#252423", role: "Text" },
      { id: "color-warning", name: "Предупреждение", hex: "#FFBF00", role: "Warning" },
      { id: "color-error", name: "Ошибка", hex: "#D62728", role: "Error" },
    ],
  },
];

const CORE_DAX_TEMPLATES: DaxTemplate[] = [
  {
    id: "dax-dynamic-title",
    title: "Динамический заголовок",
    description: "Формирует динамический заголовок отчета по выбранному году.",
    tags: ["title", "selectedvalue", "dynamic"],
    code: `Dynamic Title =
"Sales Report - " & SELECTEDVALUE('Calendar'[Year], "All Years")`,
  },
  {
    id: "dax-selected-region",
    title: "Выбранный регион",
    description: "Возвращает выбранный регион или значение по умолчанию.",
    tags: ["region", "selectedvalue", "filter"],
    code: `Selected Region =
SELECTEDVALUE('Region'[Region Name], "All Regions")`,
  },
  {
    id: "dax-kpi-color",
    title: "Цвет KPI",
    description: "Условный цвет KPI по пороговым значениям.",
    tags: ["kpi", "switch", "color"],
    code: `KPI Color =
SWITCH(
    TRUE(),
    [KPI Value] >= 0.9, "#2CA02C",
    [KPI Value] >= 0.7, "#FFBF00",
    "#D62728"
)`,
  },
  {
    id: "dax-sales-yoy",
    title: "Продажи год-к-году %",
    description: "Год-к-году для продаж в процентах.",
    tags: ["sales", "yoy", "divide"],
    code: `Sales YoY % =
DIVIDE(
    [Sales] - [Sales LY],
    [Sales LY]
)`,
  },
  {
    id: "dax-rank-by-value",
    title: "Ранг по значению",
    description: "Ранжирует категории по выбранной метрике по убыванию.",
    tags: ["rank", "ranking", "rankx"],
    code: `Rank by Value =
RANKX(
    ALLSELECTED('Table'[Category]),
    [Total Value],
    ,
    DESC
)`,
  },
];

const POPULAR_DAX_TEMPLATES: DaxTemplate[] = [
  {
    id: "dax-total-sales",
    title: "Сумма продаж",
    description: "Базовая мера суммы продаж.",
    tags: ["sales", "sum", "base"],
    code: `Total Sales =
SUM(FactSales[SalesAmount])`,
  },
  {
    id: "dax-sales-ly",
    title: "Продажи за прошлый год",
    description: "Продажи за тот же период прошлого года.",
    tags: ["sales", "time-intelligence", "ly"],
    code: `Sales LY =
CALCULATE(
    [Total Sales],
    SAMEPERIODLASTYEAR('Calendar'[Date])
)`,
  },
  {
    id: "dax-sales-ytd",
    title: "Продажи YTD",
    description: "Накопительные продажи с начала года.",
    tags: ["sales", "ytd", "time-intelligence"],
    code: `Sales YTD =
TOTALYTD(
    [Total Sales],
    'Calendar'[Date]
)`,
  },
  {
    id: "dax-sales-mtd",
    title: "Продажи MTD",
    description: "Накопительные продажи с начала месяца.",
    tags: ["sales", "mtd", "time-intelligence"],
    code: `Sales MTD =
TOTALMTD(
    [Total Sales],
    'Calendar'[Date]
)`,
  },
  {
    id: "dax-running-total",
    title: "Накопительный итог",
    description: "Running total по выбранной дате.",
    tags: ["running-total", "cumulative", "date"],
    code: `Running Total Sales =
CALCULATE(
    [Total Sales],
    FILTER(
        ALLSELECTED('Calendar'[Date]),
        'Calendar'[Date] <= MAX('Calendar'[Date])
    )
)`,
  },
  {
    id: "dax-distinct-customers",
    title: "Уникальные клиенты",
    description: "Количество уникальных клиентов.",
    tags: ["customer", "distinctcount"],
    code: `Distinct Customers =
DISTINCTCOUNT(FactSales[CustomerID])`,
  },
  {
    id: "dax-average-check",
    title: "Средний чек",
    description: "Средний чек на заказ.",
    tags: ["average", "orders"],
    code: `Average Order Value =
DIVIDE(
    [Total Sales],
    [Orders Count]
)`,
  },
  {
    id: "dax-percent-of-total",
    title: "Доля от итога",
    description: "Доля показателя от общего итога в текущем контексте.",
    tags: ["share", "percent", "total"],
    code: `Share of Total =
DIVIDE(
    [Total Sales],
    CALCULATE([Total Sales], REMOVEFILTERS())
)`,
  },
  {
    id: "dax-topn-flag",
    title: "Флаг Top N",
    description: "Возвращает 1 для элементов из Top N по выбранной мере.",
    tags: ["topn", "filter", "rankx"],
    code: `Top N Flag =
VAR N = 10
VAR RankValue =
    RANKX(
        ALLSELECTED('DimProduct'[ProductName]),
        [Total Sales],
        ,
        DESC
    )
RETURN
    IF(RankValue <= N, 1, 0)`,
  },
  {
    id: "dax-kpi-trend-icon",
    title: "Иконка тренда KPI",
    description: "Выводит символ роста/падения/стабильности.",
    tags: ["kpi", "icon", "trend"],
    code: `KPI Trend Icon =
SWITCH(
    TRUE(),
    [KPI Delta %] > 0, "▲",
    [KPI Delta %] < 0, "▼",
    "●"
)`,
  },
  {
    id: "dax-dynamic-format-km",
    title: "Формат K/M",
    description: "Форматирует числа в тысячах/миллионах.",
    tags: ["format", "kpi", "display"],
    code: `Value Format K/M =
VAR V = [Total Sales]
RETURN
SWITCH(
    TRUE(),
    ABS(V) >= 1000000, FORMAT(V / 1000000, "0.0") & "M",
    ABS(V) >= 1000, FORMAT(V / 1000, "0.0") & "K",
    FORMAT(V, "#,##0")
)`,
  },
];

const HH_DAX_TEMPLATES: DaxTemplate[] = [
  {
    id: "hh-vacancies-count",
    title: "Кол-во вакансий",
    description: "Из файла BI_Helper_DAX_codes: базовая мера вакансий.",
    tags: ["hh", "vacancies", "base"],
    code: `Кол-во вакансий =
DISTINCTCOUNT(Facts[id])`,
  },
  {
    id: "hh-companies-count",
    title: "Кол-во компаний",
    description: "Количество компаний в текущем контексте.",
    tags: ["hh", "company", "base"],
    code: `Кол-во компаний =
DISTINCTCOUNT(Facts[company])`,
  },
  {
    id: "hh-salary-filled-percent",
    title: "% вакансий с указанной ЗП",
    description: "Процент вакансий, где указана зарплата.",
    tags: ["hh", "salary", "percent"],
    code: `% вакансий с указанной ЗП =
DIVIDE(
    [Вакансий с указанной ЗП],
    [Кол-во вакансий]
)`,
  },
  {
    id: "hh-market-share-company",
    title: "Доля рынка компании",
    description: "Доля компании по количеству вакансий.",
    tags: ["hh", "market-share", "company"],
    code: `Доля рынка компании =
DIVIDE(
    [Кол-во вакансий],
    CALCULATE(
        [Кол-во вакансий],
        REMOVEFILTERS(Facts[company])
    )
)`,
  },
  {
    id: "hh-median-salary-market",
    title: "Медианная ЗП рынка",
    description: "Медианная зарплата по рынку без фильтра компании.",
    tags: ["hh", "median", "salary"],
    code: `Медианная ЗП рынка =
CALCULATE(
    [Медианная ЗП, руб.],
    REMOVEFILTERS(Facts[company])
)`,
  },
  {
    id: "hh-company-rank-vacancies",
    title: "Ранг компании по вакансиям",
    description: "Ранг компании по числу вакансий в видимом контексте.",
    tags: ["hh", "rank", "company"],
    code: `Ранг компании по вакансиям =
RANKX(
    ALLSELECTED(Facts[company]),
    [Кол-во вакансий],
    ,
    DESC,
    DENSE
)`,
  },
  {
    id: "hh-tooltip-region-title",
    title: "Заголовок региона tooltip",
    description: "Текст заголовка для регионального tooltip.",
    tags: ["hh", "tooltip", "region"],
    code: `Заголовок региона tooltip =
SELECTEDVALUE(
    DimCities[region_name],
    "Регион"
)`,
  },
  {
    id: "hh-region-market-share",
    title: "Доля рынка региона",
    description: "Доля региона по вакансиям.",
    tags: ["hh", "region", "market-share"],
    code: `Доля рынка региона =
DIVIDE(
    [Кол-во вакансий],
    CALCULATE(
        [Кол-во вакансий],
        REMOVEFILTERS(DimCities[region_name])
    )
)`,
  },
  {
    id: "hh-vacancies-prev-period",
    title: "Кол-во вакансий пред. период",
    description: "Вакансии за предыдущий период той же длины.",
    tags: ["hh", "period", "previous"],
    code: `Кол-во вакансий пред. период =
VAR StartDate =
    MINX(
        ALLSELECTED(Facts[published]),
        Facts[published]
    )
VAR EndDate =
    MAXX(
        ALLSELECTED(Facts[published]),
        Facts[published]
    )
VAR DaysInPeriod =
    DATEDIFF(StartDate, EndDate, DAY) + 1
VAR PrevStart = StartDate - DaysInPeriod
VAR PrevEnd = StartDate - 1
RETURN
    CALCULATE(
        [Кол-во вакансий],
        REMOVEFILTERS(Facts[published]),
        Facts[published] >= PrevStart,
        Facts[published] <= PrevEnd
    )`,
  },
  {
    id: "hh-vacancies-delta-percent",
    title: "Динамика вакансий %",
    description: "Изменение вакансий к предыдущему периоду.",
    tags: ["hh", "delta", "period"],
    code: `Динамика вакансий % =
DIVIDE(
    [Кол-во вакансий] - [Кол-во вакансий пред. период],
    [Кол-во вакансий пред. период]
)`,
  },
];

export const DEFAULT_DAX_TEMPLATES: DaxTemplate[] = [
  ...CORE_DAX_TEMPLATES,
  ...POPULAR_DAX_TEMPLATES,
  ...HH_DAX_TEMPLATES,
];

export const DEFAULT_SYMBOLS: SymbolItem[] = [
  { id: "sym-up", symbol: "▲", label: "Рост", category: "Тренд" },
  { id: "sym-down", symbol: "▼", label: "Падение", category: "Тренд" },
  { id: "sym-stable", symbol: "●", label: "Стабильно", category: "Тренд" },
  { id: "sym-up-right", symbol: "↗", label: "Рост вправо", category: "Тренд" },
  { id: "sym-down-right", symbol: "↘", label: "Падение вправо", category: "Тренд" },
  { id: "sym-flat-right", symbol: "→", label: "Без изменений", category: "Тренд" },
  { id: "sym-success", symbol: "✓", label: "Успех", category: "Статус" },
  { id: "sym-error", symbol: "✕", label: "Ошибка", category: "Статус" },
  { id: "sym-warning", symbol: "⚠", label: "Предупреждение", category: "Статус" },
  { id: "sym-info", symbol: "ℹ", label: "Инфо", category: "Статус" },
  { id: "sym-check-box", symbol: "☑", label: "Выполнено", category: "Статус" },
  { id: "sym-box-empty", symbol: "☐", label: "Не выполнено", category: "Статус" },
  { id: "sym-star", symbol: "★", label: "Избранное", category: "Навигация" },
  { id: "sym-star-empty", symbol: "☆", label: "Пустая звезда", category: "Навигация" },
  { id: "sym-bullet", symbol: "•", label: "Маркер", category: "Навигация" },
  { id: "sym-square", symbol: "■", label: "Квадрат", category: "Навигация" },
  { id: "sym-diamond", symbol: "◆", label: "Ромб", category: "Навигация" },
  { id: "sym-right-arrow", symbol: "→", label: "Стрелка вправо", category: "Стрелки" },
  { id: "sym-left-arrow", symbol: "←", label: "Стрелка влево", category: "Стрелки" },
  { id: "sym-up-arrow", symbol: "↑", label: "Стрелка вверх", category: "Стрелки" },
  { id: "sym-down-arrow", symbol: "↓", label: "Стрелка вниз", category: "Стрелки" },
  { id: "sym-double-right", symbol: "»", label: "Двойная вправо", category: "Стрелки" },
  { id: "sym-double-left", symbol: "«", label: "Двойная влево", category: "Стрелки" },
  { id: "sym-circle-fill", symbol: "●", label: "Круг заливка", category: "Фигуры" },
  { id: "sym-circle-empty", symbol: "○", label: "Круг контур", category: "Фигуры" },
  { id: "sym-triangle-fill", symbol: "▲", label: "Треугольник", category: "Фигуры" },
  { id: "sym-square-empty", symbol: "□", label: "Квадрат контур", category: "Фигуры" },
  { id: "sym-dot-small", symbol: "·", label: "Точка", category: "Фигуры" },
];

export const DEFAULT_VISUAL_IDEAS: VisualIdea[] = [
  {
    id: "visual-column-topn",
    title: "Top N компании (столбцы)",
    description: "Показывает лидеров по количеству вакансий или продаж.",
    type: "column",
    tags: ["TopN", "Сравнение", "Рейтинг"],
    favorite: false,
  },
  {
    id: "visual-line-trend",
    title: "Тренд по датам (линия)",
    description: "Динамика KPI по дням/неделям/месяцам.",
    type: "line",
    tags: ["Тренд", "Время", "KPI"],
    favorite: false,
  },
  {
    id: "visual-area-trend",
    title: "Area-тренд с накоплением",
    description: "Показывает изменение структуры и общего объема по времени.",
    type: "area",
    tags: ["Area", "Время", "Структура"],
    favorite: false,
  },
  {
    id: "visual-bar-comparison",
    title: "Горизонтальные бары по категориям",
    description: "Удобно для длинных названий категорий и ранжирования.",
    type: "bar",
    tags: ["Bar", "Сравнение", "Категории"],
    favorite: false,
  },
  {
    id: "visual-histogram-distribution",
    title: "Гистограмма распределения",
    description: "Распределение зарплат, чеков, длительности, скоринга и т.д.",
    type: "histogram",
    tags: ["Histogram", "Distribution", "Статистика"],
    favorite: false,
  },
  {
    id: "visual-boxplot-spread",
    title: "Boxplot по сегментам",
    description: "Медиана, квартильный размах и выбросы по группам.",
    type: "boxplot",
    tags: ["Boxplot", "Median", "Outliers"],
    favorite: false,
  },
  {
    id: "visual-combo-target",
    title: "Факт vs План (комбо)",
    description: "Столбцы для факта + линия для плана/цели.",
    type: "combo",
    tags: ["План-факт", "KPI", "Цель"],
    favorite: false,
  },
  {
    id: "visual-funnel-conversion",
    title: "Воронка конверсии",
    description: "Шаги процесса и потери между этапами.",
    type: "funnel",
    tags: ["Воронка", "Conversion", "Этапы"],
    favorite: false,
  },
  {
    id: "visual-waterfall-delta",
    title: "Waterfall по отклонениям",
    description: "Вклад факторов в общий рост/падение показателя.",
    type: "waterfall",
    tags: ["Отклонение", "Вклад", "Пояснение"],
    favorite: false,
  },
  {
    id: "visual-heatmap-matrix",
    title: "Heatmap матрица",
    description: "Интенсивность показателя по двум измерениям.",
    type: "heatmap",
    tags: ["Матрица", "Интенсивность", "Сегменты"],
    favorite: false,
  },
  {
    id: "visual-scatter-correlation",
    title: "Scatter для корреляции",
    description: "Связь двух метрик: например, объем и маржа.",
    type: "scatter",
    tags: ["Scatter", "Корреляция", "Метрики"],
    favorite: false,
  },
  {
    id: "visual-pie-structure",
    title: "Pie по структуре",
    description: "Доли категорий при небольшом количестве сегментов.",
    type: "pie",
    tags: ["Pie", "Доли", "Структура"],
    favorite: false,
  },
  {
    id: "visual-donut-progress",
    title: "Donut прогресс",
    description: "Выполнение плана или KPI в процентах.",
    type: "donut",
    tags: ["Donut", "Progress", "KPI"],
    favorite: false,
  },
  {
    id: "visual-treemap-portfolio",
    title: "Treemap портфель",
    description: "Дерево долей по направлениям или продуктам.",
    type: "treemap",
    tags: ["Treemap", "Портфель", "Доли"],
    favorite: false,
  },
  {
    id: "visual-radar-competency",
    title: "Radar сравнение профилей",
    description: "Сравнение нескольких объектов по одинаковым критериям.",
    type: "radar",
    tags: ["Radar", "Сравнение", "Профиль"],
    favorite: false,
  },
  {
    id: "visual-sankey-flow",
    title: "Sankey поток этапов",
    description: "Потоки между состояниями, каналами или этапами пути.",
    type: "sankey",
    tags: ["Sankey", "Flow", "Потоки"],
    favorite: false,
  },
  {
    id: "visual-map-region",
    title: "Карта по регионам",
    description: "География показателя: объем и плотность по регионам.",
    type: "map",
    tags: ["Карта", "География", "Регион"],
    favorite: false,
  },
  {
    id: "visual-table-details",
    title: "Таблица с деталями",
    description: "Детальный срез с drillthrough и условным форматированием.",
    type: "table",
    tags: ["Table", "Details", "Drillthrough"],
    favorite: false,
  },
  {
    id: "visual-kpi-card",
    title: "KPI карточка с дельтой",
    description: "Крупное текущее значение + изменение к прошлому периоду.",
    type: "kpi",
    tags: ["KPI", "Карточка", "Delta"],
    favorite: false,
  },
];

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "check-filters", text: "Проверены фильтры", completed: false },
  { id: "check-titles", text: "Все заголовки понятные", completed: false },
  { id: "check-metrics", text: "Все ключевые метрики подписаны", completed: false },
  { id: "check-palette", text: "Используется единая цветовая палитра", completed: false },
  { id: "check-empty-values", text: "Проверены пустые значения", completed: false },
  { id: "check-tooltips", text: "Настроены tooltips", completed: false },
  { id: "check-numbers", text: "Проверен формат чисел", completed: false },
  { id: "check-refresh-date", text: "Есть дата последнего обновления", completed: false },
  { id: "check-no-noise", text: "Удалены лишние визуальные элементы", completed: false },
  {
    id: "check-responsive",
    text: "Проверена читаемость на разных размерах экрана",
    completed: false,
  },
];
