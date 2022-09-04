import { until } from 'selenium-webdriver';
import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
} from '../../models/runners/iTestStepRunner';
import { ITestStepRunnerProperties } from "../../models/runners/ITestStepRunnerProperties";
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Selector } from '../../models/selector/selector';
import { Type } from 'class-transformer';

/**
 * Properties for {@link WaitForElementToBeVisibleTestStepRunner}
 */
export class WaitForElementToBeVisibleTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /**
   * Element selector
   */
  @Type(() => Selector)
  selector: Selector;

  /**
   * Wait timeout in seconds
   */
  timeout: number;
}

export const WaitForElementToBeVisibleTestStepRunnerTypeAliases = ['wait-to-be-visible'] as const;

/**
 * Waits for a web element to be visible
 * @properties {@link WaitForElementToBeVisibleTestStepRunnerProperties}
 * @runnerType {@link WaitForElementToBeVisibleTestStepRunner}
 */
@Register(
  WaitForElementToBeVisibleTestStepRunnerProperties,
  ...WaitForElementToBeVisibleTestStepRunnerTypeAliases,
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
