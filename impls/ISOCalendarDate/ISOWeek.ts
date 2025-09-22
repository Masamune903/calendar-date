export class ISOWeek {
  readonly number: number;

  get name(): string {
    return weekNames["ja-JP"](this);
  }

  constructor(number: number) {
    if (number < 1 || number > 53) {
      throw new RangeError("Week must be between 1 and 53.");
    }
    this.number = number;
  }

  equals(other: unknown): boolean {
    return other instanceof ISOWeek && this.number === other.number;
  }

  toString(): string {
    return `ISOWeek { ${this.number} }`;
  }
}

const weekNames = {
  "ja-JP": (week: ISOWeek) => `${week.number}週`,
  "en-US": (week: ISOWeek) => `Week ${week.number}`,
};

export class ISODayOfWeek {
  static readonly SUNDAY: ISODayOfWeek = new ISODayOfWeek(0);
  static readonly MONDAY: ISODayOfWeek = new ISODayOfWeek(1);
  static readonly TUESDAY: ISODayOfWeek = new ISODayOfWeek(2);
  static readonly WEDNESDAY: ISODayOfWeek = new ISODayOfWeek(3);
  static readonly THURSDAY: ISODayOfWeek = new ISODayOfWeek(4);
  static readonly FRIDAY: ISODayOfWeek = new ISODayOfWeek(5);
  static readonly SATURDAY: ISODayOfWeek = new ISODayOfWeek(6);

  /** 
   * インデックスは 0:Sun, 1:Mon, ..., 6:Sat
   * (内部で扱いやすい形)
   */
  readonly index: number;

  /**
   * 曜日番号は 1:Mon, 2:Tue, ..., 7:Sun
   * （人間が理解しやすい形）
   */
  get number(): number {
    return this.index || 7;
  }

  get shortName(): string {
    return shortNames["ja-JP"](this);
  }

  get name(): string {
    return names["ja-JP"](this);
  }

  constructor(index: number) {
    if (index < 0 || index > 6) {
      throw new RangeError("Day of week must be between 0 and 6.");
    }
    this.index = index;
  }

  equals(other: unknown): boolean {
    return other instanceof ISODayOfWeek && this.index === other.index;
  }

  toString(): string {
    return `ISODayOfWeek { ${this.number} "${this.name}" }`;
  }

  toLocaleString(locale: string, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(Date.UTC(2021, 0, 4 + (this.number - 1))); // 2021-01-04 is a Monday
    return date.toLocaleDateString(locale, { weekday: "long", ...options });
  }
}

const names = {
  "ja-JP": (dayOfWeek: ISODayOfWeek) => ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"][dayOfWeek.index],
  "en-US": (dayOfWeek: ISODayOfWeek) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayOfWeek.index],
};

const shortNames = {
  "ja-JP": (dayOfWeek: ISODayOfWeek) => ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek.index],
  "en-US": (dayOfWeek: ISODayOfWeek) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek.index],
};