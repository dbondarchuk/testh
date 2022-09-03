import { ElementNotFoundException } from '../../models/exceptions/elementNotFoundException';
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

/**
 * Properties for {@link ClickOnElementTestStepRunner}
 */
export class ClickOnElementTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /**
   * Element selector
   */
  @Type(() => Selector)
  selector: Selector;
}

/** Runner type aliases for {@link ClickOnElementTestStepRunner} */
export const ClickOnElementTestStepRunnerTypeAliases = ['click'] as const;

/**
 * Clicks on a web element
 * @properties {@link ClickOnElementTestStepRunnerProperties}
 * @runnerType {@link ClickOnElementTestStepRunnerTypeAliases}
 */
@Register(ClickOnElementTestStepRunnerProperties, ...ClickOnElementTestStepRunnerTypeAliases)
export class ClickOnElementTestStepRunner extends ITestStepRunner<ClickOnElementTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: ClickOnElementTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<ClickOnElementTestStepRunner>(
      ClickOnElementTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(`Clicking on element ${selector}`);

    const element = await state.currentDriver.findElement(selector.by);
    if (!element) {
      throw new ElementNotFoundException(selector);
    }

    await element.click();

    this.logger.info(`Successfully clicked on element ${selector}`);
  }
}
