/** Describes comparison of two objects */
export abstract class IComparison<T, V> {
  /** Stored value */
  abstract value: T;

  /**
   * Compares stored value with another value
   * @param to Value to compare to
   * @returns Comparison result
   */
  abstract compare(to: V): boolean;
}
