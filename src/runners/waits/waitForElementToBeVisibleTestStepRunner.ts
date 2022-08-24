import { until } from 'selenium-webdriver';
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

export class WaitForElementToBeVisibleTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  @Type(() => Selector)
  selector: Selector;
  timeout: number;
}

/**
 * Waits for a web element to be present
 */
@Register(
  WaitForElementToBeVisibleTestStepRunnerProperties,
  'wait-to-be-visible',
)
export class WaitForElementToBeVisibleTestStepRunner extends ITestStepRunner<WaitForElementToBeVisibleTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForElementToBeVisibleTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<WaitForElementToBeVisibleTestStepRunner>(
      WaitForElementToBeVisibleTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const selector = this.props.selector;
    const timeout = this.props.timeout ?? 5;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(
      `Waiting for element ${selector} to be visible for ${timeout} seconds.`,
    );

    const element = state.currentDriver.findElement(selector.by);

    await state.currentDriver.wait(
      until.elementIsVisible(element),
      timeout * 1000,
      `Element ${selector} wasn't visible for ${timeout} seconds`,
    );

    this.logger.info(`Element ${selector} was sucessfully located`);
  }
}
