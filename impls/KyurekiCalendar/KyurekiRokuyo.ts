export class KyurekiRokuyo {
  /** 0～5 */
  readonly index: number;
  
  /** 1～6 */
  get number(): number {
    return this.index + 1;
  }

  get name(): string {
    return names["ja-JP"](this);
  }

  constructor(index: number) {
    if (index < 0 || index > 5) {
      throw new RangeError("Rokuyo index must be between 0 and 5.");
    }
    this.index = index;
  }

  toString(): string {
    return `KyurekiRokuyo { ${this.number} "${this.name}" }`;
  }

  equals(other: unknown): boolean {
    return other instanceof KyurekiRokuyo && this.index === other.index;
  }

}

const names = {
  "ja-JP": (rokuyo: KyurekiRokuyo) => ["先勝", "友引", "先負", "仏滅", "大安", "赤口"][rokuyo.index],
};