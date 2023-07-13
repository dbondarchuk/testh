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
 * Properties for {@link BlurOnElementAction}
 */
export class BlurOnElementActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link BlurOnElementAction} */
export const BlurOnElementActionTypeAliases = ['blur', 'unfocus'] as const;

/**
 * Blures (removes focus) on a web element
 * @properties {@link BlurOnElementActionProperties}
 * @runnerType {@link BlurOnElementActionTypeAliases}
 */
@Action(
  BlurOnElementActionProperties,
  'Blur on element',
  ...BlurOnElementActionTypeAliases,
)
export class BlurOnElementAction extends IAction<BlurOnElementActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: BlurOnElementActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<BlurOnElementAction>(BlurOnElementAction);
  }

  public async run(state: IState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(`Bluring on element ${selector}`);

    const element = await selector.getElement(state.currentDriver);

    await element.sendKeys(Key.SHIFT);
    await state.currentDriver.executeScript('arguments[0].blur();', element);

    this.logger.info(`Successfully removed focus on element ${selector}`);
  }
}
