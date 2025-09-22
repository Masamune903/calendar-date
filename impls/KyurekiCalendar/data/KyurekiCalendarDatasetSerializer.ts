import type { KyurekiCalendarDatasetRaw } from "../data_creator/KyurekiCalendarDatasetCreator.ts";
import type { KyurekiCalendarDatasetFileData } from "./KyurekiCalendarDatasetFileData.ts";

export class KyurekiCalendarDatasetSerializer {
  serialize(dataset: KyurekiCalendarDatasetRaw): KyurekiCalendarDatasetFileData {
    const yearMonthInfosTotalMini: KyurekiCalendarDatasetFileData = [
      dataset.startDayIndex,
      dataset.startYear.number,
      dataset.yearMonths.map(({ months }) => 
        Map.groupBy(months, ({ month }) => month.number)
          .entries().toArray()
          .sort(([monthAValue, ], [monthBValue, ]) => monthAValue - monthBValue)
          .map(([, monthInfos]) => monthInfos.map(monthInfo => monthInfo.dayQty))
          .map(monthDays => monthDays.length === 1 ? monthDays[0] : monthDays)
      ),
    ];

    return yearMonthInfosTotalMini;
  }
  
}