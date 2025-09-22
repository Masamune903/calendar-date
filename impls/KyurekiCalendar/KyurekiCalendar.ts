import type { Calendar, CalendarYear, CalendarYearMonth, CalendarYearMonthDay } from "../../CalendarDate/Calendar/Calendar.ts";
import type { DayIndex } from "../../DayIndex/DayIndex.ts";
import { ISOCalendarDate } from "../ISOCalendarDate/ISOCalendarDate.ts";
import { kyurekiCalendarDataset } from "./data/KyurekiCalendarDataset.ts";
import { KyurekiCalendarDate } from "./KyurekiCalendarDate.ts";
import { KyurekiDay } from "./KyurekiDay.ts";
import type { KyurekiMonth } from "./KyurekiMonth.ts";
import type { KyurekiYear } from "./KyurekiYear.ts";

type KyurekiCalendarYear = CalendarYear<KyurekiYear>;
type KyurekiCalendarYearMonth = CalendarYearMonth<KyurekiYear, KyurekiMonth>;
type KyurekiCalendarYearMonthDay = CalendarYearMonthDay<KyurekiYear, KyurekiMonth, KyurekiDay>;

export class KyurekiCalendar implements Calendar<KyurekiYear, KyurekiMonth, KyurekiDay> {
  static readonly instance = new KyurekiCalendar();

  readonly startDayIndex: DayIndex = kyurekiCalendarDataset.startDayIndex;

  #min?: KyurekiCalendarDate;
  get min() { return this.#min ??= KyurekiCalendarDate.from(this.startDayIndex) };

  #max?: KyurekiCalendarDate;
  get max() { return this.#max ??= KyurekiCalendarDate.from(ISOCalendarDate.from([2199, 12, 31]).dayIndex) };

  yearOf(dayIndex: DayIndex): KyurekiCalendarYear {
    const yearInfo = kyurekiCalendarDataset.findYearByDayIndex(dayIndex);
    if (!yearInfo) 
      throw new RangeError(`The dayIndex ${dayIndex} is out of range of this calendar.`);
    
    const [year, yDayIndex] = yearInfo;
    return {
      calendar: this,
      year,
      dayIndex: yDayIndex,
    };
  }
  
  monthOf(dayIndex: DayIndex, cYear: KyurekiCalendarYear): KyurekiCalendarYearMonth {
    const monthInfo = kyurekiCalendarDataset.findYearMonthByIndex(cYear.year, dayIndex);
    if (!monthInfo) 
      throw new RangeError(`The dayIndex ${dayIndex} is out of range of the year ${cYear.year} in this calendar.`);

    const [month, mDayIndex] = monthInfo;
    return {
      calendar: this,
      year: cYear.year,
      month,
      dayIndex: mDayIndex,
    };
  }
  
  dayOf(dayIndex: DayIndex, cYear: KyurekiCalendarYear, cMonth: KyurekiCalendarYearMonth): KyurekiCalendarYearMonthDay {
    const monthInfo = kyurekiCalendarDataset.getYearMonth(cYear.year, cMonth.month);
    if (!monthInfo) 
      throw new RangeError(`The month ${cMonth.month.number}${cMonth.month.isLeap ? " (leap)" : ""} of the year ${cYear.year} does not exist in this calendar.`);
    
    const dayNumber = dayIndex - monthInfo.dayIndex + 1;
    if (dayNumber < 1) {
      throw new RangeError(`The dayIndex ${dayIndex} is out of range of the month ${cMonth.month.number} in this calendar.`);
    }
    const day = new KyurekiDay(dayNumber);

    return {
      calendar: this,
      year: cYear.year,
      month: cMonth.month,
      day,
      dayIndex,
    };
  }
  
  dayIndexOf(year: KyurekiYear, month: KyurekiMonth, day: KyurekiDay): DayIndex {
    const monthInfo = kyurekiCalendarDataset.getYearMonth(year, month);
    if (!monthInfo)
      throw new RangeError(`The month ${month.number}${month.isLeap ? " (leap)" : ""} of the year ${year} does not exist in this calendar.`);
    
    return monthInfo.dayIndex + day.number - 1;
  }
  
  equals(other: unknown): boolean {
    if (!(other instanceof KyurekiCalendar)) return false;

    return this.startDayIndex === other.startDayIndex;
  }

  toString(): string {
    return `KyurekiCalendar {}`;
  }
}

type KyurekiYMD = {
  readonly year: KyurekiYear;
  readonly month: KyurekiMonth;
  readonly day: KyurekiDay;
};
export function compareKyurekiYMD(dateA: KyurekiYMD, dateB: KyurekiYMD): number {
  const yearDiff = dateA.year.number - dateB.year.number;
  if (yearDiff !== 0) return yearDiff;

  const monthDiff = compareKyurekiMonth(dateA.month, dateB.month);
  if (monthDiff !== 0) return monthDiff;

  return dateA.day.number - dateB.day.number;
}

export function compareKyurekiMonth(monthA: KyurekiMonth, monthB: KyurekiMonth): number {
  const yearDiff = monthA.number - monthB.number;
  if (yearDiff !== 0) return yearDiff;

  return monthA.isLeap === monthB.isLeap ? 0
    : monthA.isLeap ? 1 : -1;
}