import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Year } from "../../CalendarDate/Calendar/Year.ts";

export class ISOYear extends Year {
  constructor(value: number) {
    if (value < 1) throw new CalendarOutOfRangeError(`ISOカレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(value);
  }
}
