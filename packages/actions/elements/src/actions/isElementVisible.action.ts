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

/**
 * Properties for {@link IsElementVisibleAction}
 */
export class IsElementVisibleActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link IsElementVisibleAction} */
export const IsElementVisibleActionTypeAliases = ['is-visible'] as const;

/**
 * Gets whether a web element is visible
 * @properties {@link IsElementVisibleActionProperties}
 * @runnerType {@link IsElementVisibleActionTypeAliases}
 * @result `boolean` Whether the element is visible
 */
@Action(
  IsElementVisibleActionProperties,
  'Get whether element is visible',
  ...IsElementVisibleActionTypeAliases,
)
export class IsElementVisibleAction extends IAction<
  IsElementVisibleActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: IsElementVisibleActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<IsElementVisibleAction>(
      IsElementVisibleAction,
    );
  }

  public async run(state: IState): Promise<boolean> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(`Checking if element ${selector} is visible`);

    const element = await selector.getElement(state.currentDriver);
    const isDisplayed = await element.isDisplayed();

    this.logger.info(
      `Element ${selector} is${!isDisplayed ? ' not' : ''} visible`,
    );
    return isDisplayed;
  }
}
