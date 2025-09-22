import { ISOCalendarDate } from "./ISOCalendarDate.ts";

const date = ISOCalendarDate.from(730730);  // 2001年9月3日
console.log(date.year.number);
console.log(date.month.number);
console.log(date.day.number);
console.log(ISOCalendarDate.from(date))

ISOCalendarDate.from([1, 1, 1]).dayIndex;