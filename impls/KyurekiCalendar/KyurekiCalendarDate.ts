import { CalendarDate, type CalendarDateLike } from "../../CalendarDate/CalendarDate.ts";
import type { DayIndex } from "../../DayIndex/DayIndex.ts";
import { ArrayUtil } from "../../Util/ArrayUtil.ts";
import { compareKyurekiYMD, KyurekiCalendar } from "./KyurekiCalendar.ts";
import { KyurekiDay } from "./KyurekiDay.ts";
import { KyurekiMonth } from "./KyurekiMonth.ts";
import { KyurekiRokuyo } from "./KyurekiRokuyo.ts";
import { KyurekiYear } from "./KyurekiYear.ts";

type KyurekiCalendarDateLike = CalendarDateLike<KyurekiYear, KyurekiMonth, KyurekiDay> | 
  [year: KyurekiYear, month: KyurekiMonth, day: KyurekiDay] |
  [year: number, month: number, isLeap: boolean, day: number] | {
    readonly year: number;
    readonly month: number;
    readonly isLeap: boolean;
    readonly day: number;
  };

export class KyurekiCalendarDate extends CalendarDate<KyurekiYear, KyurekiMonth, KyurekiDay> {
  static readonly calendar = KyurekiCalendar.instance;

  get rokuyo(): KyurekiRokuyo {
    return new KyurekiRokuyo((this.month.number + this.day.number - 2) % 6);
  }

  protected constructor(dayIndex: DayIndex) {
    super(dayIndex, KyurekiCalendar.instance);
  }

  override toString(): string {
    const yearNumber = this.year.number;
    const monthLeap = this.month.isLeap ? " (leap)" : "";
    const monthNumber = this.month.number;
    const dayNumber = this.day.number;
    return `KyurekiCalendarDate { ${this.dayIndex} "${yearNumber}-${monthNumber}${monthLeap}-${dayNumber}" }`;
  }

  static from(like: KyurekiCalendarDateLike): KyurekiCalendarDate {
    if (typeof like === "number") {
      return new KyurekiCalendarDate(like);
    }
    if ("dayIndex" in like) {
      return new KyurekiCalendarDate(like.dayIndex);
    }

    const [year, month, day] = 
      (ArrayUtil.isArray(like) 
        ? like.length === 3 
          ? [like[0], like[1], like[2]] 
          : [new KyurekiYear(like[0]), new KyurekiMonth(like[1], like[2]), new KyurekiDay(like[3])]
        : "isLeap" in like
          ? [new KyurekiYear(like.year), new KyurekiMonth(like.month, like.isLeap), new KyurekiDay(like.day)]
          : [like.year, like.month, like.day]);

    this.validateYMDRange(year, month, day);

    const { dayIndex } = super.fromYMD({ year, month, day }, KyurekiCalendar.instance);
    
    return new KyurekiCalendarDate(dayIndex);
  }

  private static validateYMDRange(year: KyurekiYear, month: KyurekiMonth, day: KyurekiDay) {
    if (
      compareKyurekiYMD({ year, month, day }, this.calendar.min) < 0 ||
      compareKyurekiYMD({ year, month, day }, this.calendar.max) > 0
    ) {
      throw new RangeError(`The date ${year}-${month}-${day} is out of range of this calendar.`);
    }

    if (month.number < 1 || 12 < month.number) {
      throw new RangeError(`The month ${month.number} is out of range of this calendar.`);
    }
    
    if (day.number < 1 || 30 < day.number) {
      throw new RangeError(`The day ${day.number} is out of range of this calendar.`);
    }
  }
}