import type { Year, YearInfo } from "../Calendar/Year.ts";
import type { Month, MonthInfo } from "../Calendar/Month.ts";
import type { Day, DayInfo } from "../Calendar/Day.ts"
import type { DayIndex } from "../../DayIndex/DayIndex.ts";

export interface Calendar<
  Y extends Year,
  M extends Month,
  D extends Day
> {
  readonly startDayIndex: DayIndex;

  yearOf?(dayIndex: DayIndex): YearInfo<Y>;
  
  years?(): IterableIterator<YearInfo<Y>>;
  
  monthOf?(dayIndex: DayIndex, year: YearInfo<Y>): MonthInfo<M>;
  
  monthsOf?(year: YearInfo<Y>): IterableIterator<MonthInfo<M>>;

  dayOf?(dayIndex: DayIndex, year: YearInfo<Y>, month: MonthInfo<M>): DayInfo<D>;

  daysOf?(year: YearInfo<Y>, month: MonthInfo<M>): IterableIterator<DayInfo<D>>;

  dayIndexOf(year: Y, month: M, day: D): DayIndex;

  equals(other: unknown): boolean;
}

export class CalendarOutOfRangeError extends Error {
  override readonly name = "CalendarOutOfRangeError";
  
  constructor(message: string) {
    super(message);
  }
}