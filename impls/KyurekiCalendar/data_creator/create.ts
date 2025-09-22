/*
deno run -A ./impls/KyurekiCalendar/data_creator/create.ts
*/

import type { KyurekiCalendarDatasetFileData } from "../data/KyurekiCalendarDatasetFileData.ts";
import { KyurekiCalendarDatasetSerializer } from "../data/KyurekiCalendarDatasetSerializer.ts";
import { KyurekiYear } from "../KyurekiYear.ts";
import { KyurekiCalendarCreator } from "./KyurekiCalendarDatasetCreator.ts";

async function main() {
  const startTime = performance.now();
  const creator = new KyurekiCalendarCreator();
  const result = await creator.create(new KyurekiYear(1800), new KyurekiYear(2200));

  const yearMonthInfosTotalMini = new KyurekiCalendarDatasetSerializer().serialize(result);

  console.log(yearMonthInfosTotalMini);
  await writeJSONFile(yearMonthInfosTotalMini);
  await writeMinFile(yearMonthInfosTotalMini);
  console.log("すべての処理が完了しました。:", ((performance.now() - startTime) / 1000).toFixed(2), "s");
}

async function writeJSONFile(yearMonthInfosTotalMini: KyurekiCalendarDatasetFileData) {
  await Deno.writeTextFile("impls/KyurekiCalendar/data/KyurekiCalendarDataset.json",
    `[\n\t${yearMonthInfosTotalMini[0]}, ${yearMonthInfosTotalMini[1]},\n\t[\n${
      yearMonthInfosTotalMini[2].map(monthInfos => `\t\t${JSON.stringify(monthInfos)}`).join(",\n")
    }\n\t]\n]`
  );
}

async function writeMinFile(yearMonthInfosTotalMini: KyurekiCalendarDatasetFileData) {
  const minJson = JSON.stringify(yearMonthInfosTotalMini);
  await Deno.writeTextFile("impls/KyurekiCalendar/data/KyurekiCalendarDataset.min.json", minJson);
}

main();

