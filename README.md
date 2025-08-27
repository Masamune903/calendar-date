# Calendar Date

## 概要

日本の和暦や旧暦の暦を扱えるようにした、日付に特化したモジュール（時刻は扱えない）。
また、Calendarインタフェースや周辺のクラスを実装することで、そのほかの暦に対応させることもできる。

## 特徴

- カレンダー (`interface Calendar`)
  
  暦の計算機能を持つ、暦そのもの。

  - yearOf(dayIndex: DayIndex): CalendarYear
    1. yearValue の算出
    2. その年の最初の日の dayIndex の算出
    3. その年の最初の日として返す
      new XxxDate(firstDayIndex, [year, 1, 1]);

## 日時の扱いの修正案

### 修正後

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
