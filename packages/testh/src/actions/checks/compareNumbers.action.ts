import {
  Action,
  Assert,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  NumberComparison,
  PropertyIsRequiredException,
} from '@testh/sdk';
import { Type } from 'class-transformer';

/** Properties for {@link CompareNumbersAction} */
export class CompareNumbersActionProperties implements IActionProperties {
  /** Comparison value */
  @Type(() => NumberComparison)
  compare: NumberComparison;

  /** Value to compare */
  @Type(() => Number)
  to: number;
}

/** Runner type aliases for {@link CompareNumbersAction} */
export const CompareNumbersActionTypeAliases = ['compare-numbers'] as const;

/**
 * Compares two numbers
 * @properties {@link CompareNumbersActionProperties}
 * @runnerType {@link CompareNumbersActionTypeAliases}
 */
@Action(CompareNumbersActionProperties, ...CompareNumbersActionTypeAliases)
export class CompareNumbersAction extends IAction<CompareNumbersActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: CompareNumbersActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CompareNumbersAction>(CompareNumbersAction);
  }

  public async run(_: IState): Promise<void> {
    const compare = this.props.compare;
    if (!compare) {
      throw new PropertyIsRequiredException('compare');
    }

    this.logger.info(`Comparing number ${compare} to '${this.props.to}'`);

    Assert.assertNumberComparison(this.props.compare, this.props.to);

    this.logger.info(
      `Value ${this.props.to} successfully matched ${this.props.compare}`,
    );
  }
}
