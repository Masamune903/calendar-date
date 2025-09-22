import type { DayIndex } from "../../../DayIndex/DayIndex.ts";

export type KyurekiCalendarDatasetFileData = [
  startDayIndex: DayIndex,
  startYear: number,
  yearMonthDayQtys: KyurekiCalendarDatasetFileDataYear[]
];

export type KyurekiCalendarDatasetFileDataYear = KyurekiCalendarDatasetFileDataYearMonth[];

export type KyurekiCalendarDatasetFileDataYearMonth = number | number[];