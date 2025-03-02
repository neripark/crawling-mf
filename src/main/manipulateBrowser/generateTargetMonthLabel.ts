import { format, subMonths } from "date-fns";

const DEFAULT_BACK_MONTHS = 1;

export const generateTargetMonthLabel = (numberToBack: number) => {
  if (numberToBack !== undefined && (numberToBack <= 0 || numberToBack > 3)) {
    // todo: なぜ3までなのか不明なので、解除する。サイトの仕様では1年遡れるはず
    // todo: 複数箇所に書いているので共通化する。
    throw new Error("遡る月数は1以上3以下で指定してください。");
  }
  const now = new Date();
  const targetDate = subMonths(now, numberToBack ?? DEFAULT_BACK_MONTHS);
  const dateString = format(targetDate, "yyyy年MM月");

  return dateString;
};
