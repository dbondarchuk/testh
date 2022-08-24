import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  ITestStepRunnerProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Selector } from '../../models/selector/selector';
import { Type } from 'class-transformer';
import { Waits } from '../../helpers/selenium/waits';

export class WaitForElementToBeNotPresentTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  @Type(() => Selector)
  selector: Selector;
  timeout: number;
}

/**
 * Waits for a web element to be not present
 */
@Register(
  WaitForElementToBeNotPresentTestStepRunnerProperties,
  'wait-to-be-not-present',
)
export class WaitForElementToBeNotPresentTestStepRunner extends ITestStepRunner<WaitForElementToBeNotPresentTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForElementToBeNotPresentTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<WaitForElementToBeNotPresentTestStepRunner>(
      WaitForElementToBeNotPresentTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const selector = this.props.selector;
    const timeout = this.props.timeout ?? 5;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(
      `Waiting for element ${selector} to be not present for ${timeout} seconds.`,
    );

    await state.currentDriver.wait(
      Waits.untilNotPresent(this.props.selector.by),
      timeout * 1000,
      `Element ${selector} was present for ${timeout} seconds`,
    );

    this.logger.info(`Element ${selector} was sucessfully not found`);
  }
}
