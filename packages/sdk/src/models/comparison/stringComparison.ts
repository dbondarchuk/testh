import { UnknownOptionException } from '../exceptions/unknownOptionException';
import { IComparison as IComparison } from './iComparison';

/**
 * Comparison type for the strings
 */
export type StringComparisonType =
  | 'equals'
  | 'startswith'
  | 'endswith'
  | 'contains'
  | 'regex';

/**
 * Describes a comparison of the strings
 */
export class StringComparison implements IComparison<string, string> {
  /** Comparison type */
  type: StringComparisonType;

  /** Value to compare to */
  value: string;

  /** Should the case be ignored */
  ignoreCase?: boolean;

  /**
   * Compares two values
   * @param to Another value
   * @returns True if two strings are equal
   */
  public compare(to: string): boolean {
    if (!this.value) {
      return true;
    }

    if (!to) {
      return false;
    }

    const check = this.ignoreCase ? this.value.toLowerCase() : this.value;
    const source = this.ignoreCase ? to.toLowerCase() : to;

    const type = this.type?.toLowerCase() as StringComparisonType;

    switch (type) {
      case 'equals':
        return source === check;

      case 'startswith':
        return source.startsWith(check);

      case 'endswith':
        return source.endsWith(check);

      case 'contains':
        return source.indexOf(check) >= 0;

      case 'regex':
        return RegExp(to, this.ignoreCase ? 'i' : '').test(this.value);

      default:
        throw new UnknownOptionException(`Unknown compare type - ${type}`);
    }
  }

  public toString(): string {
    return `StringComparison;type=${this.type};ignoreCase:${!!this.ignoreCase};value=${this.value}`;
  }
}
