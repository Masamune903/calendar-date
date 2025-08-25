export class Week {
  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  toString() {
    return `Week ${this.value}`;
  }
}