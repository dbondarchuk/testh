import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import { ITestStepRunner } from '../../models/runners/iTestStepRunner';
import { ITestStepRunnerProperties } from '../../models/runners/ITestStepRunnerProperties';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Selector } from '../../models/selector/selector';
import { Type } from 'class-transformer';

/**
 * Properties for {@link WaitForElementToBeInteractableTestStepRunner}
 */
export class WaitForElementToBeInteractableTestStepRunnerProperties
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

/** Runner type aliases for {@link WaitForElementToBeInteractableTestStepRunnerTypeAliases} */
export const WaitForElementToBeInteractableTestStepRunnerTypeAliases = [
  'wait-to-be-interactable',
] as const;

/**
 * Waits for a web element to be interactable
 * @parameters {@link WaitForElementToBeInteractableTestStepRunnerProperties}
 * @runnerType {@link WaitForElementToBeInteractableTestStepRunnerTypeAliases}
 */
@Register(
  WaitForElementToBeInteractableTestStepRunnerProperties,
  ...WaitForElementToBeInteractableTestStepRunnerTypeAliases,
)
export class WaitForElementToBeInteractableTestStepRunner extends ITestStepRunner<WaitForElementToBeInteractableTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForElementToBeInteractableTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger =
      loggerFactory.get<WaitForElementToBeInteractableTestStepRunner>(
        WaitForElementToBeInteractableTestStepRunner,
      );
  }

  public async run(state: TestRunState): Promise<void> {
    const selector = this.props.selector;
    const timeout = this.props.timeout ?? 5;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(
      `Waiting for element ${selector} to be interactable for ${timeout} seconds.`,
    );

    const element = state.currentDriver.findElement(selector.by);

    await state.currentDriver.wait(
      async () => (await element.isDisplayed()) && (await element.isEnabled()),
      timeout * 1000,
      `Element ${selector} wasn't interactable for ${timeout} seconds`,
    );

    this.logger.info(`Element ${selector} was sucessfully located`);
  }
}
