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
 * Properties for {@link GetElementAttributeAction}
 */
export class GetElementAttributeActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  selector: SelectorOrElement;

  /**
   * Attribute to select.
   */
  attribute: string;
}

/** Action type aliases for {@link GetElementAttributeAction} */
export const GetElementAttributeActionTypeAliases = [
  'get-attribute',
  'attribute',
  'element-attribute',
] as const;

/**
 * Gets a web element attribute
 * @properties {@link GetElementAttributeActionProperties}
 * @runnerType {@link GetElementAttributeActionTypeAliases}
 * @result `string` Element's attribute value
 */
@Action(
  GetElementAttributeActionProperties,
  'Get element attribute',
  ...GetElementAttributeActionTypeAliases,
)
export class GetElementAttributeAction extends IAction<
  GetElementAttributeActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementAttributeActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementAttributeAction>(
      GetElementAttributeAction,
    );
  }

  public async run(state: IState): Promise<string> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    if (!this.props.attribute) {
      throw new PropertyIsRequiredException('attribute');
    }

    const element = await selector.getElement(state.currentDriver);
    const value = await element.getAttribute(this.props.attribute);

    this.logger.info(
      `Successfully got attribute '${this.props.attribute}' value '${value}' of the element ${selector}`,
    );

    return value;
  }
}
