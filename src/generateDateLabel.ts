import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export const generateDateLabelOnMf = (numberToBack?: number) => {
  const now = new Date();
  const targetMonth = subMonths(now, numberToBack ?? 1); // default: 1 = 先月
  const firstDayOfTargetMonth = startOfMonth(targetMonth);
  const lastDayOfTargetMonth = endOfMonth(targetMonth);

  const dateString = `${format(firstDayOfTargetMonth, "yyyy/MM/dd")} - ${format(
    lastDayOfTargetMonth,
    "yyyy/MM/dd",
  )}`;

  return dateString;
};
