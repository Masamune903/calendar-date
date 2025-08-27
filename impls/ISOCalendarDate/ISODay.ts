import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Day } from "../../CalendarDate/Calendar/Day.ts";

export class ISODay extends Day {
  constructor(value: number) {
    if (value < 1) throw new CalendarOutOfRangeError(`ISOカレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(value);
  }
}
