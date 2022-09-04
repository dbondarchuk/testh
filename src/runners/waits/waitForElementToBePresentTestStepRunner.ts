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
 * Properties for {@link WaitForElementToBePresentTestStepRunner}
 */
export class WaitForElementToBePresentTestStepRunnerProperties
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

/** Runner type aliases for {@link WaitForElementToBePresentTestStepRunner} */
export const WaitForElementToBePresentTestStepRunnerTypeAliases = ['wait', 'wait-to-be-present'] as const;

/**
 * Waits for a web element to be present
 * @properties {@link WaitForElementToBePresentTestStepRunnerProperties}
 * @runnerType {@link WaitForElementToBePresentTestStepRunnerTypeAliases}
 */
@Register(
  WaitForElementToBePresentTestStepRunnerProperties,
  ...WaitForElementToBePresentTestStepRunnerTypeAliases
)
export class WaitForElementToBePresentTestStepRunner extends ITestStepRunner<WaitForElementToBePresentTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForElementToBePresentTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<WaitForElementToBePresentTestStepRunner>(
      WaitForElementToBePresentTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const selector = this.props.selector;
    const timeout = this.props.timeout ?? 5;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(
      `Waiting for element ${selector} to be present and visible for ${timeout} seconds.`,
    );

    await state.currentDriver.wait(
      until.elementLocated(selector.by),
      timeout * 1000,
      `Element ${selector} wasn't present for ${timeout} seconds`,
    );

    this.logger.info(`Element ${selector} was sucessfully located`);
  }
}
