import type { DayIndex } from "../../../DayIndex/DayIndex.ts";
import type { KyurekiMonth } from "../KyurekiMonth.ts";
import type { KyurekiYear } from "../KyurekiYear.ts";
import type { KyurekiCalendarDatasetFileData } from "./KyurekiCalendarDatasetFileData.ts";
import { KyurekiCalendarDatasetParser } from "./KyurekiCalendarDatasetParser.ts";

export type KyurekiCalendarDatasetData = {
  readonly startDayIndex: DayIndex;
  readonly startYear: KyurekiYear;
  readonly yearMonths: readonly KyurekiCalendarDatasetYear[];
};

/** 旧暦の年の情報 */
export type KyurekiCalendarDatasetYear = {
  readonly year: KyurekiYear;
  readonly dayIndex: DayIndex;
  readonly months: readonly KyurekiCalendarDatasetYearMonthLeapCombined[];
};

/** 旧暦の同じ月番号の月の情報（閏月はまとめている） */
export type KyurekiCalendarDatasetYearMonthLeapCombined = 
  KyurekiCalendarDatasetYearMonth | KyurekiCalendarDatasetYearMonth[];

/** 旧暦の月の情報 */
export type KyurekiCalendarDatasetYearMonth = {
  readonly month: KyurekiMonth;
  readonly dayIndex: DayIndex;
  readonly dayQty: number;
};

/** 旧暦の情報源となるデータ */
class KyurekiCalendarDataset {
  readonly startDayIndex: DayIndex;
  readonly startYear: KyurekiYear;
  readonly #yearMonths: readonly KyurekiCalendarDatasetYear[];
  
  /**
   * 指定した日付を持つ年の月情報を取得する。
   * @param dayIndex 取得したい日付の DayIndex
   * @return 年情報。存在しない場合は undefined
   */
  findYearByDayIndex(dayIndex: DayIndex): [KyurekiYear, DayIndex] | undefined {
    for (let yearIndex = 0; yearIndex < this.#yearMonths.length; yearIndex++) {
      const ym = this.#yearMonths[yearIndex];
      if (ym.dayIndex <= dayIndex && dayIndex < (this.#yearMonths[yearIndex + 1]?.dayIndex ?? Infinity)) {
        return [ym.year, dayIndex];
      }
    }
    return undefined;
  }

  /**
   * 指定した年の中にある日付を持つ月の情報を取得する。
   * @param year 取得したい日付を持つ年
   * @param dayIndex 取得したい日付の DayIndex
   * @return 月の情報。存在しない場合は undefined
   */
  findYearMonthByIndex(year: KyurekiYear, dayIndex: DayIndex): [KyurekiMonth, DayIndex] | undefined {
    const yearMonths = this.#yearMonths[year.number - this.startYear.number];
    if (!yearMonths) 
      return undefined;

    const yearMonthsFlatten = yearMonths.months.flat();
    for (let monthIndex = 0; monthIndex < yearMonthsFlatten.length; monthIndex++) {
      const mCombined = yearMonthsFlatten[monthIndex];
      if (mCombined.dayIndex <= dayIndex && dayIndex < (yearMonthsFlatten[monthIndex + 1]?.dayIndex ?? Infinity)) {
        return [mCombined.month, mCombined.dayIndex];
      }
    }
    return undefined;
  }

  getYearMonth(year: KyurekiYear, month: KyurekiMonth): KyurekiCalendarDatasetYearMonth | undefined {
    const monthCombined = this.#yearMonths
      ?.[year.number - this.startYear.number].months
      ?.[month.number - 1];

    if (Array.isArray(monthCombined)) {
      return monthCombined.find(m => m.month.isLeap === month.isLeap);
    }
    return monthCombined;
  }

  private constructor(
    startDayIndex: DayIndex,
    startYear: KyurekiYear,
    yearMonths: readonly KyurekiCalendarDatasetYear[]
  ) {
    this.startDayIndex = startDayIndex;
    this.startYear = startYear;
    this.#yearMonths = yearMonths;
  }

  static async fromFile() {
    const data = await Deno.readTextFile(new URL("./KyurekiCalendarDataset.min.json", import.meta.url));
    const fileData = JSON.parse(data) as KyurekiCalendarDatasetFileData;
    const { startDayIndex, startYear, yearMonths } = new KyurekiCalendarDatasetParser().parse(fileData);

    return new KyurekiCalendarDataset(
      startDayIndex, startYear, yearMonths
    );
  }
}

export const kyurekiCalendarDataset = await KyurekiCalendarDataset.fromFile();

export type { KyurekiCalendarDataset };