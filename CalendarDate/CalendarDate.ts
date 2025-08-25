import type { DayIndex } from "../DayIndex/DayIndex.ts";
import { CalendarOutOfRangeError, type Calendar } from "./Calendar/Calendar.ts";
import type { Year, YearInfo } from "./Calendar/Year.ts";
import type { Month, MonthInfo } from "./Calendar/Month.ts";
import type { Day, DayInfo } from "./Calendar/Day.ts";

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

  #_yearInfo: YearInfo<Y> | undefined;
  get #yearInfo() {
    return this.#_yearInfo ??= yearOfDayIndex(this.dayIndex, this.calendar);
  }

  get year() {
    return this.#yearInfo.year;
  }

  // # ==== Month ====

  #_monthInfo: MonthInfo<M> | undefined;
  get #monthInfo() {
    return this.#_monthInfo ??= monthOfDayIndex(this.#yearInfo, this.dayIndex, this.calendar);
  }
  
  get month() {
    return this.#monthInfo.month;
  }

  // # ==== Day ====

  #_dayInfo: DayInfo<D> | undefined;
  get #dayInfo() {
    return this.#_dayInfo ??= dayOfDayIndex(this.#yearInfo, this.#monthInfo, this.dayIndex, this.calendar);
  }

  get day() {
    return this.#dayInfo.day;
  }

  protected constructor(dayIndex: DayIndex, calendar: Calendar<Y, M, D>, [year, month, day]: [yearInfo: YearInfo<Y> | undefined, monthInfo: MonthInfo<M> | undefined, dayInfo: DayInfo<D> | undefined] = [undefined, undefined, undefined]) {
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

function yearOfDayIndex<Y extends Year, M extends Month, D extends Day>(dayIndex: DayIndex, calendar: Calendar<Y, M, D>): YearInfo<Y> {
  if (calendar.yearOf) {
    return calendar.yearOf(dayIndex);
  }

  if (calendar.years == null) {
    throw new Error("カレンダーが不正です。このカレンダーには年を取得するメソッドが1つも実装されていません。")
  }

  let lastYearInfo: YearInfo<Y> | undefined;

  for (const year of calendar.years()) {
    if (year.startDayIndex > dayIndex) {
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

function monthOfDayIndex<Y extends Year, M extends Month, D extends Day>(yearInfo: YearInfo<Y>, dayIndex: DayIndex, calendar: Calendar<Y, M, D>): MonthInfo<M> {
  if (calendar.monthOf) {
    return calendar.monthOf(dayIndex, yearInfo);
  }

  if (calendar.monthsOf == null) {
    throw new Error("カレンダーが不正です。このカレンダーには月を取得するメソッドが1つも実装されていません。");
  }

  let lastMonthInfo: MonthInfo<M> | undefined;

  for (const month of calendar.monthsOf(yearInfo)) {
    if (month.startDayIndex > dayIndex) {
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

function dayOfDayIndex<Y extends Year, M extends Month, D extends Day>(yearInfo: YearInfo<Y>, monthInfo: MonthInfo<M>, dayIndex: DayIndex, calendar: Calendar<Y, M, D>): DayInfo<D> {
  if (calendar.dayOf) {
    return calendar.dayOf(dayIndex, yearInfo, monthInfo);
  }

  if (calendar.daysOf == null) {
    throw new Error("カレンダーが不正です。このカレンダーには日を取得するメソッドが1つも実装されていません。");
  }

  let lastDayInfo: DayInfo<D> | undefined;

  for (const day of calendar.daysOf(yearInfo, monthInfo)) {
    if (day.startDayIndex > dayIndex) {
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