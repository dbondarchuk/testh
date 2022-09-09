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
 * Properties for {@link InputTextTestStepRunner}
 */
export class InputTextTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /**
   * Element selector
   */
  @Type(() => Selector)
  selector: Selector;

  /**
   * Text to input
   */
  text?: string;

  /**
   * Determines whether element text should be cleared before the input
   */
  clear?: boolean;
}

/** Runner type aliases for {@link InputTextTestStepRunner} */
export const InputTextTestStepRunnerTypeAliases = ['input', 'type'] as const;

/**
 * Inputs text into the web element
 * @properties {@link InputTextTestStepRunnerProperties}
 * @runnerType {@link InputTextTestStepRunnerTypeAliases}
 */
@Register(
  InputTextTestStepRunnerProperties,
  ...InputTextTestStepRunnerTypeAliases,
)
export class InputTextTestStepRunner extends ITestStepRunner<InputTextTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: InputTextTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<InputTextTestStepRunner>(
      InputTextTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await state.currentDriver.findElement(selector.by);

    if (this.props.clear) {
      this.logger.info(`Clearing input ${selector}`);
      await element.clear();

      this.logger.info(`Successfully cleared element ${selector}`);
    }

    if (this.props.text) {
      this.logger.info(`Typing ${this.props.text} into ${selector}`);
      await element.sendKeys(this.props.text);
      this.logger.info(`Successfully typed into element ${selector}`);
    }
  }
}
