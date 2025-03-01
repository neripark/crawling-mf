import { stringToNumber } from "../../utils/stringToNumber";
import { isDebugMode } from "../../utils/isDebugMode";
import { notifyToLine } from "../../repositories/postToLineNotify";
import { getMessageByDiff } from "./getMessageByDiff";
import { JSDOM } from "jsdom";

interface NonNullableRowElements {
  date: Element;
  content: Element;
  number: Element;
}

interface Row {
  dateText: string;
  sortKey: string;
  content: string;
  number: number;
}

// ______________________________
export class MfTable {
  private rowElements: NonNullableRowElements[];
  private rows: Row[];
  private EMOJI_1 = "💰";
  private EMOJI_2 = "💸";

  // note: 文字列でシリアライズされたTableを受け取る想定
  constructor(table: string) {
    this.rowElements = this.validate(table);
    this.rows = this.exchange();
  }

  private validate(table: string) {
    const _table = new JSDOM(table);

    // ************************************************************************************
    if (isDebugMode()) {
      const tableElement =
        _table.window.document.querySelector("table")?.innerHTML;
      notifyToLine(`[DEBUG] tableElement: ${tableElement ?? "文字列なし"}`);
    }
    // ************************************************************************************

    const rows = _table.window.document.querySelectorAll(
      ".transaction_list.js-cf-edit-container",
    );

    // ************************************************************************************
    if (isDebugMode()) {
      Array.from(rows).map(async (element) => {
        await notifyToLine(
          `[DEBUG] rows: ${element.innerHTML ?? "文字列なし"}`,
        );
      });
    }
    // ************************************************************************************

    if (rows.length === 0) throw new Error("テーブル内の行数が0です。");

    const nonNullRows = Array.from(rows).map((row) => {
      const date = row.querySelector(".date");
      const content = row.querySelector(".content");
      const number = row.querySelector(".number");
      if (date === null || content === null || number === null) {
        throw new Error("行の中に null の要素があります。");
      }
      return {
        date,
        content,
        number,
      };
    });
    return nonNullRows;
  }

  private exchange() {
    const _rows = this.rowElements
      .map((element) => {
        return {
          dateText: element.date.querySelector("span")?.textContent ?? "",
          sortKey:
            element.date.attributes.getNamedItem("data-table-sortable-value")
              ?.value ?? "",
          content: element.content.textContent?.trim() ?? "",
          // note: 編集可能項目と不可能項目でセレクタが違うため複数抽出
          number: stringToNumber(
            element.number.querySelectorAll(".noform > span, span.offset")[0]
              .textContent ?? "",
          ),
        };
      })
      .sort((a, b) => (a.sortKey < b.sortKey ? -1 : 1));
    return _rows;
  }

  private filterRowsByAllEmoji() {
    const rows = this.rows.filter((row) => {
      return (
        row.content.startsWith(this.EMOJI_1) ||
        row.content.startsWith(this.EMOJI_2)
      );
    });
    return rows;
  }

  private filterRowsBySpecificEmoji(emoji: string) {
    const rows = this.rows.filter((row) => {
      return row.content.startsWith(emoji);
    });
    return rows;
  }

  private calcDiff() {
    const sumEmoji1 = this.filterRowsBySpecificEmoji(this.EMOJI_1).reduce(
      (acc, current) => acc + current.number,
      0,
    );
    const sumEmoji2 = this.filterRowsBySpecificEmoji(this.EMOJI_2).reduce(
      (acc, current) => acc + current.number,
      0,
    );
    return getMessageByDiff(
      { key: this.EMOJI_1, price: sumEmoji1 },
      { key: this.EMOJI_2, price: sumEmoji2 },
    );
  }

  public getMessage(): string {
    const emojiRows = this.filterRowsByAllEmoji().map((row) => {
      return `${row.dateText} ${row.number.toLocaleString()} ${row.content}`;
    });
    const msgList = emojiRows.length !== 0 ? emojiRows.join("\n") : "なし";
    const msgSummary = this.calcDiff();
    return `\nおさいふから出した会計の一覧:\n${msgList}\n\n計算結果:\n${msgSummary}`;
  }
}
