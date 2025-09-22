import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { PossiblyLeapMonth } from "../../CalendarDate/Calendar/Month.ts";

export class KyurekiMonth extends PossiblyLeapMonth {
  get name(): string {
    return names["ja-JP"](this);
  }

  get alias(): string {
    return aliases["ja-JP"](this);
  }

  constructor(value: number, isLeap: boolean) {
    if (value < 1) throw new CalendarOutOfRangeError(`旧暦カレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(value, isLeap);
  }

  override toString(): string {
    return `KyurekiMonth { ${this.number}${this.isLeap ? " (leap)" : ""} }`;
  }
}

const names = {
  "ja-JP": (month: KyurekiMonth) => `${month.isLeap ? "閏" : ""}${month.number}月`,
};

const aliases = {
  "ja-JP": (month: KyurekiMonth) => {
    const leap = month.isLeap ? "閏" : "";
    const alias = ["睦月", "如月", "弥生", "卯月", "皐月", "水無月", "文月", "葉月", "長月", "神無月", "霜月", "師走"][month.number - 1];
    return `${leap}${alias}`;
  }
};