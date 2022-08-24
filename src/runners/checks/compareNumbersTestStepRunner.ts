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
import { NumberComparison } from '../../models/comparison/numberComparison';

export class CompareNumbersTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  @Type(() => NumberComparison)
  compare: NumberComparison;

  to: number;
}

/**
 * Checks a web element text
 */
@Register(CompareNumbersTestStepRunnerProperties, 'compare-numbers')
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
      `Element ${compare} text successfully matched ${this.props.compare}`,
    );
  }
}
