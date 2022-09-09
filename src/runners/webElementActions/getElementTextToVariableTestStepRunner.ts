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
 * Properties for {@link GetElementTextToVariableTestStepRunner}
 */
export class GetElementTextToVariableTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /**
   * Element selector
   */
  @Type(() => Selector)
  selector: Selector;

  /**
   * Name of the variable where to save element's text
   */
  variable: string;
}

/** Runner type aliases for {@link GetElementTextToVariableTestStepRunner} */
export const GetElementTextToVariableTestStepRunnerTypeAliases = [
  'get-text-to-variable',
  'get-element-text-to-variable',
] as const;

/**
 * Gets a web element text and stores it into a variable
 * @properties {@link GetElementTextToVariableTestStepRunnerProperties}
 * @runnerType {@link GetElementTextToVariableTestStepRunnerTypeAliases}
 */
@Register(
  GetElementTextToVariableTestStepRunnerProperties,
  ...GetElementTextToVariableTestStepRunnerTypeAliases,
)
export class GetElementTextToVariableTestStepRunner extends ITestStepRunner<GetElementTextToVariableTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementTextToVariableTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementTextToVariableTestStepRunner>(
      GetElementTextToVariableTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    let variable = this.props.variable;
    if (!variable) {
      throw new PropertyIsRequiredException('variable');
    }

    const element = await state.currentDriver.findElement(selector.by);
    const elementText = await element.getText();

    variable = state.variables.put(variable, elementText);

    this.logger.info(
      `Successfully stored text '${elementText}' of the element ${selector} into '${variable}' variable`,
    );
  }
}
