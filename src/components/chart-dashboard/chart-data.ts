import {Category, type Chart} from "@/components/chart-dashboard/chart.ts";


const MAX_CHART_DATE_RANGE_IN_DAYS = 200;
const CHART_NAMES = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Eta",
  "Theta",
  "Iota",
]

export const orderedChartDataDates = Array.from({ length: MAX_CHART_DATE_RANGE_IN_DAYS }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (MAX_CHART_DATE_RANGE_IN_DAYS - 1 - i)); // 100 days back ending today
  return d;
});

export const chartData: Chart[] = Array.from({ length: CHART_NAMES.length }, (_, i) => ({
  id: String(i),
  label: CHART_NAMES[i],
  category: Math.floor(i/3) === 0 ? Category.Primary : (Math.floor(i/3) === 1 ? Category.Secondary : Category.Tertiary),
  data: orderedChartDataDates.map(date => ({
    date,
    value: Math.floor(Math.random() * 100),
  })),
}));
