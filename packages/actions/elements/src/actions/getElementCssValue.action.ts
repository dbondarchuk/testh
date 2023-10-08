import {
  Action,
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
 * Properties for {@link GetElementCssValueAction}
 */
export class GetElementCssValueActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  selector: SelectorOrElement;

  /**
   * CSS property to select.
   */
  property: string;
}

/** Action type aliases for {@link GetElementCssValueAction} */
export const GetElementCssValueActionTypeAliases = [
  'get-css',
  'css',
  'style',
  'element-style',
] as const;

/**
 * Gets a web element CSS property value
 * @properties {@link GetElementCssValueActionProperties}
 * @runnerType {@link GetElementCssValueActionTypeAliases}
 * @result `string` Element's style property value
 */
@Action(
  GetElementCssValueActionProperties,
  'Get element CSS value',
  ...GetElementCssValueActionTypeAliases,
)
export class GetElementCssValueAction extends IAction<
  GetElementCssValueActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementCssValueActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementCssValueAction>(
      GetElementCssValueAction,
    );
  }

  public async run(state: IState): Promise<string> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    if (!this.props.property) {
      throw new PropertyIsRequiredException('property');
    }

    const element = await selector.getElement(state.currentDriver);
    const value = await element.getCssValue(this.props.property);

    this.logger.info(
      `Successfully got style property '${this.props.property}' value '${value}' of the element ${selector}`,
    );

    return value;
  }
}
