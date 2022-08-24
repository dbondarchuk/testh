import { UnknownOptionException } from '../exceptions/unknownOptionException';
import { IComparisson as IComparison } from './iComparison';

/**
 * Comparisson type for the strings
 */
export type NumberComparisonType = '>' | '>=' | '==' | '!=' | '<' | '<=';

/**
 * Describes a comparisson of the strings
 */
export class NumberComparison implements IComparison<number, number> {
  /** Comparisson type */
  type: string;

  /** Value to compare to */
  value: number;

  /**
   * Compares two values
   * @param to Another value
   * @returns True if two number satisfy condition
   */
  public compare(to: number) {
    if (!this.value) {
      return true;
    }

    if (!to) {
      return false;
    }

    const check = Number(to);
    const source = Number(this.value);

    const type = this.type?.toLowerCase() as NumberComparisonType;

    switch (type) {
      case '>':
        return source > check;

      case '>=':
        return source >= check;

      case '==':
        return source == check;

      case '!=':
        return source != check;

      case '<':
        return source < check;

      case '<=':
        return source <= check;

      default:
        throw new UnknownOptionException(`Unknown compare type - ${type}`);
    }
  }

  public toString(): string {
    return `NumberComparison;type=${this.type};value=${this.value}`;
  }
}
