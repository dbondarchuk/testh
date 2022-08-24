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

export class WaitForElementToBeInteractableTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  @Type(() => Selector)
  selector: Selector;
  timeout: number;
}

/**
 * Waits for a web element to be interactable
 */
@Register(
  WaitForElementToBeInteractableTestStepRunnerProperties,
  'wait-to-be-interactable',
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
