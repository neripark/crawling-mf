import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export const generateDateLabelOnMf = () => {
  const now = new Date();
  const lastMonth = subMonths(now, 1);
  const firstDayOfLastMonth = startOfMonth(lastMonth);
  const lastDayOfLastMonth = endOfMonth(lastMonth);

  const dateString = `${format(firstDayOfLastMonth, "yyyy/MM/dd")} - ${format(
    lastDayOfLastMonth,
    "yyyy/MM/dd",
  )}`;

  return dateString;
};
