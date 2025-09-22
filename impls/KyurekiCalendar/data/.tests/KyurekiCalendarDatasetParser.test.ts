import { assertEquals } from "@std/assert/equals";
import { KyurekiCalendarDatasetParser } from "../KyurekiCalendarDatasetParser.ts";
import { KyurekiYear } from "../../KyurekiYear.ts";
import { ISOCalendarDate } from "../../../ISOCalendarDate/ISOCalendarDate.ts";
import { KyurekiMonth } from "../../KyurekiMonth.ts";
import { assertNotEquals } from "@std/assert";
import type { KyurekiCalendarDatasetData } from "../KyurekiCalendarDataset.ts";
import type { KyurekiCalendarDatasetFileData } from "../KyurekiCalendarDatasetFileData.ts";

// async function main() {
//   const parser = new KyurekiCalendarDatasetParser();
  
//   const fileDataStr = await Deno.readTextFile(new URL("../KyurekiCalendarDataset.json", import.meta.url));
//   const fileData = JSON.parse(fileDataStr) as import("../KyurekiCalendarDataset.d.ts").KyurekiCalendarDatasetFileData;

//   const dataset = parser.parse(fileData);

//   console.log(JSON.stringify(dataset, null, 2));
//   debugger;

// }
// main();


Deno.test("KyurekiCalendarDatasetParser", async (t) => {
  let dataset: KyurekiCalendarDatasetData;

  await t.step("parse", async () => {
    const parser = new KyurekiCalendarDatasetParser();
    const fileDataStr = await Deno.readTextFile(new URL("../KyurekiCalendarDataset.json", import.meta.url));
    const fileData = JSON.parse(fileDataStr) as KyurekiCalendarDatasetFileData;

    dataset = parser.parse(fileData);
  });

  await t.step("旧2025年7月1日 == 2025年8月23日", () => {
    assertEquals(
      // 旧暦2025年7月1日
      dataset
        .yearMonths.find(ym => ym.year.equals(new KyurekiYear(2025)))
          ?.months.flat().find(m => m.month.equals(new KyurekiMonth(7, false)))?.dayIndex,
      // 新暦2025年8月23日
      ISOCalendarDate.from([2025, 8, 23]).dayIndex,
    );
  });

  await t.step("旧2025年7月1日 != 2025年8月22日", () => {
    assertNotEquals(
      // 旧暦2025年7月1日
      dataset
        .yearMonths.find(ym => ym.year.equals(new KyurekiYear(2025)))
          ?.months.flat().find(m => m.month.equals(new KyurekiMonth(7, false)))?.dayIndex,
      // 新暦2025年8月22日
      ISOCalendarDate.from([2025, 8, 22]).dayIndex,
    );
  });

  await t.step("旧2025年閏6月1日 == 2025年7月25日", () => {
    assertEquals(
      // 旧暦2025年閏6月1日
      dataset
        .yearMonths.find(ym => ym.year.equals(new KyurekiYear(2025)))
          ?.months.flat().find(m => m.month.equals(new KyurekiMonth(6, true)))?.dayIndex,
      // 新暦2025年7月25日
      ISOCalendarDate.from([2025, 7, 25]).dayIndex,
    );
  });

});