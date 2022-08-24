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

export class GetElementTextTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  @Type(() => Selector)
  selector: Selector;
  variable: string;
}

/**
 * Gets a web element text and stores it into a variable
 */
@Register(
  GetElementTextTestStepRunnerProperties,
  'get-text',
  'get-element-text',
)
export class GetElementTextTestStepRunner extends ITestStepRunner<GetElementTextTestStepRunnerProperties> {
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
      `Succesfully stored text '${elementText}' of the element ${selector} into '${variable}' variable`,
    );
  }
}
