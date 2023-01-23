import {
  Action,
  BindingProperty,
  ElementNotFoundException,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  SelectorOrElement,
} from '@testh/sdk';
import { Type } from 'class-transformer';

/**
 * Properties for {@link ClickOnElementAction}
 */
export class ClickOnElementActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @Type(() => SelectorOrElement)
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link ClickOnElementAction} */
export const ClickOnElementActionTypeAliases = ['click'] as const;

/**
 * Clicks on a web element
 * @properties {@link ClickOnElementActionProperties}
 * @runnerType {@link ClickOnElementActionTypeAliases}
 */
@Action(
  ClickOnElementActionProperties,
  'Click on element',
  ...ClickOnElementActionTypeAliases,
)
export class ClickOnElementAction extends IAction<ClickOnElementActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: ClickOnElementActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<ClickOnElementAction>(ClickOnElementAction);
  }

  public async run(state: IState): Promise<void> {
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
