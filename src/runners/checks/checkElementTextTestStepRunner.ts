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
import { StringComparison } from '../../models/comparison/stringComparison';
import { Assert } from '../../helpers/assert';

/** Properties for {@link CheckElementTextTestStepRunner} */
export class CheckElementTextTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /** Element selector */
  @Type(() => Selector)
  selector: Selector;

  /** Comparison value */
  @Type(() => StringComparison)
  compare: StringComparison;
}

/** Runner type aliases for {@link CheckElementTextTestStepRunner} */
export const CheckElementTextTestStepRunnerTypeAliases = ['compare-element-text'] as const;

/**
 * Checks a web element text
 * @properties {@link CheckElementTextTestStepRunnerProperties}
 * @runnerType {@link CheckElementTextTestStepRunnerTypeAliases}
 */
@Register(CheckElementTextTestStepRunnerProperties, ...CheckElementTextTestStepRunnerTypeAliases)
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

    Assert.assertStringComparison(this.props.compare, elementText);

    this.logger.info(
      `Element ${selector} text successfully matched ${this.props.compare}`,
    );
  }
}
