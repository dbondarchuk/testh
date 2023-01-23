import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  PropertyIsRequiredException,
  ToNumber,
} from '@testh/sdk';

/**
 *  Generates random number
 * @param min Min value (inclusive)
 * @param max Max value (inclusive)
 * */
export const randomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Properties for {@link RandomNumberAction}
 */
export class RandomNumberActionProperties implements IActionProperties {
  /**
   * Min value (inclusive)
   */
  @ToNumber()
  min: number;

  /**
   * Max value (inclusive)
   */
  @ToNumber()
  max: number;
}

/** Action type aliases for {@link RandomNumberAction} */
export const RandomNumberActionTypeAliases = ['random-number'] as const;

/**
 * Generates a random integer number between {@link RandomNumberActionProperties.min} and {@link RandomNumberActionProperties.max}
 * @properties {@link RandomNumberActionProperties}
 * @runnerType {@link SetVariableActionTypeAliases}
 * @returns {number} Random integer number between {@link RandomNumberActionProperties.min} and {@link RandomNumberActionProperties.max}
 */
@Action(
  RandomNumberActionProperties,
  'Generate random number',
  ...RandomNumberActionTypeAliases,
)
export class RandomNumberAction extends IAction<
  RandomNumberActionProperties,
  number
> {
  private readonly logger: ILogger;
  constructor(
    props: RandomNumberActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<RandomNumberAction>(RandomNumberAction);
  }

  public async run(): Promise<number> {
    const min = this.props.min ?? 0;
    const max = this.props.max;
    if (!max) {
      throw new PropertyIsRequiredException('max');
    }

    const result = randomNumber(min, max);
    this.logger.info(`Succesfully generated random number ${result}`);

    return result;
  }
}
