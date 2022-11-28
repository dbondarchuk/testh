import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { ToNumber } from '../../helpers/types/number';

/**
 *  Generates random number 
 * @param min Min value (inclusive)
 * @param max Max value (inclusive)
 * */
export const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Properties for {@link RandomNumberAction}
 */
export class RandomNumberActionProperties
  implements IActionProperties
{
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

/** Runner type aliases for {@link RandomNumberAction} */
export const RandomNumberActionTypeAliases = ['random-number'] as const;

/**
 * Sets a value into a variable
 * @properties {@link RandomNumberActionProperties}
 * @runnerType {@link SetVariableActionTypeAliases}
 */
@Register(
  RandomNumberActionProperties,
  ...RandomNumberActionTypeAliases,
)
export class RandomNumberAction extends IAction<RandomNumberActionProperties, number> {
  private readonly logger: ILogger;
  constructor(
    props: RandomNumberActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<RandomNumberAction>(
      RandomNumberAction,
    );
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
