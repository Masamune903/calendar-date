/**
 * プロレプティック グレゴリオ暦(先発グレゴリオ暦)における、日付のインデックス（1年1月1日からの経過日数）。
 * 1年1月1日を0とする。
 */
export type DayIndex = number;

export interface DayIndexedDate {
  readonly dayIndex: DayIndex;
}