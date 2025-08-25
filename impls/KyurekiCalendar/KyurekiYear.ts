import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Year, CalendarYear } from "../../CalendarDate/Calendar/Year.ts";

export class KyurekiYear extends Year {
  constructor(value: number) {
    if (value < 1) throw new CalendarOutOfRangeError(`旧暦カレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(value);
  }
}

export class KyurekiYearInfo extends CalendarYear<KyurekiYear> {
  constructor(year: KyurekiYear, startDayIndex: number) {
    super(year, startDayIndex);
  }
}
