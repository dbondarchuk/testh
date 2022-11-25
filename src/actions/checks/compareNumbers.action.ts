import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Type } from 'class-transformer';
import { Assert } from '../../helpers/assert';
import { NumberComparison } from '../../models/comparison/numberComparison';

/** Properties for {@link CompareNumbersAction} */
export class CompareNumbersActionProperties
  implements IActionProperties
{
  /** Comparison value */
  @Type(() => NumberComparison)
  compare: NumberComparison;

  /** Value to compare */
  @Type(() => Number)
  to: number;
}

/** Runner type aliases for {@link CompareNumbersAction} */
export const CompareNumbersActionTypeAliases = [
  'compare-numbers',
] as const;

/**
 * Compares two numbers
 * @properties {@link CompareNumbersActionProperties}
 * @runnerType {@link CompareNumbersActionTypeAliases}
 */
@Register(
  CompareNumbersActionProperties,
  ...CompareNumbersActionTypeAliases,
)
export class CompareNumbersAction extends IAction<CompareNumbersActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: CompareNumbersActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CompareNumbersAction>(
      CompareNumbersAction,
    );
  }

  public async run(_: State): Promise<void> {
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
