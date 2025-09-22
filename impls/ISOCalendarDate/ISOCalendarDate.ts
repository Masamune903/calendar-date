import { CalendarDate, type CalendarDateLike } from "../../CalendarDate/CalendarDate.ts";
import { ISOCalendar } from "./ISOCalendar.ts";
import type { DayIndex, DayIndexedDate } from "../../DayIndex/DayIndex.ts";
import { ArrayUtil } from "../../Util/ArrayUtil.ts"
import { ISODay } from "./ISODay.ts";
import { ISOMonth } from "./ISOMonth.ts";
import { ISOYear } from "./ISOYear.ts";
import { ISODayOfWeek } from "./ISOWeek.ts";

type ISOCalendarLike = readonly [year: number, month: number, day: number] | {
  readonly year: number;
  readonly month: number;
  readonly day: number;
} | CalendarDateLike<ISOYear, ISOMonth, ISODay>;

type ISOCalendarDateCYMD = {
  readonly calendar: ISOCalendar;
  readonly year: ISOYear | number;
  readonly month: ISOMonth | number;
  readonly day: ISODay | number;
};

export class ISOCalendarDate extends CalendarDate<ISOYear, ISOMonth, ISODay> {
  override calendar: ISOCalendar;

  get dayOfWeek(): ISODayOfWeek {
    return new ISODayOfWeek(this.dayIndex % 7);
  }

  protected constructor(dayIndex: DayIndex) {
    super(dayIndex, ISOCalendar.instance);
    this.calendar = ISOCalendar.instance;
  }

  /**
   * ISOカレンダーでは、YMDでの比較も可能なため、それを実装する。
   * @param other 
   * @returns 
   */
  override compare(other: ISOCalendarDateCYMD | DayIndexedDate): number {
    if ("dayIndex" in other) {
      return super.compare(other);
    }

    return ISOCalendarDate.compare(this, other);
  }

  toDate(): Date {
    return new Date(this.year.number, this.month.number - 1, this.day.number, 0, 0, 0, 0);
  }

  override toString(): string {
    return `ISOCalendarDate { ${this.dayIndex} "${this.year}-${this.month}-${this.day}" }`;
  }

  static from(like: ISOCalendarLike): ISOCalendarDate {
    if (typeof like === "number") {
      return new ISOCalendarDate(like);
    }

    if ("dayIndex" in like) {
      return new ISOCalendarDate(like.dayIndex);
    }

    const [yearLike, monthLike, dayLike] = (ArrayUtil.isArray(like) ? like : [like.year, like.month, like.day]);

    const year = typeof yearLike === "number" ? new ISOYear(yearLike) : yearLike;
    const month = typeof monthLike === "number" ? new ISOMonth(monthLike) : monthLike;
    const day = typeof dayLike === "number" ? new ISODay(dayLike) : dayLike;

    const dayIndex = ISOCalendar.instance.dayIndexOf(year, month, day);
    return new ISOCalendarDate(dayIndex);
  }

  static fromDate(date: Date): ISOCalendarDate {
    return ISOCalendarDate.from([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
  }

  static compare(a: ISOCalendarDateCYMD, b: ISOCalendarDateCYMD): number {
    if (a.calendar !== ISOCalendar.instance || b.calendar !== ISOCalendar.instance)
      throw new Error("Different calendars");

    const [a_year, a_month, a_day] = [getValue(a.year), getValue(a.month), getValue(a.day)];
    const [b_year, b_month, b_day] = [getValue(b.year), getValue(b.month), getValue(b.day)];

    if (a_year === b_year) {
      if (a_month === b_month) {
        if (a_day === b_day)
          return 0;

        return (a_day < b_day) ? -1 : 1;
      }

      return (a_month < b_month) ? -1 : 1;
    }

    return (a_year < b_year) ? -1 : 1;
  }
}

function getValue<T>(value: { readonly value: T; } | T) {
  return (typeof value === "object" && value !== null && "value" in value) ? value.value : value;
}