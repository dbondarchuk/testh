import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Action } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Type } from 'class-transformer';
import { Assert } from '../../helpers/assert';
import { StringComparison } from '../../models/comparison/stringComparison';

/** Properties for {@link CompareStringsAction} */
export class CompareStringsActionProperties
  implements IActionProperties
{
  /** Comparison value */
  @Type(() => StringComparison)
  compare: StringComparison;

  /** Value to compare */
  to: string;
}

/** Runner type aliases for {@link CompareStringsAction} */
export const CompareStringsActionTypeAliases = [
  'compare-strings',
] as const;

/**
 * Compares two strings
 * @properties {@link CompareStringsActionProperties}
 * @runnerType {@link CompareStringsActionTypeAliases}
 */
@Action(
  CompareStringsActionProperties,
  ...CompareStringsActionTypeAliases,
)
export class CompareStringsAction extends IAction<CompareStringsActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: CompareStringsActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CompareStringsAction>(
      CompareStringsAction,
    );
  }

  public async run(_: State): Promise<void> {
    const compare = this.props.compare;
    if (!compare) {
      throw new PropertyIsRequiredException('compare');
    }

    this.logger.info(`Comparing string '${compare}' to '${this.props.to}'`);

    Assert.assertStringComparison(this.props.compare, this.props.to);

    this.logger.info(
      `Value '${compare}' successfully matched ${this.props.compare}`,
    );
  }
}
