import { CalendarOutOfRangeError } from "../../CalendarDate/Calendar/Calendar.ts";
import type { CalendarYear, CalendarYearMonth, CalendarYearMonthDay, Calendar } from "../../CalendarDate/Calendar/Calendar.ts";
import type { DayIndex } from "../../DayIndex/DayIndex.ts";
import { ISODay } from "./ISODay.ts";
import { ISOMonth } from "./ISOMonth.ts";
import { ISOYear } from "./ISOYear.ts";

type ISOCalendarYear = CalendarYear<ISOYear>;
type ISOCalendarYearMonth = CalendarYearMonth<ISOYear, ISOMonth>;
type ISOCalendarYearMonthDay = CalendarYearMonthDay<ISOYear, ISOMonth, ISODay>;

const { floor: fl, min } = Math;

const dayQtyInNoLeapYear = new Map<number, number>([
  [1, 31],
  [2, 28],
  [3, 31],
  [4, 30],
  [5, 31],
  [6, 30],
  [7, 31],
  [8, 31],
  [9, 30],
  [10, 31],
  [11, 30],
  [12, 31]
]);

const dayQtyInLeapYear = new Map<number, number>(
  dayQtyInNoLeapYear.entries().map(([m, d]) => m === 2 ? [m, 29] : [m, d])
);

function hasDay0229Year(year: ISOYear) {
  return (year.number % 4 === 0 && year.number % 100 !== 0) || (year.number % 400 === 0);
}

function dayQtyInYearMonths(year: ISOYear) {
  const map: Map<number, number> = hasDay0229Year(year) ? dayQtyInLeapYear : dayQtyInNoLeapYear;
  return map;
}

function dayQtyInYearMonth(year: ISOYear, month: ISOMonth): number {
  const monthDays = dayQtyInYearMonths(year);
  const dayQty = monthDays.get(month.number);
  if (!dayQty) throw new Error(`Invalid month: ${month.number}`);
  return dayQty;
};

export class ISOCalendar implements Calendar<ISOYear, ISOMonth, ISODay> {
  static readonly instance: ISOCalendar = new ISOCalendar();

  /**
   * ISOカレンダーの開始日（拡張グレゴリオ暦の開始日 1年1月1日 (グレゴリオ暦は 1582年10月15日 = 577736)）
   */
  readonly startDayIndex: DayIndex = 0;

  yearOf(dayIndex: DayIndex): ISOCalendarYear {
    if (dayIndex < this.startDayIndex) {
      throw new CalendarOutOfRangeError(`グレゴリオ暦では 1582年10月15日 以前の日付は扱えません。`);
    }

    const daysIn1Year = 365;
    const daysIn4Years = daysIn1Year * 4 + (4 / 4);
    const daysIn100Years = daysIn4Years * 100/4 - (100 / 100);
    const daysIn400Years = daysIn100Years * 400/100 + (400 / 400);

    const years400 = fl(dayIndex / daysIn400Years);
    const years400Days = years400 * daysIn400Years;
    const years100 = min(400/100 - 1, fl((dayIndex - years400Days) / daysIn100Years));
    const years100Days = years100 * daysIn100Years;
    const years4 = min(100/4 - 1, fl((dayIndex - years400Days - years100Days) / daysIn4Years));
    const years4Days = years4 * daysIn4Years;
    const years1 = min(4/1 - 1, fl((dayIndex - years400Days - years100Days - years4Days) / daysIn1Year)); // years1 は 4 以上にはならない (特に閏年の最終日は4になってしまう)
    const years1Days = years1 * daysIn1Year;

    const yearValue = years400 * 400 + years100 * 100 + years4 * 4 + years1 + 1;
    const startDayIndex = years400Days + years100Days + years4Days + years1Days;

    return { year: new ISOYear(yearValue), dayIndex: startDayIndex, calendar: this };
  }

  *monthsOf(yearInfo: ISOCalendarYear): IterableIterator<ISOCalendarYearMonth> {
    let dayIndex = yearInfo.dayIndex;

    for (let monthValue = 1; monthValue <= 12; monthValue++) {
      yield { year: yearInfo.year, month: new ISOMonth(monthValue), dayIndex, calendar: this };
      dayIndex += dayQtyInYearMonth(yearInfo.year, new ISOMonth(monthValue));
    }
  }

  dayOf(dayIndex: DayIndex, year: ISOCalendarYear, month: ISOCalendarYearMonth): ISOCalendarYearMonthDay {
    return { year: year.year, month: month.month, day: new ISODay(dayIndex - month.dayIndex + 1), dayIndex, calendar: this };
  }

  dayIndexOf(year: ISOYear, month: ISOMonth, day: ISODay): DayIndex {
    if (year.number < 1 && month.number < 1 && day.number < 1) {
      throw new CalendarOutOfRangeError(`ISOカレンダーは 1年1月1日 以前の日付は扱えません。`);
    }

    /** その年の最初の日の dayIndex (前の年の最後の日までの日数 dayQty と等しい) */
    const dayIndexOfYearStart = (() => {
      if (year.equals(new ISOYear(1)))
        return 0;
      
      const lastYear = new ISOYear(year.number - 1);
      return lastYear.number * 365 + fl(lastYear.number / 4) - fl(lastYear.number / 100) + fl(lastYear.number / 400);
    })();
    
    /** その年月の最初の日の dayIndex (前の月の最後の日までの日数 dayQty と等しい) */
    const dayIndexOfYearMonthStart = dayIndexOfYearStart 
      + dayQtyInYearMonths(year).entries()
        .filter(([m, ]) => m < month.number)
        .reduce((p, [, d]) => p + d, 0);

    return dayIndexOfYearMonthStart + (day.number - 1);  // 1年1月1日を0日とする
  }

  equals(other: unknown): boolean {
    if (!(other instanceof ISOCalendar)) return false;

    return this === other;
  }

  toString(): string {
    return `ISOCalendar {}`;
  }

  private constructor() {}
}
