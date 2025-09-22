import { ISOCalendarDate, KyurekiCalendarDate } from "@amgm-masamune/japanese-date";

// 2025年9月22日
const isoDate = ISOCalendarDate.from([2025, 9, 22]);

// 旧2025年8月1日
const kyurekiDate  = KyurekiCalendarDate.from(isoDate);
console.log(kyurekiDate.toString());
console.log(kyurekiDate.rokuyo.name); // 先勝
console.log(kyurekiDate.month.alias);  // 葉月