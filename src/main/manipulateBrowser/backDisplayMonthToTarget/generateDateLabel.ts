import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export const generateDateLabelOnMf = (numberToBack?: number) => {
  if (numberToBack !== undefined && (numberToBack <= 0 || numberToBack > 3)) {
    // todo: なぜ3までなのか不明なので、解除する。サイトの仕様では1年遡れるはず
    // todo: 複数箇所に書いているので共通化する。
    throw new Error("遡る月数は1以上3以下で指定してください。");
  }
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
