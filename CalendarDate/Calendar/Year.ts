import type { DayIndex } from "../../DayIndex/DayIndex.ts";

/**
 * 単に年としての値を表す抽象クラス
 */
export abstract class Year {
  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  toString() {
    return `${this.value}`;
  }

  toLocaleString(locale: string, options?: Pick<Intl.DateTimeFormatOptions, "year">) {
    const defaultOptions: Intl.DateTimeFormatOptions = { year: "numeric" };

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(`${this.value}-1-1`));
  }

  equals(other: unknown): boolean {
    if (!(other instanceof Year)) return false;
    return this.value === other.value;
  }
}

export abstract class YearInfo<Y extends Year = Year> {
  readonly year: Y;
  readonly startDayIndex: DayIndex;

  constructor(year: Y, startDayIndex: DayIndex) {
    this.year = year;
    this.startDayIndex = startDayIndex;
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
    return `${this.isLeap ? "bis" : ""}${this.value}`;
  }

  override equals(other: unknown): boolean {
    return other instanceof PossiblyLeapYear 
      && super.equals(other) && this.isLeap === other.isLeap;
  }
}

export abstract class PossiblyLeapYearInfo<Y extends PossiblyLeapYear = PossiblyLeapYear> extends YearInfo<Y> {
  readonly isLeap: boolean;

  constructor(value: Y, startDayIndex: DayIndex, isLeap: boolean) {
    super(value, startDayIndex);
    this.isLeap = isLeap;
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
export function* createYearItrFromDayQtys<Y extends YearByDayQty, R extends YearInfo<Year>>(yearsByDayQty: YearsByDayQty<Y>, createYear: (data: Y, startDayIndex: DayIndex) => R): Iterable<R> {
  let dayIndex = yearsByDayQty.startDayIndex;

  for (const year of yearsByDayQty.years) {
    yield createYear(year, dayIndex);
    dayIndex += year.dayQty;
  }
}

/* example

const yearsByDayQty: YearsByDayQty = {
  startDayIndex: 0,
  years: [
    { yearValue: 2020, dayQty: 366 },
    { yearValue: 2021, dayQty: 365 },
    { yearValue: 2022, dayQty: 365 },
  ],
};

const createdYears = createYearItrFromDayQtys(yearsByDayQty, (data, startDayIndex) =>
  new Year(data.yearValue, startDayIndex)
);

const yearsByDayQty: YearsByDayQty = {
  startDayIndex: 0,
  years: (function* () {
    for (let yearValue = 1; ; yearValue++) {
      yield { yearValue, dayQty: (yearValue % 4 === 0 && yearValue % 100 !== 0) || (yearValue % 400 === 0) ? 366 : 365 };
    }
  })()
};

*/