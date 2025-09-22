import type { Year } from "../Calendar/Year.ts";
import type { Month } from "../Calendar/Month.ts";
import type { Day } from "../Calendar/Day.ts"
import type { DayIndex } from "../../DayIndex/DayIndex.ts";

export interface Calendar<
  Y extends Year,
  M extends Month,
  D extends Day
> {
  /** この暦が扱うことのできる最初の日の DayIndex */
  readonly startDayIndex: DayIndex;

  /** 指定した dayIndex に対応する年を取得 */
  yearOf?(dayIndex: DayIndex): CalendarYear<Y>;
  
  /** この暦で表現できる年の一覧を取得 */
  years?(): IterableIterator<CalendarYear<Y>>;
  
  /** 指定した dayIndex と年に対応する月を取得 */
  monthOf?(dayIndex: DayIndex, year: CalendarYear<Y>): CalendarYearMonth<Y, M>;
  
  /** 指定した年に含まれる月の一覧を取得 */
  monthsOf?(year: CalendarYear<Y>): IterableIterator<CalendarYearMonth<Y, M>>;

  /** 指定した dayIndex と年と月に対応する日を取得 */
  dayOf?(dayIndex: DayIndex, year: CalendarYear<Y>, month: CalendarYearMonth<Y, M>): CalendarYearMonthDay<Y, M, D>;

  /** 指定した年と月と日に対応する dayIndex を取得 */
  daysOf?(year: CalendarYear<Y>, month: CalendarYearMonth<Y, M>): IterableIterator<CalendarYearMonthDay<Y, M, D>>;

  /** 指定した年と月と日が表す日付の dayIndex を取得 */
  dayIndexOf(year: Y, month: M, day: D): DayIndex;

  /** 等価かどうかを判定 */
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