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
 * Properties for {@link GetElementTagAction}
 */
export class GetElementTagActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link GetElementTagAction} */
export const GetElementTagActionTypeAliases = [
  'get-tag',
  'get-element-tag',
  'element-tag',
  'tag',
] as const;

/**
 * Gets a web element tag name
 * @properties {@link GetElementTagActionProperties}
 * @runnerType {@link GetElementTagActionTypeAliases}
 * @result `string` Element's tag name
 */
@Action(
  GetElementTagActionProperties,
  'Get element tag name',
  ...GetElementTagActionTypeAliases,
)
export class GetElementTagAction extends IAction<
  GetElementTagActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementTagActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementTagAction>(GetElementTagAction);
  }

  public async run(state: IState): Promise<string> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await selector.getElement(state.currentDriver);
    const tagName = await element.getTagName();

    this.logger.info(
      `Successfully got name of the tag '${tagName}' of the element ${selector}`,
    );

    return tagName;
  }
}
