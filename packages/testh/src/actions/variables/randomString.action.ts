import { Action, IAction, IActionProperties, ILogger, ILoggerFactory, ToBoolean, ToNumber } from '@testh/sdk';
import { randomNumber } from './randomNumber.action';

/** List of upper case characters */
export const upperCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
/** List of lower case characters */
export const lowerCharacters = upperCharacters.toLowerCase();
/** List of digit characters */
export const digitCharacters = '0123456789';
/** List of special characters */
export const specialCharacters = '!@#$%^&*()-_+=[]\\/,.<>;:\'"';

/**
 * Properties for {@link RandomStringAction}
 */
export class RandomStringActionProperties
  implements IActionProperties {
  /**
   * Min length.
   * @default 1
   */
  @ToNumber()
  minLength: number;

  /**
   * Max length (inclusive)
   * @default 10
   */
  @ToNumber()
  maxLength: number;

  /**
   * Indicates whether to use special characters
   * @see specialCharacters
   */
  @ToBoolean()
  useSpecialCharacters: boolean;

  /** List of excluded characters */
  excludedCharacters: string;
}

/** Runner type aliases for {@link RandomStringAction} */
export const RandomStringActionTypeAliases = ['random-string'] as const;

/**
 * Sets a value into a variable
 * @properties {@link RandomStringActionProperties}
 * @runnerType {@link SetVariableActionTypeAliases}
 */
@Action(
  RandomStringActionProperties,
  ...RandomStringActionTypeAliases,
)
export class RandomStringAction extends IAction<RandomStringActionProperties, string> {
  private readonly logger: ILogger;
  constructor(
    props: RandomStringActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<RandomStringAction>(
      RandomStringAction,
    );
  }

  public async run(): Promise<string> {
    const minLength = this.props.minLength ?? 1;
    const maxLength = this.props.maxLength ?? 10;

    let symbols = upperCharacters + lowerCharacters + digitCharacters;
    if (this.props.useSpecialCharacters) {
      symbols = symbols + specialCharacters;
    }

    const excludedSymbols = this.props.excludedCharacters;
    if (excludedSymbols) {
      if (excludedSymbols.includes(',,')) {
        symbols = symbols.replaceAll(',', '');
      }

      const excludedSymbolsList = excludedSymbols.split(',');
      for (let i = 0; i < excludedSymbolsList.length; i++) {
        if (excludedSymbolsList[i].length == 1) {
          symbols = symbols.replaceAll(excludedSymbolsList[i], '');
        }
      }
    }

    const length = randomNumber(minLength, maxLength);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += symbols.charAt(randomNumber(0, symbols.length));
    }

    this.logger.info(`Succesfully generated random string ${result}`);

    return result;
  }
}
