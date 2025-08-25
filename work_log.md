# 作業記録

## 仕様変更

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
