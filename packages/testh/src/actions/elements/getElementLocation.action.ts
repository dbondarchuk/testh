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
 * Properties for {@link GetElementLocationAction}
 */
export class GetElementLocationActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link GetElementLocationAction} */
export const GetElementLocationActionTypeAliases = [
  'get-location',
  'location',
  'element-location',
] as const;

/** Describes element's location based on top-left corner */
export interface ElementLocation {
  /** Location of the top left corner on x-axis */
  x: number;

  /** Location of the top left corner on y-axis */
  y: number;
}

/**
 * Gets an object with the element's location
 * @properties {@link GetElementLocationActionProperties}
 * @runnerType {@link GetElementLocationActionTypeAliases}
 * @returns {ElementLocation} Location of the element's top left corner in pixels relative to the document element
 */
@Action(
  GetElementLocationActionProperties,
  'Get element location',
  ...GetElementLocationActionTypeAliases,
)
export class GetElementLocationAction extends IAction<
  GetElementLocationActionProperties,
  ElementLocation
> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementLocationActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementLocationAction>(
      GetElementLocationAction,
    );
  }

  public async run(state: IState): Promise<ElementLocation> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await selector.getElement(state.currentDriver);
    const rect = await element.getRect();

    const size: ElementLocation = {
      x: rect.x,
      y: rect.y,
    };

    this.logger.info(
      `Successfully got location ${size.x}x${size.y} of the element ${selector}`,
    );

    return size;
  }
}
