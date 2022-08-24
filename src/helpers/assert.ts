import {
  NumberComparison,
  NumberComparisonType,
} from '../models/comparison/numberComparison';
import {
  StringComparison,
  StringComparisonType,
} from '../models/comparison/stringComparison';
import { AssertionException } from '../models/exceptions/assertionException';
import { UnknownOptionException } from '../models/exceptions/unknownOptionException';

export class Assert {
  public static readonly OPENING_CHARACTER = '[';
  public static readonly CLOSING_CHARACTER = ']';

  public static readonly ASSERT_LEFT = 'expected ' + Assert.OPENING_CHARACTER;
  public static readonly ASSERT_LEFT2 =
    'expected not same ' + Assert.OPENING_CHARACTER;
  public static readonly ASSERT_MIDDLE =
    Assert.CLOSING_CHARACTER + ' but found ' + Assert.OPENING_CHARACTER;
  public static readonly ASSERT_RIGHT = Assert.CLOSING_CHARACTER;
  public static readonly ASSERT_LEFT_INEQUALITY =
    'did not expect to find ' + Assert.OPENING_CHARACTER;

  public static readonly ARRAY_MISMATCH_TEMPLATE =
    'arrays differ firstly at element [%d]; expected value is <%s> but was <%s>. %s';

  /**
   * Asserts that a string comparison is ok,
   * an AssertionException, with the given message, is thrown.
   * @param comparison the comparison to evaluate
   * @param text target string
   * @param message the assertion error message
   */
  public static assertComparison(
    comparison: StringComparison,
    text: string,
    message?: string,
  ): void {
    if (!message) {
      message = `Value ${text} `;
      const type = comparison.type?.toLowerCase() as StringComparisonType;

      switch (type) {
        case 'equals':
          message += "doesn't equal";
          break;

        case 'startswith':
          message += "doesn't start with";
          break;

        case 'endswith':
          message += "doesn't end with";
          break;

        case 'contains':
          message += "doesn't contain";
          break;

        // case "notequal":
        //     message += "equals";
        //     break;

        // case "notstartwith":
        //     message += "starts with";
        //     break;

        // case "notendwith":
        //     message += "ends with";
        //     break;

        // case "notcontain":
        //     message += "contains";
        //     break;

        case 'regex':
          message += "doesn't match regex";
          break;

        default:
          throw new UnknownOptionException(
            `Unknown compare type - ${comparison.type}`,
          );
      }

      message += " '" + comparison.value + "' ";
      message += comparison.ignoreCase ? 'ignoring case' : 'matching case';
    }

    if (!comparison.compare(text)) {
      Assert.fail(message);
    }
  }

  /**
   * Asserts that a number comparison is ok,
   * an AssertionException, with the given message, is thrown.
   * @param comparison the comparison to evaluate
   * @param value target string
   * @param message the assertion error message
   */
  public static assertNumberComparison(
    comparison: NumberComparison,
    value: number,
    message?: string,
  ): void {
    if (!message) {
      message = `Value ${value} `;
      const type = comparison.type?.toLowerCase() as NumberComparisonType;

      switch (type) {
        case '==':
          message += "doesn't equal";
          break;

        case '!=':
          message += 'equals';
          break;

        case '>':
          message += 'is not greater';
          break;

        case '>=':
          message += 'is not greater or equal';
          break;

        case '<':
          message += 'is not smaller';
          break;

        case '<=':
          message += 'is not smaller or equal';
          break;

        // case "notequal":
        //     message += "equals";
        //     break;

        // case "notstartwith":
        //     message += "starts with";
        //     break;

        // case "notendwith":
        //     message += "ends with";
        //     break;

        // case "notcontain":
        //     message += "contains";
        //     break;

        default:
          throw new UnknownOptionException(
            `Unknown compare type - ${comparison.type}`,
          );
      }

      message += " '" + comparison.value + "'";
    }

    if (!comparison.compare(value)) {
      Assert.fail(message);
    }
  }

  /**
   * Asserts that a condition is true. If it isn't,
   * an AssertionException, with the given message, is thrown.
   * @param condition the condition to evaluate
   * @param message the assertion error message
   */
  public static assertTrue(condition: boolean, message: string): void {
    if (!condition) {
      Assert.failNotEquals(condition, true, message);
    }
  }

  /**
   * Asserts that a condition is false. If it isn't,
   * an AssertionException, with the given message, is thrown.
   * @param condition the condition to evaluate
   * @param message the assertion error message
   */
  public static assertFalse(condition: boolean, message: string): void {
    if (condition) {
      Assert.failNotEquals(condition, false, message);
    }
  }

  /**
   * Fails a test with the given message and wrapping the original exception.
   *
   * @param message the assertion error message
   * @param realCause the original exception
   */
  public static fail(message: string, realCause?: Error): void {
    const ae = new AssertionException(message, realCause);

    throw ae;
  }

  private static failNotEquals(
    actual: any,
    expected: any,
    message?: string,
  ): void {
    Assert.fail(Assert.format(actual, expected, message));
  }

  private static format(
    actual: any,
    expected: any,
    message?: string,
    equality = false,
  ): string {
    if (message) {
      return message;
    }

    return equality
      ? Assert.ASSERT_LEFT +
          expected +
          Assert.ASSERT_MIDDLE +
          actual +
          Assert.ASSERT_RIGHT
      : Assert.ASSERT_LEFT_INEQUALITY +
          expected +
          Assert.ASSERT_MIDDLE +
          actual +
          Assert.ASSERT_RIGHT;
  }
}
