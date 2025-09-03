import { assertEquals } from "@std/assert/equals";

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function daysInYear(year: number) {
  return isLeapYear(year) ? 366 : 365;
}

function daysFromYearStart(year: number, month: number, day: number): number {
  const monthLengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let days = 0;
  for (let m = 0; m < month - 1; m++) {
    days += monthLengths[m];
  }
  return days + (day - 1); // その年の 1月1日を0日目とする
}

export function dayIndexOfYMD(year: number, month: number, day: number): number {
  // 1年から year-1年までの総日数
  let days = 0;
  for (let y = 1; y < year; y++) {
    days += daysInYear(y);
  }
  // year年内の日数
  days += daysFromYearStart(year, month, day);
  return days;
}

type KnownDaysIndex = {
  readonly ymd: [year: number, month: number, day: number];
  readonly dayIndex: number;
  readonly expected: number;
};

export const knownDayIndexes = {
  get(key: string) {
    const value = this.dataset.get(key);
    if (value == null) throw new Error(`Unknown date: ${key}`);
    return value;
  },
  [Symbol.iterator]() {
    return this.dataset.entries();
  },
  dataset: new Map<string, KnownDaysIndex>([
    ["1/1/1", { ymd: [1, 1, 1], dayIndex: dayIndexOfYMD(1, 1, 1), expected: 0 }],
    ["1/1/31", { ymd: [1, 1, 31], dayIndex: dayIndexOfYMD(1, 1, 31), expected: 30 }],
    ["1/2/1", { ymd: [1, 2, 1], dayIndex: dayIndexOfYMD(1, 2, 1), expected: 31 }],
    ["1/2/28", { ymd: [1, 2, 28], dayIndex: dayIndexOfYMD(1, 2, 28), expected: 58 }],
    ["1/3/1", { ymd: [1, 3, 1], dayIndex: dayIndexOfYMD(1, 3, 1), expected: 59 }],
    ["1/12/31", { ymd: [1, 12, 31], dayIndex: dayIndexOfYMD(1, 12, 31), expected: 364 }],
    ["2/1/1", { ymd: [2, 1, 1], dayIndex: dayIndexOfYMD(2, 1, 1), expected: 365 }],
    ["4/2/28", { ymd: [4, 2, 28], dayIndex: dayIndexOfYMD(4, 2, 28), expected: 1153 }],
    ["4/2/29", { ymd: [4, 2, 29], dayIndex: dayIndexOfYMD(4, 2, 29), expected: 1154 }],
    ["4/3/1", { ymd: [4, 3, 1], dayIndex: dayIndexOfYMD(4, 3, 1), expected: 1155 }],
    ["100/2/28", { ymd: [100, 2, 28], dayIndex: dayIndexOfYMD(100, 2, 28), expected: 36217 }],
    ["100/3/1", { ymd: [100, 3, 1], dayIndex: dayIndexOfYMD(100, 3, 1), expected: 36218 }],
    ["2001/9/3", { ymd: [2001, 9, 3], dayIndex: dayIndexOfYMD(2001, 9, 3), expected: 730730 }],
  ])
};

for (const [, { dayIndex, expected }] of knownDayIndexes) {
  assertEquals(dayIndex, expected);
}