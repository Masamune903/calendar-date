import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Year } from "../../CalendarDate/Calendar/Year.ts";

export class ISOYear extends Year {
  get name() {
    return names["ja-JP"](this);
  }

  constructor(number: number) {
    if (number < 1) throw new CalendarOutOfRangeError(`ISOカレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(number);
  }

  override toString(): string {
    return `ISOYear { ${this.number} }`;
  }
}

const names = {
  "ja-JP": (year: ISOYear) => `${year.number}年`,
};