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
 * Properties for {@link GetElementTextAction}
 */
export class GetElementTextActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link GetElementTextAction} */
export const GetElementTextActionTypeAliases = [
  'get-text',
  'get-element-text',
  'element-text',
] as const;

/**
 * Gets a web element text and returns it
 * @properties {@link GetElementTextActionProperties}
 * @runnerType {@link GetElementTextActionTypeAliases}
 * @result `string` Element's text
 */
@Action(
  GetElementTextActionProperties,
  'Get element text',
  ...GetElementTextActionTypeAliases,
)
export class GetElementTextAction extends IAction<
  GetElementTextActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementTextActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementTextAction>(GetElementTextAction);
  }

  public async run(state: IState): Promise<string> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await selector.getElement(state.currentDriver);
    const elementText = await element.getText();

    this.logger.info(
      `Successfully got text '${elementText}' of the element ${selector}`,
    );

    return elementText;
  }
}
