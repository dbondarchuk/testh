import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  SelectorOrElement,
  ToSelectorOrElement,
} from '@testh/sdk';
import { Key } from 'selenium-webdriver';

/**
 * Properties for {@link FocusOnElementAction}
 */
export class FocusOnElementActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link FocusOnElementAction} */
export const FocusOnElementActionTypeAliases = ['focus'] as const;

/**
 * Focuses on a web element
 * @properties {@link FocusOnElementActionProperties}
 * @runnerType {@link FocusOnElementActionTypeAliases}
 */
@Action(
  FocusOnElementActionProperties,
  'Focus on element',
  ...FocusOnElementActionTypeAliases,
)
export class FocusOnElementAction extends IAction<FocusOnElementActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: FocusOnElementActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<FocusOnElementAction>(FocusOnElementAction);
  }

  public async run(state: IState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(`Focusing on element ${selector}`);

    const element = await selector.getElement(state.currentDriver);

    await element.sendKeys(Key.SHIFT);
    await state.currentDriver.executeScript('arguments[0].focus();', element);

    this.logger.info(`Successfully focused on element ${selector}`);
  }
}
