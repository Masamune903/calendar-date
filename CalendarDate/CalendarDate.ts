import type { DayIndex } from "../DayIndex/DayIndex.ts";
import { CalendarOutOfRangeError } from "./Calendar/Calendar.ts";
import type { CalendarYear, CalendarYearMonth, CalendarYearMonthDay, Calendar } from "./Calendar/Calendar.ts";
import type { Year } from "./Calendar/Year.ts";
import type { Month } from "./Calendar/Month.ts";
import type { Day } from "./Calendar/Day.ts";

/**
 * 日付を表す型。
 * ※ここでは内部的な型なため、Year, Month, Day として受け取る。
 * （leapがあいまいになる number での受け取りはできない。それぞれのカレンダーで実装する。）
 */
export type CalendarDateLike<Y extends Year, M extends Month, D extends Day> = DayIndex | {
  readonly year: Y;
  readonly month: M;
  readonly day: D;
} | readonly [year: Y, month: M, day: D];

export abstract class CalendarDate<
  Y extends Year,
  M extends Month,
  D extends Day
> {
  readonly dayIndex: DayIndex;
  readonly calendar: Calendar<Y, M, D>;

  // # ==== Year ====

  #_yearInfo: CalendarYear<Y> | undefined;
  get #yearInfo() {
    return this.#_yearInfo ??= yearOfDayIndex(this.dayIndex, this.calendar);
  }

  get year() {
    return this.#yearInfo.year;
  }

  // # ==== Month ====

  #_monthInfo: CalendarYearMonth<Y, M> | undefined;
  get #monthInfo() {
    return this.#_monthInfo ??= monthOfDayIndex(this.#yearInfo, this.dayIndex, this.calendar);
  }
  
  get month() {
    return this.#monthInfo.month;
  }

  // # ==== Day ====

  #_dayInfo: CalendarYearMonthDay<Y, M, D> | undefined;
  get #dayInfo() {
    return this.#_dayInfo ??= dayOfDayIndex(this.#yearInfo, this.#monthInfo, this.dayIndex, this.calendar);
  }

  get day() {
    return this.#dayInfo.day;
  }

  protected constructor(dayIndex: DayIndex, calendar: Calendar<Y, M, D>, [year, month, day]: [yearInfo: CalendarYear<Y> | undefined, monthInfo: CalendarYearMonth<Y, M> | undefined, dayInfo: CalendarYearMonthDay<Y, M, D> | undefined] = [undefined, undefined, undefined]) {
    if (dayIndex < calendar.startDayIndex) {
      throw new CalendarOutOfRangeError(`このカレンダーでは範囲外の dayIndex が指定されました。`);
    }

    this.dayIndex = dayIndex;
    this.calendar = calendar;
    this.#_yearInfo = year;
    this.#_monthInfo = month;
    this.#_dayInfo = day;
  }

  toString() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  protected static fromYMD<Y extends Year, M extends Month, D extends Day>(like: CalendarDateLike<Y, M, D>, calendar: Calendar<Y, M, D>) {
    if (typeof like === "number") {
      return { dayIndex: like, calendar };
    }

    const isArray = (value: unknown): value is unknown[] | readonly unknown[] =>
      Array.isArray(value);

    if (isArray(like)) {
      const [year, month, day] = like;
      const dayIndex = calendar.dayIndexOf(year, month, day);
      return { dayIndex, calendar };
    }

    const dayIndex = calendar.dayIndexOf(like.year, like.month, like.day);
    return { dayIndex, calendar };
  }
}

function yearOfDayIndex<Y extends Year, M extends Month, D extends Day>(dayIndex: DayIndex, calendar: Calendar<Y, M, D>): CalendarYear<Y> {
  if (calendar.yearOf) {
    return calendar.yearOf(dayIndex);
  }

  if (calendar.years == null) {
    throw new Error("カレンダーが不正です。このカレンダーには年を取得するメソッドが1つも実装されていません。")
  }

  let lastYearInfo: CalendarYear<Y> | undefined;

  for (const year of calendar.years()) {
    if (year.dayIndex > dayIndex) {
      if (lastYearInfo == null)
        throw new CalendarOutOfRangeError(`このカレンダーでは範囲外の dayIndex が指定されました。`);

      return lastYearInfo
    }

    lastYearInfo = year;
  }

  if (lastYearInfo == null)
    throw new Error(`カレンダーが不正です。カレンダーが1つの year も持ちません。`);

  return lastYearInfo;
}

function monthOfDayIndex<Y extends Year, M extends Month, D extends Day>(yearInfo: CalendarYear<Y>, dayIndex: DayIndex, calendar: Calendar<Y, M, D>): CalendarYearMonth<Y, M> {
  if (calendar.monthOf) {
    return calendar.monthOf(dayIndex, yearInfo);
  }

  if (calendar.monthsOf == null) {
    throw new Error("カレンダーが不正です。このカレンダーには月を取得するメソッドが1つも実装されていません。");
  }

  let lastMonthInfo: CalendarYearMonth<Y, M> | undefined;

  for (const month of calendar.monthsOf(yearInfo)) {
    if (month.dayIndex > dayIndex) {
      if (lastMonthInfo == null)
        throw new CalendarOutOfRangeError(`${yearInfo.year}年において、このカレンダーでは範囲外の dayIndex が指定されました。`);

      return lastMonthInfo;
    }

    lastMonthInfo = month;
  }

  if (lastMonthInfo == null)
    throw new Error(`カレンダーが不正です。${yearInfo.year}年において、カレンダーが1つの month も持ちません。`);

  return lastMonthInfo;
}

function dayOfDayIndex<Y extends Year, M extends Month, D extends Day>(yearInfo: CalendarYear<Y>, monthInfo: CalendarYearMonth<Y, M>, dayIndex: DayIndex, calendar: Calendar<Y, M, D>): CalendarYearMonthDay<Y, M, D> {
  if (calendar.dayOf) {
    return calendar.dayOf(dayIndex, yearInfo, monthInfo);
  }

  if (calendar.daysOf == null) {
    throw new Error("カレンダーが不正です。このカレンダーには日を取得するメソッドが1つも実装されていません。");
  }

  let lastDayInfo: CalendarYearMonthDay<Y, M, D> | undefined;

  for (const day of calendar.daysOf(yearInfo, monthInfo)) {
    if (day.dayIndex > dayIndex) {
      if (lastDayInfo == null)
        throw new CalendarOutOfRangeError(`${yearInfo.year}年${monthInfo.month}月において、このカレンダーでは範囲外の dayIndex が指定されました。`);

      return lastDayInfo;
    }

    lastDayInfo = day;
  }

  if (lastDayInfo == null)
    throw new Error(`カレンダーが不正です。${yearInfo.year}年${monthInfo.month}月において、カレンダーが1つの day も持ちません。`);

  return lastDayInfo;
}