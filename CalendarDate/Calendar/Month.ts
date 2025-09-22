import type { DayIndex } from "../../DayIndex/DayIndex.ts";
import type { CalendarYearMonth } from "./Calendar.ts";
import type { Year } from "./Year.ts";

export abstract class Month {
  readonly number: number;

  constructor(number: number) {
    this.number = number;
  }

  toString() {
    return `${this.number}`;
  }

  toLocaleString(locale: string, options?: Pick<Intl.DateTimeFormatOptions, "month">) {
    const defaultOptions: Intl.DateTimeFormatOptions = { month: "long" };

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(`2000-${this.number}-1`));
  }

  equals(other: unknown): boolean {
    if (!(other instanceof Month)) return false;
    return this.number === other.number;
  }
}

/**
 * 閏月になる可能性のある暦で月を表すクラス
 */
export abstract class PossiblyLeapMonth extends Month {
  readonly isLeap: boolean;

  constructor(value: number, isLeap: boolean) {
    super(value);
    this.isLeap = isLeap;
  }

  override toString(): string {
    return `${this.isLeap ? "bis" : ""}${this.number}`;
  }

  override equals(other: unknown): boolean {
    if (!(other instanceof PossiblyLeapMonth)) return false;
    return super.equals(other) && this.isLeap === other.isLeap;
  }
}

// # ==== 以下、Utility ====

/** DayQty (その月に含まれる日数) で表記された月一覧 */
type MonthsByDayQty<Y extends MonthByDayQty = MonthByDayQty> = {
  readonly startDayIndex: DayIndex;
  readonly months: Iterable<Y>;
};

/** DayQty (その月に含まれる日数) で表記された月 */
type MonthByDayQty = {
  readonly monthValue: number;
  readonly dayQty: number;
}

/**
 * DayQty (その月に含まれる日数) で表記された月一覧から、最初の日で指定した月一覧を作成する
 * @param monthsByDayQty 
 * @param createMonth 
 */
export function* createMonthItrFromDayQtys<M extends MonthByDayQty, R extends CalendarYearMonth<Year, Month>>(monthsByDayQty: MonthsByDayQty<M>, createMonth: (data: M, startDayIndex: DayIndex) => R): Iterable<R> {
  let dayIndex = monthsByDayQty.startDayIndex;

  for (const month of monthsByDayQty.months) {
    yield createMonth(month, dayIndex);
    dayIndex += month.dayQty;
  }
}
