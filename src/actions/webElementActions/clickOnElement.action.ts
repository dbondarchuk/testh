import { ElementNotFoundException } from '../../models/exceptions/elementNotFoundException';
import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Type } from 'class-transformer';
import { SelectorOrElement } from '../../models/selector/selectorOrElement';

/**
 * Properties for {@link ClickOnElementAction}
 */
export class ClickOnElementActionProperties
  implements IActionProperties
{
  /**
   * Element selector
   */
  @Type(() => SelectorOrElement)
  selector: SelectorOrElement;
}

/** Runner type aliases for {@link ClickOnElementAction} */
export const ClickOnElementActionTypeAliases = ['click'] as const;

/**
 * Clicks on a web element
 * @properties {@link ClickOnElementActionProperties}
 * @runnerType {@link ClickOnElementActionTypeAliases}
 */
@Register(
  ClickOnElementActionProperties,
  ...ClickOnElementActionTypeAliases,
)
export class ClickOnElementAction extends IAction<ClickOnElementActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: ClickOnElementActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<ClickOnElementAction>(
      ClickOnElementAction,
    );
  }

  public async run(state: State): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(`Clicking on element ${selector}`);

    const element = await selector.getElement(state.currentDriver);
    if (!element) {
      throw new ElementNotFoundException(selector);
    }

    await element.click();

    this.logger.info(`Successfully clicked on element ${selector}`);
  }
}
