import { ISOCalendarDate } from "../ISOCalendarDate/ISOCalendarDate.ts";
import { JPN_ERA_DATASET } from "./JpnEraDataset.ts";

export type JpnEraInfo = {
  readonly era: JpnEra;
  readonly startDate: ISOCalendarDate;
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

export class JpnEraISOCalendarDate extends ISOCalendarDate {
  #_eraInfo: JpnEraInfo | null | undefined;
  get #eraInfo() {
    if (this.#_eraInfo === undefined)
      this.#_eraInfo = (JPN_ERA_DATASET.find(era => era.startDate.dayIndex <= this.dayIndex) ?? null);

    return this.#_eraInfo;
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

    return this.year.value - this.#eraInfo.startDate.year.value + 1;
  }

  constructor(dayIndex: number) {
    super(dayIndex);
  }


}