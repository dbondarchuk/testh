import { ToNumber } from '../../helpers/types/number';
import { UnknownOptionException } from '../exceptions/unknownOptionException';
import { IComparison as IComparison } from './iComparison';

/**
 * Comparison type for the strings
 */
export type NumberComparisonType = '>' | '>=' | '==' | '!=' | '<' | '<=';

/**
 * Describes a comparison of the strings
 */
export class NumberComparison implements IComparison<number, number> {
  /** Comparison type */
  type: NumberComparisonType;

  /** Value to compare to */
  @ToNumber()
  value: number;

  /**
   * Compares two values
   * @param to Another value
   * @returns True if two number satisfy condition
   */
  public compare(to: number): boolean {
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
    return `NumberComparison;value=${this.value};type=${this.type};`;
  }
}
