import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  ITestStepRunnerProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Type } from 'class-transformer';
import { Assert } from '../../helpers/assert';
import { StringComparison } from '../../models/comparison/stringComparison';

/** Properties for {@link CompareStringsTestStepRunner} */
export class CompareStringsTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /** Comparison value */
  @Type(() => StringComparison)
  compare: StringComparison;

  /** Value to compare */
  to: string;
}

/** Runner type aliases for {@link CompareStringsTestStepRunner} */
export const CompareStringsTestStepRunnerTypeAliases = ['compare-strings'] as const;

/**
 * Compares two strings
 * @properties {@link CompareStringsTestStepRunnerProperties}
 * @runnerType {@link CompareStringsTestStepRunnerTypeAliases}
 */
@Register(CompareStringsTestStepRunnerProperties, ...CompareStringsTestStepRunnerTypeAliases)
export class CompareStringsTestStepRunner extends ITestStepRunner<CompareStringsTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: CompareStringsTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CompareStringsTestStepRunner>(
      CompareStringsTestStepRunner,
    );
  }

  public async run(_: TestRunState): Promise<void> {
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
