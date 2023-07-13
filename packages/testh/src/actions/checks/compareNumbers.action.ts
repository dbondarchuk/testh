import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  NumberComparison,
  PropertyIsRequiredException,
  ToNumber,
} from '@testh/sdk';
import { Type } from 'class-transformer';

/** Properties for {@link CompareNumbersAction} */
export class CompareNumbersActionProperties implements IActionProperties {
  /** Comparison value */
  @Type(() => NumberComparison)
  compare: NumberComparison;

  /** Value to compare */
  @ToNumber()
  to: number;
}

/** Action type aliases for {@link CompareNumbersAction} */
export const CompareNumbersActionTypeAliases = ['compare-numbers'] as const;

/**
 * Compares two numbers
 * @properties {@link CompareNumbersActionProperties}
 * @runnerType {@link CompareNumbersActionTypeAliases}
 * @returns {boolean} Whether {@link CompareNumbersActionProperties.to} satisfies the comparison {@link CompareNumbersActionProperties.compare}
 */
@Action(
  CompareNumbersActionProperties,
  'Compare numbers',
  ...CompareNumbersActionTypeAliases,
)
export class CompareNumbersAction extends IAction<
  CompareNumbersActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: CompareNumbersActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CompareNumbersAction>(CompareNumbersAction);
  }

  public async run(_: IState): Promise<boolean> {
    if (!this.props.compare) {
      throw new PropertyIsRequiredException('compare');
    }

    this.logger.info(
      `Comparing number ${this.props.compare} to '${this.props.to}'`,
    );

    const result = this.props.compare.compare(this.props.to);

    this.logger.info(
      `Value '${this.props.compare}' was${
        !result ? ' not' : ''
      } successfully matched ${this.props.to}`,
    );

    return result;
  }
}
