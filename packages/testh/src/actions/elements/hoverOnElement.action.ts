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
 * Properties for {@link HoverOnElementAction}
 */
export class HoverOnElementActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link HoverOnElementAction} */
export const HoverOnElementActionTypeAliases = ['hover'] as const;

/**
 * Hovers on a web element
 * @properties {@link HoverOnElementActionProperties}
 * @runnerType {@link HoverOnElementActionTypeAliases}
 */
@Action(
  HoverOnElementActionProperties,
  'Hover on element',
  ...HoverOnElementActionTypeAliases,
)
export class HoverOnElementAction extends IAction<HoverOnElementActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: HoverOnElementActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<HoverOnElementAction>(HoverOnElementAction);
  }

  public async run(state: IState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(`Hovering on element ${selector}`);

    const element = await selector.getElement(state.currentDriver);
    await state.currentDriver
      .actions()
      .move({
        origin: element,
      })
      .perform();

    this.logger.info(`Successfully hovered on element ${selector}`);
  }
}
