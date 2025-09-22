import { assertEquals } from "@std/assert/equals";
import { ISOCalendarDate } from "../ISOCalendarDate.ts";
import { ISOCalendar } from "../ISOCalendar.ts";
import { knownDayIndexes } from "./dayIndexOfYMD.ts";
import { ISODay } from "../ISODay.ts";
import { ISOMonth } from "../ISOMonth.ts";
import { ISOYear } from "../ISOYear.ts";

Deno.test("ISOCalendar # 1/1/1 (最初の日)", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(1), new ISOMonth(1), new ISODay(1)), knownDayIndexes.get("1/1/1").dayIndex); // dayIndex: 0
});

Deno.test("ISOCalendar # 1/1/31 (1か月)", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(1), new ISOMonth(1), new ISODay(31)), knownDayIndexes.get("1/1/31").dayIndex); // dayIndex: 30
});

Deno.test("ISOCalendar # 1/2/1 (1か月)", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(1), new ISOMonth(2), new ISODay(1)), knownDayIndexes.get("1/2/1").dayIndex); // dayIndex: 31
});

Deno.test("ISOCalendar # 1/2/28", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(1), new ISOMonth(2), new ISODay(28)), knownDayIndexes.get("1/2/28").dayIndex); // dayIndex: 59
});

Deno.test("ISOCalendar # 1/3/1", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(1), new ISOMonth(3), new ISODay(1)), knownDayIndexes.get("1/3/1").dayIndex); // dayIndex: 60
});

Deno.test("ISOCalendar # 1/12/31", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(1), new ISOMonth(12), new ISODay(31)), knownDayIndexes.get("1/12/31").dayIndex); // dayIndex: 365
});

Deno.test("ISOCalendar # 2/1/1", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(2), new ISOMonth(1), new ISODay(1)), knownDayIndexes.get("2/1/1").dayIndex); // dayIndex: 366
});

Deno.test("ISOCalendar # 4/2/28", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(4), new ISOMonth(2), new ISODay(28)), knownDayIndexes.get("4/2/28").dayIndex); // dayIndex: 1153
});

Deno.test("ISOCalendar # 4/2/29", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(4), new ISOMonth(2), new ISODay(29)), knownDayIndexes.get("4/2/29").dayIndex); // dayIndex: 1154
});

Deno.test("ISOCalendar # 4/3/1", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(4), new ISOMonth(3), new ISODay(1)), knownDayIndexes.get("4/3/1").dayIndex); // dayIndex: 1155
});

Deno.test("ISOCalendar # 100/2/28", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(100), new ISOMonth(2), new ISODay(28)), knownDayIndexes.get("100/2/28").dayIndex); // dayIndex: 36524
});

Deno.test("ISOCalendar # 100/3/1", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(100), new ISOMonth(3), new ISODay(1)), knownDayIndexes.get("100/3/1").dayIndex); // dayIndex: 36525
});

Deno.test("ISOCalendar # 2001/09/03", () => {
  assertEquals(ISOCalendar.instance.dayIndexOf(new ISOYear(2001), new ISOMonth(9), new ISODay(3)), knownDayIndexes.get("2001/9/3").dayIndex); // dayIndex: 730730
});

Deno.test("ISOCalendar unique 1/1/1 - 1000/12/31", () => {
  const seen = new Map<string, number>();
  const maxDayIndex = ISOCalendarDate.from([1000, 12, 31]).dayIndex;

  for (let dayIndex = 0; dayIndex <= maxDayIndex; dayIndex++) {
    const date = ISOCalendarDate.from(dayIndex);
    assertEquals(seen.has(date.toString()), false, `Duplicate date: ${date} (dayIndex: ${dayIndex})`);
    seen.set(date.toString(), dayIndex);
  }
});

Deno.test("ISOCalendar unique 1000/1/1 - 3000/12/31", () => {
  const stTime = performance.now();
  const seen = new Map<string, number>();
  const startDayIndex = ISOCalendarDate.from([1000, 1, 1]).dayIndex;
  const maxDayIndex = ISOCalendarDate.from([3000, 12, 31]).dayIndex;

  for (let dayIndex = startDayIndex; dayIndex <= maxDayIndex; dayIndex++) {
    const date = ISOCalendarDate.from(dayIndex);
    const dateStr = date.toString();
    assertEquals(seen.has(dateStr), false, `Duplicate date: ${date} (dayIndex: ${dayIndex})`);
    seen.set(dateStr, dayIndex);
  }

  console.log("test ended in", performance.now() - stTime, "ms");
});

Deno.test("ISOCalendarDate vs ISOCalendarDate", () => {
  const date = ISOCalendarDate.from(730730);
  assertEquals(date.dayIndex, 730730);
});

Deno.test("ISOCalendarDate vs ISOCalendarDate - from dayIndex", () => {
  const date = ISOCalendarDate.from(730730);  // 2001年9月3日
  assertEquals(date.year.number, 2001);
  assertEquals(date.month.number, 9);
  assertEquals(date.day.number, 3);
});

Deno.test("ISOCalendarDate vs ISOCalendarDate - from YMD (Tuple)", () => {
  const date = ISOCalendarDate.from([2001, 9, 3]);
  assertEquals(date.year.number, 2001);
  assertEquals(date.month.number, 9);
  assertEquals(date.day.number, 3);
});

Deno.test("ISOCalendarDate vs ISOCalendarDate - from YMD (Record)", () => {
  const date = ISOCalendarDate.from({ year: 2001, month: 9, day: 3 });
  assertEquals(date.year.number, 2001);
  assertEquals(date.month.number, 9);
  assertEquals(date.day.number, 3);
});

Deno.test("ISOCalendarDate vs ISOCalendarDate - must be equal", () => {
  const date = ISOCalendarDate.from(677736);
  assertEquals(date.dayIndex, ISOCalendarDate.from(date).dayIndex);
});

Deno.test("ISOCalendarDate vs native Date", () => {
  const date = ISOCalendarDate.from({ year: 2001, month: 9, day: 3 });
  const nativeDate = new Date(2001, 8, 3);
  assertEquals(date.year.number, nativeDate.getFullYear());
  assertEquals(date.month.number, nativeDate.getMonth() + 1);
  assertEquals(date.day.number, nativeDate.getDate());
});

Deno.test("ISOCalendar vs native Date - toDate()", () => {
  const date = ISOCalendarDate.from({ year: 2001, month: 9, day: 3 });
  const nativeDate = new Date(2001, 8, 3);
  assertEquals(date.toDate().getTime(), nativeDate.getTime());
});

Deno.test("ISOCalendarDate vs native Date - 1800-2200", () => {
  const stTime = performance.now();

  const maxDateTime = new Date("2200-01-01").getTime();

  let isoDate = ISOCalendarDate.from([1800, 1, 1]);
  for (let date = new Date("1800-01-01T00:00:00"); date.getTime() <= maxDateTime; date = new Date(date.setDate(date.getDate() + 1))) {
    const datedISODate = isoDate.toDate();
    assertEquals(datedISODate.toDateString(), date.toDateString());
    assertEquals([isoDate.year.number, isoDate.month.number, isoDate.day.number], [date.getFullYear(), date.getMonth() + 1, date.getDate()]);

    isoDate = ISOCalendarDate.from(isoDate.dayIndex + 1);
  }

  console.log("test ended in", performance.now() - stTime, "ms");
});