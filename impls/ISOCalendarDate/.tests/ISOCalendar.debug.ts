import { assertEquals } from "@std/assert/equals";
import { ISOCalendarDate } from "../ISOCalendarDate.ts";

const date = ISOCalendarDate.from(1460);
console.log(date.toString());

// const date_0004_12_29 = ISOCalendarDate.from(1458);
// const date_0004_12_30 = ISOCalendarDate.from(1459);
// const date_0004_12_31 = ISOCalendarDate.from(1460);
// const date_0005_01_01 = ISOCalendarDate.from(1461);
// const date_0005_01_02 = ISOCalendarDate.from(1462);

// console.log("4/12/29:", date_0004_12_29.toString());
// console.log("4/12/30:", date_0004_12_30.toString());
// console.log("4/12/31:", date_0004_12_31.toString());
// console.log("5/01/01:", date_0005_01_01.toString());
// console.log("5/01/02:", date_0005_01_02.toString());




// const maxDateTime = new Date("2000-01-01").getTime();

// let isoDate = ISOCalendarDate.from([1900, 1, 1]);
// for (let date = new Date("1900-01-01T00:00:00"); date.getTime() <= maxDateTime; date = new Date(date.setDate(date.getDate() + 1))) {
//   const datedISODate = isoDate.toDate();
//   assertEquals(datedISODate.toString(), date.toString());
//   assertEquals(datedISODate.getTime(), date.getTime());
//   assertEquals([isoDate.year.value, isoDate.month.value, isoDate.day.value], [date.getFullYear(), date.getMonth() + 1, date.getDate()]);

//   isoDate = ISOCalendarDate.from(isoDate.dayIndex + 1);
// }