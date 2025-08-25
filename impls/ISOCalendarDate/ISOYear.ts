import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Year, YearInfo } from "../../CalendarDate/Calendar/Year.ts";

export class ISOYear extends Year {
  constructor(value: number) {
    if (value < 1) throw new CalendarOutOfRangeError(`ISOカレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(value);
  }
}

export class ISOYearInfo extends YearInfo<ISOYear> {
  constructor(year: ISOYear, startDayIndex: number) {
    super(year, startDayIndex);
  }
}
