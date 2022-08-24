/** Describes comparisson of two objects */
export abstract class IComparisson<T, V> {
  /** Stored value */
  abstract value: T;

  /**
   * Compares stored value with another value
   * @param to Value to compare to
   * @returns Comparisson result
   */
  abstract compare(to: V): boolean;
}
