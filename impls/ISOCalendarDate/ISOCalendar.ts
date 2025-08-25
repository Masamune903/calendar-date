import { CalendarOutOfRangeError, type Calendar } from "../../CalendarDate/Calendar/Calendar.ts";
import type { DayIndex } from "../../DayIndex/DayIndex.ts";
import { ISODay, ISODayInfo } from "./ISODay.ts";
import { ISOMonth, ISOMonthInfo } from "./ISOMonth.ts";
import { ISOYear, ISOYearInfo } from "./ISOYear.ts";

const { floor: fl } = Math;

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
  return (year.value % 4 === 0 && year.value % 100 !== 0) || (year.value % 400 === 0);
}

function dayQtyInYearMonths(year: ISOYear) {
  const map: Map<number, number> = hasDay0229Year(year) ? dayQtyInLeapYear : dayQtyInNoLeapYear;
  return map;
}

function dayQtyInYearMonth(year: ISOYear, month: ISOMonth): number {
  const monthDays = dayQtyInYearMonths(year);
  const dayQty = monthDays.get(month.value);
  if (!dayQty) throw new Error(`Invalid month: ${month.value}`);
  return dayQty;
};

export class ISOCalendar implements Calendar<ISOYear, ISOMonth, ISODay> {
  static readonly instance = new ISOCalendar();

  /**
   * ISOカレンダーの開始日（グレゴリオ暦の開始日 1582年10月15日）
   */
  readonly startDayIndex: DayIndex = 577736;

  yearOf(dayIndex: DayIndex): ISOYearInfo {
    if (dayIndex < this.startDayIndex) {
      throw new CalendarOutOfRangeError(`グレゴリオ暦では 1582年10月15日 以前の日付は扱えません。`);
    }

    const daysIn1Year = 365;
    const daysIn4Years = daysIn1Year * 4 + (4 / 4);
    const daysIn100Years = daysIn4Years * 100/4 - (100 / 100);
    const daysIn400Years = daysIn100Years * 400/100 + (400 / 400);

    const years400 = fl(dayIndex / daysIn400Years);
    const years400Days = years400 * daysIn400Years;
    const years100 = fl((dayIndex - years400Days) / daysIn100Years);
    const years100Days = years100 * daysIn100Years;
    const years4 = fl((dayIndex - years400Days - years100Days) / daysIn4Years);
    const years4Days = years4 * daysIn4Years;
    const years1 = fl((dayIndex - years400Days - years100Days - years4Days) / daysIn1Year);
    const years1Days = years1 * daysIn1Year;

    const yearValue = years400 * 400 + years100 * 100 + years4 * 4 + years1 + 1;
    const startDayIndex = years400Days + years100Days + years4Days + years1Days;

    return new ISOYearInfo(new ISOYear(yearValue), startDayIndex);
  }
  
  *monthsOf(yearInfo: ISOYearInfo): IterableIterator<ISOMonthInfo> {
    let dayIndex = yearInfo.startDayIndex;

    for (let monthValue = 1; monthValue <= 12; monthValue++) {
      const monthInfo = new ISOMonthInfo(new ISOMonth(monthValue), dayIndex);
      yield monthInfo;
      dayIndex += dayQtyInYearMonth(yearInfo.year, monthInfo.month);
    }
  }

  dayOf(dayIndex: DayIndex, _year: ISOYearInfo, month: ISOMonthInfo): ISODayInfo {
    return new ISODayInfo(new ISODay(dayIndex - month.startDayIndex + 1), dayIndex);
  }

  dayIndexOf(year: ISOYear, month: ISOMonth, day: ISODay): DayIndex {
    if (year.value < 1 && month.value < 1 && day.value < 1) {
      throw new CalendarOutOfRangeError(`ISOカレンダーは 1年1月1日 以前の日付は扱えません。`);
    }

    const lastYear = new ISOYear(year.value - 1);

    /** 1つ前の年の最後の日の dayIndex */
    const dayIndexOfLastYearEnd = lastYear.value * 365 + fl(lastYear.value / 4) - fl(lastYear.value / 100) + fl(lastYear.value / 400);
    
    /** 1つ前の月の最後の日の dayIndex */
    const dayIndexOfLastMonthEnd = dayIndexOfLastYearEnd 
      + dayQtyInYearMonths(year).entries()
        .filter(([m, ]) => m < month.value)
        .reduce((p, [, d]) => p + d, 0);

    return dayIndexOfLastMonthEnd + (day.value - 1);  // 1年1月1日を0日とする
  }

  equals(other: unknown): boolean {
    if (!(other instanceof ISOCalendar)) return false;

    return this === other;
  }

  private constructor() {}
}
