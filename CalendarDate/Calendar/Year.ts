import type { DayIndex } from "../../DayIndex/DayIndex.ts";
import type { CalendarYear } from "./Calendar.ts";

/**
 * 単に年としての値を表す抽象クラス
 */
export abstract class Year {
  readonly number: number;

  constructor(number: number) {
    this.number = number;
  }

  toString(): string {
    return `${this.number}`;
  }

  toLocaleString(locale: string, options?: Pick<Intl.DateTimeFormatOptions, "year">): string {
    const defaultOptions: Intl.DateTimeFormatOptions = { year: "numeric" };

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(`${this.number}-1-1`));
  }

  equals(other: unknown): boolean {
    if (!(other instanceof Year)) return false;
    return this.number === other.number;
  }
}

/**
 * 閏年(同じ年を2回繰り返す)になる可能性のある暦で年を表すクラス
 */
export abstract class PossiblyLeapYear extends Year {
  readonly isLeap: boolean;

  constructor(value: number, isLeap: boolean) {
    super(value);
    this.isLeap = isLeap;
  }

  override toString(): string {
    return `${this.isLeap ? "bis" : ""}${this.number}`;
  }

  override equals(other: unknown): boolean {
    return other instanceof PossiblyLeapYear 
      && super.equals(other) && this.isLeap === other.isLeap;
  }
}

// # ==== 以下、Utility ====

/** DayQty (その年に含まれる日数) で表記された年一覧 */
type YearsByDayQty<Y extends YearByDayQty = YearByDayQty> = {
  readonly startDayIndex: DayIndex;
  readonly years: Iterable<Y>;
};

/** DayQty (その年に含まれる日数) で表記された年 */
type YearByDayQty = {
  readonly yearValue: number;
  readonly dayQty: number;
}

/**
 * DayQty (その年に含まれる日数) で表記された年一覧から、最初の日で指定した年一覧を作成する
 * @param yearsByDayQty 
 * @param createYear 
 */
export function* createYearItrFromDayQtys<Y extends YearByDayQty, R extends CalendarYear<Year>>(yearsByDayQty: YearsByDayQty<Y>, createYear: (data: Y, startDayIndex: DayIndex) => R): Iterable<R> {
  let dayIndex = yearsByDayQty.startDayIndex;

  for (const year of yearsByDayQty.years) {
    yield createYear(year, dayIndex);
    dayIndex += year.dayQty;
  }
}
