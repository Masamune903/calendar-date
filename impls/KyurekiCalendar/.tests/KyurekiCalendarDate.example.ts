import { ISOCalendarDate } from "../../ISOCalendarDate/ISOCalendarDate.ts";
import { KyurekiCalendarDate } from "../KyurekiCalendarDate.ts";

function main() {
  Stopwatch.measure("kyurekiCalendarDate -> dayIndex 100万回", () => {
    for (let i = 0; i < 1_000_000; i++) {
      KyurekiCalendarDate.from([2198, 12, false, 29]).dayIndex;
    }
  });

  const date = ISOCalendarDate.from([2198, 12, 29]);
  Stopwatch.measure("dayIndex -> kyurekiCalendarDate 1,000,000", () => {
    for (let i = 0; i < 1_000_000; i++) {
      KyurekiCalendarDate.from(date.dayIndex).day;
    }
  });
}

class Stopwatch {
  readonly startTime: number;
  endTime?: number;
  readonly name?: string;

  constructor(name?: string) {
    this.startTime = performance.now();
    this.name = name;
  }

  end() {
    this.endTime = performance.now();
    console.log(`${this.name ?? "Stopwatch"}: ${this.endTime - this.startTime} ms`);
  }

  [Symbol.dispose]() {
    if (this.endTime !== undefined)
      return;

    this.end();
  }

  static measure<T>(name: string, func: () => T): T {
    const sw = new Stopwatch(name);
    const result = func();
    sw.end();
    return result;
  }
}

main();