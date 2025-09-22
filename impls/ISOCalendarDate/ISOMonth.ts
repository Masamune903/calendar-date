import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Month } from "../../CalendarDate/Calendar/Month.ts";

export class ISOMonth extends Month {
  get name(): string {
    return names["ja-JP"](this);
  }

  constructor(number: number) {
    if (number < 1) throw new CalendarOutOfRangeError(`ISOカレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(number);
  }

  override toString(): string {
    return `ISOMonth { ${this.number} }`;
  }
}

const names = {
  "ja-JP": (month: ISOMonth) => `${month.number}月`,
};