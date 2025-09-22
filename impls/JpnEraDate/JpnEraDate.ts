import type { DayIndexedDate } from "../../DayIndex/DayIndex.ts";
import { ISOCalendarDate } from "../ISOCalendarDate/ISOCalendarDate.ts";
import { KyurekiCalendarDate } from "../KyurekiCalendar/KyurekiCalendarDate.ts";
import { JPN_ERA_DATASET } from "./data/JpnEraDataset.ts";

export type JpnEraInfo = {
  readonly era: JpnEra;
  readonly startDate: DayIndexedDate;
};

/*
type JpnEraISOCalendarYear は、JpnEraISOCalendarDate の一部。
  Unitとしては扱われない。
*/

export class JpnEra {
  readonly code: string;
  readonly name: string;

  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}

function findDateEra(date: DayIndexedDate) {
  return JPN_ERA_DATASET.find(era => era.startDate.dayIndex <= date.dayIndex) ?? null;
}

export class JpnEraISOCalendarDate extends ISOCalendarDate {
  protected fromDayIndex(date: DayIndexedDate): ISOCalendarDate {
    return ISOCalendarDate.from(date);
  }

  #_eraInfo: JpnEraInfo | null | undefined;
  get #eraInfo() {
    return this.#_eraInfo ??= findDateEra(this);
  }

  get era() {
    return this.#eraInfo?.era ?? null;
  }

  get eraName() {
    return this.era?.name ?? null;
  }

  get eraYear() {
    if (this.#eraInfo == null)
      return null;

    const startDate = this.fromDayIndex(this.#eraInfo.startDate);

    return this.year.number - startDate.year.number + 1;
  }

  constructor(dayIndex: number) {
    super(dayIndex);
  }
}


export class JpnEraKyurekiCalendarDate extends KyurekiCalendarDate {
  protected fromDayIndex(date: DayIndexedDate): KyurekiCalendarDate {
    return KyurekiCalendarDate.from(date);
  }

  #_eraInfo: JpnEraInfo | null | undefined;
  get #eraInfo() {
    return this.#_eraInfo ??= findDateEra(this);
  }

  get era() {
    return this.#eraInfo?.era ?? null;
  }

  get eraName() {
    return this.era?.name ?? null;
  }

  get eraYear() {
    if (this.#eraInfo == null)
      return null;

    const startDate = this.fromDayIndex(this.#eraInfo.startDate);

    return this.year.number - startDate.year.number + 1;
  }

  constructor(dayIndex: number) {
    super(dayIndex);
  }
}
