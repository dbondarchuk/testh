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
 * Properties for {@link GetElementTextTestStepRunner}
 */
export class GetElementTextTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /**
   * Element selector
   */
  @Type(() => Selector)
  selector: Selector;
}

/** Runner type aliases for {@link GetElementTextTestStepRunner} */
export const GetElementTextTestStepRunnerTypeAliases = [
  'get-text',
  'get-element-text',
] as const;

/**
 * Gets a web element text and returns it
 * @properties {@link GetElementTextTestStepRunnerProperties}
 * @runnerType {@link GetElementTextTestStepRunnerTypeAliases}
 * @returns {string} Element's text
 */
@Register(
  GetElementTextTestStepRunnerProperties,
  ...GetElementTextTestStepRunnerTypeAliases,
)
export class GetElementTextTestStepRunner extends ITestStepRunner<
  GetElementTextTestStepRunnerProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementTextTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementTextTestStepRunner>(
      GetElementTextTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<string> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await state.currentDriver.findElement(selector.by);
    const elementText = await element.getText();

    this.logger.info(
      `Successfully got text '${elementText}' of the element ${selector}`,
    );

    return elementText;
  }
}
