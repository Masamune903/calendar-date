export class ArrayUtil {
  static isArray(value: unknown): value is unknown[] | readonly unknown[] {
    return Array.isArray(value);
  }
}

declare global {
  interface Array<T> {
    isArray(): this is T[] | readonly T[];
  }
}
