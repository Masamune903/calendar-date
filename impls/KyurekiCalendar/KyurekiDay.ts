import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Day } from "../../CalendarDate/Calendar/Day.ts";

export class KyurekiDay extends Day {
  get name(): string {
    return names["ja-JP"](this);
  }

  constructor(value: number) {
    if (value < 1) throw new CalendarOutOfRangeError(`旧暦カレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(value);
  }

  override toString(): string {
    return `KyurekiDay { ${this.number} }`;
  }
}

const names = {
  "ja-JP": (day: KyurekiDay) => `${day.number}日`,
};