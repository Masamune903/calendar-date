import type { DayIndex } from "../../../DayIndex/DayIndex.ts";
import { ISOCalendar } from "../../ISOCalendarDate/ISOCalendar.ts";
import { ISOCalendarDate } from "../../ISOCalendarDate/ISOCalendarDate.ts";
import { KyurekiMonth } from "../KyurekiMonth.ts";
import { KyurekiYear } from "../KyurekiYear.ts";
import { CachedKoyomiAPIClient } from "./KoyomiAPIClient/CachedKoyomiAPIClient.ts";
import type { KoyomiAPIDate } from "./KoyomiAPIClient/KoyomiAPIClient.ts";

type KyurekiYMD = {
  readonly kyurekiy: number;
  readonly kyurekim: number;
  readonly kyurekid: number;
};

/** 旧暦の情報源となるデータ(転送用) */
export type KyurekiCalendarDatasetRaw = {
  readonly startDayIndex: DayIndex;
  readonly startYear: KyurekiYear;
  readonly yearMonths: readonly KyurekiCalendarDatasetYearRaw[];
};

export type KyurekiCalendarDatasetYearRaw = {
  readonly dayIndex: DayIndex;
  readonly year: KyurekiYear;
  readonly months: readonly KyurekiCalendarDatasetYearMonthRaw[];
};

export type KyurekiCalendarDatasetYearMonthRaw = {
  readonly dayIndex: DayIndex;
  readonly month: KyurekiMonth;
  readonly dayQty: number;
};

export class KyurekiCalendarCreator {
  async create(startKyurekiYear: KyurekiYear, maxKyurekiYear: KyurekiYear): Promise<KyurekiCalendarDatasetRaw> {
    const koyomiAPI = new CachedKoyomiAPIClient(1000);

    const yearInfos: KyurekiCalendarDatasetYearRaw[] = [];
    let yearInfo!: KyurekiYearInfoDraft;
    let monthInfo!: KyurekiMonthInfoDraft;

    let lastDate: [dateYMD: KyurekiYMD, dateInfo: KoyomiAPIDate] | undefined = undefined;

    let startISODate: ISOCalendarDate | undefined = undefined;

    // 新暦の1年ごとにループ
    for (let isoYear = startKyurekiYear.number; isoYear < maxKyurekiYear.number; isoYear++) {
      // その年に含まれる日を取得
      const yearDates = await koyomiAPI.fetchYearDates(isoYear);

      // このループの新暦の年に含まれる日ごとにループ
      for (const [dateStr, dateInfo] of yearDates) {
        const { kyurekiy, kyurekim, kyurekid } = dateInfo;

        // # ==== データの開始日(startISODate)の設定 ====
        if (startISODate == null) {
          if (kyurekim === 1 && kyurekid === 1) {
            // ## 開始日を設定
            startISODate = ISOCalendarDate.from(parseISODateStr(dateStr));
            yearInfo = new KyurekiYearInfoDraft(startKyurekiYear, startISODate.dayIndex);
            monthInfo = new KyurekiMonthInfoDraft(new KyurekiMonth(1, false), startISODate.dayIndex);
          } else {
            // ## 開始日に達していない場合はスキップ
            continue;
          }
        }

        // # ==== 日付データの判定 ====

        // ## 旧暦年/月の変化を検出
        if (lastDate != null && lastDate[0].kyurekid > kyurekid) {
          // 日にちが戻ったら月初め。前の月の情報を確定させる
          yearInfo.addMonth(monthInfo.confirm());

          // 次の月の情報を準備
          monthInfo = monthInfo.nextMonth(kyurekim);

          if (lastDate[0].kyurekiy !== kyurekiy) {
            // 新しい年になったため、前の年の情報を確定させる
            yearInfos.push(yearInfo.confirm());

            yearInfo = new KyurekiYearInfoDraft(new KyurekiYear(kyurekiy), monthInfo.dayIndex);
          }
        }

        // ## 日数をカウント
        monthInfo.addDay();

        // ## 現在の日付情報を保存
        lastDate = [ { kyurekiy, kyurekim, kyurekid }, dateInfo ];
      }
    }

    return {
      startYear: startKyurekiYear,
      startDayIndex: startISODate!.dayIndex,
      yearMonths: yearInfos
    };
  }
}

class KyurekiYearInfoDraft {
  readonly year: KyurekiYear;
  readonly dayIndex: DayIndex;
  #months = new Map<string, KyurekiCalendarDatasetYearMonthRaw>();

  addMonth(monthInfo: KyurekiCalendarDatasetYearMonthRaw) {
    this.#validateMonthInfo(monthInfo);
    this.#months.set(monthInfo.month.toString(), monthInfo);
  }

  #validateMonthInfo(monthInfo: KyurekiCalendarDatasetYearMonthRaw) {
    if (!(monthInfo.dayQty >= 29 && monthInfo.dayQty <= 31)) {
      throw new RangeError(`The YearMonth ${monthInfo.month.number}${monthInfo.month.isLeap ? " (leap)" : ""} has invalid dayQty ${monthInfo.dayQty}.`);
    }

    const existing = this.#months.get(monthInfo.month.toString());
    if (existing) {
      throw new Error(`The YearMonth ${monthInfo.month.number}${monthInfo.month.isLeap ? " (leap)" : ""} is duplicated.`);
    }
  }
  
  confirm(): KyurekiCalendarDatasetYearRaw {
    return {
      dayIndex: this.dayIndex,
      year: this.year,
      months: [...this.#months.values()]
    };
  }

  constructor(year: KyurekiYear, dayIndex: DayIndex) {
    this.year = year;
    this.dayIndex = dayIndex;
  }
}

class KyurekiMonthInfoDraft {
  readonly month: KyurekiMonth;
  readonly dayIndex: DayIndex;
  #dayQty = 0;

  constructor(month: KyurekiMonth, dayIndex: DayIndex) {
    this.month = month;
    this.dayIndex = dayIndex;
  }

  addDay() {
    this.#dayQty++;
  }

  confirm() {
    return { month: this.month, dayIndex: this.dayIndex, dayQty: this.#dayQty };
  }

  nextMonth(nextMonthNumber: number) {
    if (!(1 <= nextMonthNumber && nextMonthNumber <= 12)) {
      throw new RangeError(`The month number ${nextMonthNumber} is out of range.`);
    }
    if (nextMonthNumber === this.month.number && this.month.isLeap) {
      throw new Error(`The month ${nextMonthNumber} cannot be leap twice in a row.`);
    }

    return new KyurekiMonthInfoDraft(
      new KyurekiMonth(nextMonthNumber, nextMonthNumber === this.month.number),
      this.dayIndex + this.#dayQty
    );
  }
}



function parseISODateStr(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day, calendar: ISOCalendar.instance };
}