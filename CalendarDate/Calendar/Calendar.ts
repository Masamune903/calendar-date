import type { Year } from "../Calendar/Year.ts";
import type { Month } from "../Calendar/Month.ts";
import type { Day } from "../Calendar/Day.ts"
import type { DayIndex } from "../../DayIndex/DayIndex.ts";

export interface Calendar<
  Y extends Year,
  M extends Month,
  D extends Day
> {
  readonly startDayIndex: DayIndex;

  yearOf?(dayIndex: DayIndex): CalendarYear<Y>;
  
  years?(): IterableIterator<CalendarYear<Y>>;
  
  monthOf?(dayIndex: DayIndex, year: CalendarYear<Y>): CalendarYearMonth<Y, M>;
  
  monthsOf?(year: CalendarYear<Y>): IterableIterator<CalendarYearMonth<Y, M>>;

  dayOf?(dayIndex: DayIndex, year: CalendarYear<Y>, month: CalendarYearMonth<Y, M>): CalendarYearMonthDay<Y, M, D>;

  daysOf?(year: CalendarYear<Y>, month: CalendarYearMonth<Y, M>): IterableIterator<CalendarYearMonthDay<Y, M, D>>;

  dayIndexOf(year: Y, month: M, day: D): DayIndex;

  equals(other: unknown): boolean;
}

/**
 * 日付のうち、年の情報を扱う型。
 * dayIndex は month, day が1日目の時の値。
 */
export type CalendarYear<Y extends Year> = {
  readonly calendar: Calendar<Y, Month, Day>;
  readonly dayIndex: DayIndex;
  readonly year: Y;
};

/**
 * 日付のうち、年と月の情報を扱う型。
 * dayIndex は day が1日目の時の値。
 */
export type CalendarYearMonth<Y extends Year, M extends Month> = {
  readonly calendar: Calendar<Y, M, Day>;
  readonly dayIndex: DayIndex;
  readonly year: Y;
  readonly month: M;
};

/**
 * 日付の年と月と日を扱う型。
 */
export type CalendarYearMonthDay<Y extends Year, M extends Month, D extends Day> = {
  readonly calendar: Calendar<Y, M, D>;
  readonly dayIndex: DayIndex;
  readonly year: Y;
  readonly month: M;
  readonly day: D;
};

export class CalendarOutOfRangeError extends Error {
  override readonly name = "CalendarOutOfRangeError";
  
  constructor(message: string) {
    super(message);
  }
}