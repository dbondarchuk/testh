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
import { By, WebElement } from 'selenium-webdriver';

/**
 * Properties for {@link GetElementChildrenAction}
 */
export class GetElementChildrenActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link GetElementChildrenAction} */
export const GetElementChildrenActionTypeAliases = [
  'get-children',
  'get-element-children',
  'children',
  'element-children',
] as const;

/**
 * Gets a list of element's children elements
 * @properties {@link GetElementChildrenActionProperties}
 * @runnerType {@link GetElementChildrenActionTypeAliases}
 * @result `WebElement[]` Element's children
 */
@Action(
  GetElementChildrenActionProperties,
  'Get element size',
  ...GetElementChildrenActionTypeAliases,
)
export class GetElementChildrenAction extends IAction<
  GetElementChildrenActionProperties,
  WebElement[]
> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementChildrenActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementChildrenAction>(
      GetElementChildrenAction,
    );
  }

  public async run(state: IState): Promise<WebElement[]> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await selector.getElement(state.currentDriver);
    const children = await element.findElements(By.xpath('.//*'));

    this.logger.info(
      `Successfully got ${children.length} child element(s) of the element ${selector}`,
    );

    return children;
  }
}
