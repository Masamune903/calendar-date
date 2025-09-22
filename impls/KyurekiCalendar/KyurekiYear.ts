import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Year } from "../../CalendarDate/Calendar/Year.ts";

export class KyurekiYear extends Year {
  get name() {
    return names["ja-JP"](this);
  }

  constructor(value: number) {
    if (value < 1) throw new CalendarOutOfRangeError(`旧暦カレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(value);
  }

  override toString(): string {
    return `KyurekiYear { ${this.number} }`;
  }
}

const names = {
  "ja-JP": (year: KyurekiYear) => `${year.number}年`,
};