import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
} from '../../models/runners/iTestStepRunner';
import { ITestStepRunnerProperties } from "../../models/runners/ITestStepRunnerProperties";
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Type } from 'class-transformer';
import { Assert } from '../../helpers/assert';
import { NumberComparison } from '../../models/comparison/numberComparison';

/** Properties for {@link CompareNumbersTestStepRunner} */
export class CompareNumbersTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /** Comparison value */
  @Type(() => NumberComparison)
  compare: NumberComparison;

  /** Value to compare */
  to: number;
}

/** Runner type aliases for {@link CompareNumbersTestStepRunner} */
export const CompareNumbersTestStepRunnerTypeAliases = ['compare-numbers'] as const;

/**
 * Compares two numbers
 * @properties {@link CompareNumbersTestStepRunnerProperties}
 * @runnerType {@link CompareNumbersTestStepRunnerTypeAliases}
 */
@Register(CompareNumbersTestStepRunnerProperties, ...CompareNumbersTestStepRunnerTypeAliases)
export class CompareNumbersTestStepRunner extends ITestStepRunner<CompareNumbersTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: CompareNumbersTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CompareNumbersTestStepRunner>(
      CompareNumbersTestStepRunner,
    );
  }

  public async run(_: TestRunState): Promise<void> {
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
