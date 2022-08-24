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
import { StringComparison } from '../../models/comparison/stringComparison';
import { Assert } from '../../helpers/assert';

export class CheckElementTextTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  @Type(() => Selector)
  selector: Selector;

  @Type(() => StringComparison)
  compare: StringComparison;
}

/**
 * Checks a web element text
 */
@Register(CheckElementTextTestStepRunnerProperties, 'compare-element-text')
export class CheckElementTextTestStepRunner extends ITestStepRunner<CheckElementTextTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: CheckElementTextTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CheckElementTextTestStepRunner>(
      CheckElementTextTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await state.currentDriver.findElement(selector.by);
    const elementText = await element.getText();

    this.logger.info(
      `Comparing element ${selector} text '${elementText}' to '${this.props.compare}'`,
    );

    Assert.assertComparison(this.props.compare, elementText);

    this.logger.info(
      `Element ${selector} text successfully matched ${this.props.compare}`,
    );
  }
}
