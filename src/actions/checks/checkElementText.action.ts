import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Action } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Type } from 'class-transformer';
import { StringComparison } from '../../models/comparison/stringComparison';
import { Assert } from '../../helpers/assert';
import { SelectorOrElement } from '../../models/selector/selectorOrElement';

/** Properties for {@link CheckElementTextAction} */
export class CheckElementTextActionProperties
  implements IActionProperties
{
  /** Element selector */
  @Type(() => SelectorOrElement)
  selector: SelectorOrElement;

  /** Comparison value */
  @Type(() => StringComparison)
  compare: StringComparison;
}

/** Runner type aliases for {@link CheckElementTextAction} */
export const CheckElementTextActionTypeAliases = [
  'compare-element-text',
] as const;

/**
 * Checks a web element text
 * @properties {@link CheckElementTextActionProperties}
 * @runnerType {@link CheckElementTextActionTypeAliases}
 */
@Action(
  CheckElementTextActionProperties,
  ...CheckElementTextActionTypeAliases,
)
export class CheckElementTextAction extends IAction<CheckElementTextActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: CheckElementTextActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CheckElementTextAction>(
      CheckElementTextAction,
    );
  }

  public async run(state: State): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await selector.getElement(state.currentDriver);
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
