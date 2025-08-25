import { Era } from "./Era.ts";

export class Year {
  readonly era: Era;
  readonly value: number;
  readonly dayQty: number;

  constructor(value: number, dayQty: number, era: Era) {
    this.value = value;
    this.dayQty = dayQty;
    this.era = era;
  }

  toString() {
    return `${this.value}`;
  }

  toLocaleString(locale: string, options?: Intl.DateTimeFormatOptions) {
    const defaultOptions: Intl.DateTimeFormatOptions = { year: "numeric", ...options };

    return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(this.value));
  }
}
