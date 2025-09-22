export class ArrayUtil {
  static isArray(value: unknown): value is unknown[] | readonly unknown[] {
    return Array.isArray(value);
  }
}