import { ISOCalendarDate } from "./ISOCalendarDate.ts";

const date = ISOCalendarDate.from(730730);  // 2001年9月3日
console.log(date.year.value);
console.log(date.month.value);
console.log(date.day.value);
console.log(ISOCalendarDate.from(date))