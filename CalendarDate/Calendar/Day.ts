import type { DayIndex } from "../../DayIndex/DayIndex.ts";
import type { CalendarYearMonthDay } from "./Calendar.ts";
import type { Month } from "./Month.ts";
import type { Year } from "./Year.ts";

export abstract class Day {
  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  toString() {
    return `${this.value}`;
  }

  toLocaleString(locale: string, options?: Pick<Intl.DateTimeFormatOptions, "day">) {
    const defaultOptions: Intl.DateTimeFormatOptions = { day: "numeric" };

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(`2000-1-${this.value}`));
  }

  equals(other: unknown): boolean {
    if (!(other instanceof Day)) return false;
    return this.value === other.value;
  }

}

/**
 * 閏日になる可能性のある暦で日を表すクラス
 */
export abstract class PossiblyLeapDay extends Day {
  readonly isLeap: boolean;

  constructor(value: number, isLeap: boolean) {
    super(value);
    this.isLeap = isLeap;
  }

  override toString(): string {
    return `${this.isLeap ? "bis" : ""}${this.value}`;
  }

  override equals(other: unknown): boolean {
    if (!(other instanceof PossiblyLeapDay)) return false;
    return super.equals(other) && this.isLeap === other.isLeap;
  }

}

// # ==== 以下、Utility ====

/** DayQty (その月に含まれる日数) で表記された日一覧 */
type DaysByDayQty<D extends DayByDayQty = DayByDayQty> = {
  readonly startDayIndex: DayIndex;
  readonly days: Iterable<D>;
};

/** DayQty (その日が何日目か) で表記された日 */
type DayByDayQty = {
  readonly dayValue: number;
  readonly dayQty: number;
}

/**
 * DayQty (その日が何日目か) で表記された日一覧から、最初の日で指定した日一覧を作成する
 * @param daysByDayQty 
 * @param createDay 
 */
export function* createDayItrFromDayQtys<D extends DayByDayQty, R extends CalendarYearMonthDay<Year, Month, Day>>(daysByDayQty: DaysByDayQty<D>, createDay: (data: D, startDayIndex: DayIndex) => R): Iterable<R> {
  let dayIndex = daysByDayQty.startDayIndex;

  for (const day of daysByDayQty.days) {
    yield createDay(day, dayIndex);
    dayIndex += day.dayQty;
  }
}
