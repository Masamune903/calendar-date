import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Day } from "../../CalendarDate/Calendar/Day.ts";

export class ISODay extends Day {
  get name() {
    return names["ja-JP"](this);
  }

  constructor(number: number) {
    if (number < 1) throw new CalendarOutOfRangeError(`ISOカレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(number);
  }

  override toString(): string {
    return `ISODay { ${this.number} }`;
  }
}

const names = {
  "ja-JP": (day: ISODay) => `${day.number}日`,
};