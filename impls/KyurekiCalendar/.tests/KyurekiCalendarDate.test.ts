import { assertEquals } from "@std/assert/equals";
import { ISOCalendarDate } from "../../ISOCalendarDate/ISOCalendarDate.ts";
import { KyurekiCalendarDate } from "../KyurekiCalendarDate.ts";
import { CachedKoyomiAPIClient } from "../data_creator/KoyomiAPIClient/CachedKoyomiAPIClient.ts";
import { compareKyurekiYMD } from "../KyurekiCalendar.ts";
import { KyurekiYear } from "../KyurekiYear.ts";
import { KyurekiMonth } from "../KyurekiMonth.ts";
import { KyurekiDay } from "../KyurekiDay.ts";

// # =================================================================
// # 1800年
// # =================================================================

// ## 1800年1月

Deno.test("KyurekiCalendarDate - 旧1800/01/01 (最小値)", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 1, false, 1]).dayIndex,
    ISOCalendarDate.from([1800, 1, 25]).dayIndex
  );
});

Deno.test("KyurekiCalendarDate - 旧1800/01/30", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 1, false, 30]).dayIndex,
    ISOCalendarDate.from([1800, 2, 23]).dayIndex
  );
});

// ## 1800年2月

Deno.test("KyurekiCalendarDate - 旧1800/02/01", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 2, false, 1]).dayIndex,
    ISOCalendarDate.from([1800, 2, 24]).dayIndex
  );
});

Deno.test("KyurekiCalendarDate - 旧1800/02/29", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 2, false, 29]).dayIndex,
    ISOCalendarDate.from([1800, 3, 24]).dayIndex
  );
});

// ## 1800年3月

Deno.test("KyurekiCalendarDate - 旧1800/03/01", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 3, false, 1]).dayIndex,
    ISOCalendarDate.from([1800, 3, 25]).dayIndex
  );
});

Deno.test("debug KyurekiCalendarDate - 旧1800/03/30", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 3, false, 30]).dayIndex,
    ISOCalendarDate.from([1800, 4, 23]).dayIndex
  );
});

// ## 1800年4月 (閏4月あり)

Deno.test("debug KyurekiCalendarDate - 旧1800/04/01", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 4, false, 1]).dayIndex,
    ISOCalendarDate.from([1800, 4, 24]).dayIndex
  );
});

Deno.test("debug KyurekiCalendarDate - 旧1800/04/30", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 4, false, 30]).dayIndex,
    ISOCalendarDate.from([1800, 5, 23]).dayIndex
  );
});

// ## 1800年閏4月

Deno.test("debug KyurekiCalendarDate - 旧1800/閏04/01", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 4, true, 1]).dayIndex,
    ISOCalendarDate.from([1800, 5, 24]).dayIndex
  );
});

Deno.test("KyurekiCalendarDate - 旧1800/閏04/30", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 4, true, 29]).dayIndex,
    ISOCalendarDate.from([1800, 6, 21]).dayIndex
  );
});

// ## 1800年5月

Deno.test("KyurekiCalendarDate - 旧1800/5/01", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 5, false, 1]).dayIndex,
    ISOCalendarDate.from([1800, 6, 22]).dayIndex
  );
});

// ## 1800年12月

Deno.test("KyurekiCalendarDate - 旧1800/12/29", () => {
  assertEquals(
    KyurekiCalendarDate.from([1800, 12, false, 29]).dayIndex,
    ISOCalendarDate.from([1801, 2, 12]).dayIndex
  );
})

// # =================================================================
// # 1801年
// # =================================================================

Deno.test("KyurekiCalendarDate - 旧1801/01/01", () => {
  assertEquals(
    KyurekiCalendarDate.from([1801, 1, false, 1]).dayIndex,
    ISOCalendarDate.from([1801, 2, 13]).dayIndex
  );
});

// # =================================================================
// # 全ての年
// # =================================================================

/*
KoyomiAPIからのデータを前から順に、ISOCalendarDate().dayIndex === KyurekiCalendarDate(kyurekiY, kyurekiM, kyurekiD).dayIndex と比較する
*/
Deno.test("[HEAVY - 58s] KyurekiCalendarDate -> DayIndex - all", async () => {
  const { min, max } = KyurekiCalendarDate.calendar;
  const apiClient = new CachedKoyomiAPIClient(1000);

  let last = { kyurekiy: -Infinity, kyurekim: Infinity, kyurekid: Infinity };
  let lastMonthNumber = Infinity;
  for (let year = min.year.number; year <= max.year.number; year++) {
    const dates = await apiClient.fetchYearDates(year);

    for (const [isoDateStr, date] of dates.entries()) {
      try {
        if (last.kyurekid > date.kyurekid) {
          // 月が変わった
          lastMonthNumber = last.kyurekim;
        }

        const isLeapMonth = date.kyurekim == lastMonthNumber;
        const apiKyurekiYMD = {
          year: new KyurekiYear(date.kyurekiy),
          month: new KyurekiMonth(date.kyurekim, isLeapMonth),
          day: new KyurekiDay(date.kyurekid),
        };

        if (compareKyurekiYMD(apiKyurekiYMD, min) < 0
          || compareKyurekiYMD(apiKyurekiYMD, max) > 0
        ) {
          continue;
        }

        const kyurekiDate = KyurekiCalendarDate.from([date.kyurekiy, date.kyurekim, isLeapMonth, date.kyurekid]);
        const isoDate = ISOCalendarDate.fromDate(new Date(isoDateStr));
        assertEquals(
          kyurekiDate.dayIndex,
          isoDate.dayIndex,
          `旧暦${date.kyurekiy}年${isLeapMonth ? "閏" : ""}${date.kyurekim}月${date.kyurekid}日 == 新暦${isoDate.year}年${isoDate.month}月${isoDate.day}日`
        );
        
        if (kyurekiDate.day.number === 1) {
          console.log(`旧暦${date.kyurekiy}年${isLeapMonth ? "閏" : ""}${date.kyurekim}月${date.kyurekid}日 == 新暦${isoDate.year}年${isoDate.month}月${isoDate.day}日`);
        }

        last = date;
      } catch (e) {
        throw new Error(`旧暦${date.kyurekiy}年${date.kyurekim}月${date.kyurekid}日 (ISO: ${isoDateStr}) の実行でエラーが発生しました: ${e}`, { cause: e });
      }
    }
  }
});

/*
KoyomiAPIからのデータを前から順に、KyurekiCalendarDate.from(dayIndex++) と比較する
*/
Deno.test("[HEAVY - 45s] DayIndex -> KyurekiCalendarDate - all", async () => {
  const { min, max } = KyurekiCalendarDate.calendar;
  const apiClient = new CachedKoyomiAPIClient(1000);

  let dayIndex = min.dayIndex;
  for (let year = min.year.number; year <= max.year.number; year++) {
    const dates = await apiClient.fetchYearDates(year);
    for (const [isoDateStr, date] of dates.entries()) {
      try {
        const apiKyurekiYMD = {
          year: new KyurekiYear(date.kyurekiy),
          month: new KyurekiMonth(date.kyurekim, false),
          day: new KyurekiDay(date.kyurekid),
        };

        if (compareKyurekiYMD(apiKyurekiYMD, min) < 0
          || compareKyurekiYMD(apiKyurekiYMD, max) > 0
        ) {
          continue;
        }

        // 旧暦の日付の検証
        const kyurekiDate = KyurekiCalendarDate.from(dayIndex);
        assertEquals(kyurekiDate.year.number, date.kyurekiy, `dayIndex=${dayIndex} の年が一致しません。`);
        assertEquals(kyurekiDate.month.number, date.kyurekim, `dayIndex=${dayIndex} の月が一致しません。`);
        assertEquals(kyurekiDate.day.number, date.kyurekid, `dayIndex=${dayIndex} の日が一致しません。`);

        // 進捗状況の出力
        if (kyurekiDate.day.number === 1) {
          console.log(`dayIndex=${dayIndex} == 旧暦${date.kyurekiy}年${date.kyurekim}月${date.kyurekid}日`);
        }

        dayIndex++;
      } catch (e) {
        throw new Error(`旧暦${date.kyurekiy}年${date.kyurekim}月${date.kyurekid}日 (ISO: ${isoDateStr}) の実行でエラーが発生しました: ${e}`, { cause: e });
      }
    }
  }
});