import { ISOCalendarDate } from "../../ISOCalendarDate/ISOCalendarDate.ts";
import { KyurekiCalendarDate } from "../KyurekiCalendarDate.ts";

function main() {
  const kyurekiDate = KyurekiCalendarDate.from([1800, 4, false, 1]).dayIndex;
  const isoDate = ISOCalendarDate.from([1800, 4, 24]).dayIndex;

  console.log({ kyurekiDate, isoDate });
  console.log(kyurekiDate === isoDate);
}

main();