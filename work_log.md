# 作業記録

## 仕様変更

### 日時の扱いの修正 修正後

- 年付 / 月付 / 日付 (CalendarYear, CalendarYearMonth, CalendarDate)

  特定の 年 / 年月 / 年月日 を表す(実際には単一の時間範囲で実装可能)
  旧 Info がこれにあたる。

  ```ts
  type CalendarYearMonth<Y extends Year, M extends Month> = {
    readonly dayIndex: DayIndex;
    readonly year: Y;
    readonly month: M;
  };
  ```

- 年月日の値（Year / Month / Day）

  年月 / 月付 / 日付 それぞれを表す、日付の構成要素の型付き値である。
  閏月の場合、このオブジェクトに付けられる。

- 年月日の期間（years: YearSpan / months: MonthSpan / days: DaySpan）

  何年間 / 何月間 / 何日間 を表す。
  負の数等も与えられる。
  このオブジェクト自体に閏月という概念はない（閏月を含めて何か月間）

### 現状

現在、実装のしやすさ故 年付/月付/日付 は info として別物になっている。

せめて、以下の対応をする。

- 名称をCalendar-に変更
- インタフェースの統一（startDayIndex -> dayIndex）
- クラスにすると別物になってしまうため、typeとすることで単なるエイリアスだということを強調

- Calendar の dayIndex -> YMD 変換

  ### 方法

  - *A. 候補となる year/month/day を返す Iterator から、合致するものを取得する方法*

    -> yearやdayでは非効率なため不採用。

    ```js

    class ISOCalendar {
      years() {
        return (function* () {
          let startDayIndex = 0;

          for (let yearValue = 1; ; yearValue++) {
            const year = new Year(yearValue, startDayIndex);
            yield year;

            startDayIndex += hasDay0229Year(year) ? 366 : 365;
          }
        })();
      }

      monthsOf(year: Year): IterableIterator<Month> {
        return (function* () {
          let startDayIndex = year.startDayIndex;

          for (let monthValue = 1; monthValue <= 12; monthValue++) {
            const month = new Month(monthValue, startDayIndex);
            yield month;

            startDayIndex += dayQtyInYearMonth(year, month);
          }
        })();
      }

      daysOf(year: Year, month: Month) {
        return (function* () {
          let startDayIndex = month.startDayIndex;

          for (let day = 1; ; day++) {
            if (hasDay0229Year(year) && month.value === 2 && day === 29) {
              yield new PossiblyLeapDay(day - 1, startDayIndex, true);
            } else {
              yield new PossiblyLeapDay(day, startDayIndex, false);
            }
            startDayIndex++;
          }
        })();
      }
    }

    ```

  - *B. dayIndexを渡し、対応するYMDを返す*

    -> 効率的だが、monthでは実装が大変。

  - *C. 一般的カレンダーに日付に特化したバージョン*

    year に関しては B, month に関しては A, day に関しては単に日付を数値にする
