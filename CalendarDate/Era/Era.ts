export class Era {
  readonly name: string;
  readonly startDayIndex: number;

  constructor(name: string, startDayIndex: number) {
    this.name = name;
    this.startDayIndex = startDayIndex;
  }

  toString() {
    return `${this.name}`;
  }
}