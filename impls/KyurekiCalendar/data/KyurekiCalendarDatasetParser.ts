import type { DayIndex } from "../../../DayIndex/DayIndex.ts";
import type { 
  KyurekiCalendarDatasetData as KCD,
  KyurekiCalendarDatasetYear as KCDYear,
  KyurekiCalendarDatasetYearMonth as KCDYearMonth
} from "../data/KyurekiCalendarDataset.ts";
import { KyurekiMonth } from "../KyurekiMonth.ts";
import { KyurekiYear } from "../KyurekiYear.ts";
import type { 
  KyurekiCalendarDatasetFileData as KCDFD,
  KyurekiCalendarDatasetFileDataYear as KCDFDYear,
  KyurekiCalendarDatasetFileDataYearMonth as KCDFDYearMonth
} from "./KyurekiCalendarDatasetFileData.ts";

export class KyurekiCalendarDatasetParser {
  parse(fileData: KCDFD): KCD {
    const [startDayIndex, startYear, yearMonths] = [fileData[0], new KyurekiYear(fileData[1]), fileData[2]];

    let currentYearDayIndex = startDayIndex;
    return { 
      startDayIndex, startYear, 
      yearMonths: yearMonths.map((yearInfo, yearIndex) => {
        const [year, nextYearDayIndex] = this.#parseYear(yearInfo, new KyurekiYear(startYear.number + yearIndex), currentYearDayIndex);
        currentYearDayIndex = nextYearDayIndex;
        return year;
      })
    };
  }

  #parseYear(yearData: KCDFDYear, year: KyurekiYear, dayIndex: DayIndex): [year: KCDYear, nextYearDayIndex: DayIndex] {
    let monthDayIndex = dayIndex;
    
    const result = {
      year, dayIndex,
      months: yearData
        .map((monthData, monthIndex) => {
        const [result, nextMonthDayIndex] = this.#parseYearMonth(monthData, year, monthIndex + 1, monthDayIndex);
        monthDayIndex = nextMonthDayIndex;
        return result;
      })
    };

    return [result, monthDayIndex];
  }

  /**
   * 月※のファイルデータ(日数)から月の情報をまとめる。
   * ※年月が等しい閏月は配列
   * @param monthData 
   * @param year 
   * @param monthValue 
   * @returns 月の情報（年月が等しい閏月は合わせる)
   */
  #parseYearMonth(monthData: KCDFDYearMonth, _year: KyurekiYear, monthValue: number, monthStartDayIndex: DayIndex): [KCDYearMonth[], nextMonthDayIndex: DayIndex] {
    const monthArray = Array.isArray(monthData) ? monthData : [monthData];

    let currentDayIndex = monthStartDayIndex;
    const result = monthArray.map((dayQty, sameMonthIndex): KCDYearMonth => {
      const result: KCDYearMonth = {
        month: new KyurekiMonth(monthValue, sameMonthIndex > 0),
        dayIndex: currentDayIndex,
        dayQty
      };

      currentDayIndex += dayQty;
      return result;
    });

    return [result, currentDayIndex];
  }
}