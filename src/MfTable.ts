import { stringToNumber } from "./stringToNumber";
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

  // note: 文字列でシリアライズされたTableを受け取る想定
  constructor(table: string) {
    this.rowElements = this.validate(table);
    this.rows = this.exchange();
  }

  private validate(table: string) {
    const _table = new JSDOM(table);
    const rows = _table.window.document.querySelectorAll(
      ".transaction_list.js-cf-edit-container"
    );
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
    const _rows = this.rowElements.map((element) => {
      return {
        dateText: element.date.querySelector("span")?.textContent ?? "",
        sortKey:
          element.date.attributes.getNamedItem("data-table-sortable-value")
            ?.value ?? "",
        content: element.content.textContent?.trim() ?? "",
        // note: 編集可能項目と不可能項目でセレクタが違うため複数抽出
        number: stringToNumber(
          element.number.querySelectorAll(".noform > span, span.offset")[0]
            .textContent ?? ""
        ),
      };
    });
    return _rows;
  }

  public getRowsSimpleString(): string {
    return this.rows
      .map((row) => {
        return `${row.dateText} ${row.number} ${row.content}`;
      })
      .join("N");
  }
}
