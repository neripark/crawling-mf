import { stringToNumber } from "./stringToNumber";

interface RowElement {
  date: Element | null;
  content: Element | null;
  number: Element | null;
}

interface NonNullableRowElements extends RowElement {
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

  constructor(rows: RowElement[]) {
    this.rowElements = this.validate(rows);
    this.rows = this.exchange();
  }

  private validate(rowElement: RowElement[]) {
    const nonNullRows = rowElement.map((element) => {
      if (
        element.date === null ||
        element.content === null ||
        element.number === null
      ) {
        throw new Error("null の要素があります。");
      }
      return {
        date: element.date,
        content: element.content,
        number: element.number,
      };
    });
    return nonNullRows;
  }

  private exchange() {
    const _rows = this.rowElements.map((element) => {
      return {
        dateText: element.date.querySelector(".noform span")?.textContent ?? "",
        sortKey:
          element.date.attributes.getNamedItem("data-table-sortable-value")
            ?.value ?? "",
        content: element.date.textContent ?? "",
        number: stringToNumber(element.number.textContent ?? ""),
      };
    });

    return _rows;
  }
}
