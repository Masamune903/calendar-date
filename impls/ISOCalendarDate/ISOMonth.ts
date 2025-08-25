import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import { Month, MonthInfo } from "../../CalendarDate/Calendar/Month.ts";

export class ISOMonth extends Month {
  constructor(value: number) {
    if (value < 1) throw new CalendarOutOfRangeError(`ISOカレンダーは 1年1月1日 以前の日付は扱えません。`);
    super(value);
  }
}

export class ISOMonthInfo extends MonthInfo<ISOMonth> {
  constructor(month: ISOMonth, startDayIndex: number) {
    super(month, startDayIndex);
  }
}