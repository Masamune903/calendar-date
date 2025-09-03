import { CalendarDate, type CalendarDateLike } from "../../CalendarDate/CalendarDate.ts";
import { ISOCalendar } from "./ISOCalendar.ts";
import type { DayIndex } from "../../DayIndex/DayIndex.ts";
import { ArrayUtil } from "../../Util/ArrayUtil.ts"
import { ISODay } from "./ISODay.ts";
import { ISOMonth } from "./ISOMonth.ts";
import { ISOYear } from "./ISOYear.ts";

type ISOCalendarLike = readonly [year: number, month: number, day: number] | {
  readonly year: number;
  readonly month: number;
  readonly day: number;
} | CalendarDateLike<ISOYear, ISOMonth, ISODay>;

export class ISOCalendarDate extends CalendarDate<ISOYear, ISOMonth, ISODay> {
  get dayOfWeek() {
    return this.dayIndex % 7;
  }

  constructor(dayIndex: DayIndex) {
    super(dayIndex, ISOCalendar.instance);
  }

  toDate() {
    return new Date(this.year.value, this.month.value - 1, this.day.value, 0, 0, 0, 0);
  }

  override toString() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  static from(like: ISOCalendarLike): ISOCalendarDate {
    if (typeof like === "number") {
      return new ISOCalendarDate(like);
    }

    const [yearLike, monthLike, dayLike] = (ArrayUtil.isArray(like) ? like : [like.year, like.month, like.day]);

    const year = typeof yearLike === "number" ? new ISOYear(yearLike) : yearLike;
    const month = typeof monthLike === "number" ? new ISOMonth(monthLike) : monthLike;
    const day = typeof dayLike === "number" ? new ISODay(dayLike) : dayLike;

    const dayIndex = ISOCalendar.instance.dayIndexOf(year, month, day);
    return new ISOCalendarDate(dayIndex);
  }
}