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
} from '@testh/sdk';
import { Type } from 'class-transformer';

/**
 * Properties for {@link GetElementSizeAction}
 */
export class GetElementSizeActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @Type(() => SelectorOrElement)
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link GetElementSizeAction} */
export const GetElementSizeActionTypeAliases = [
  'get-size',
  'size',
  'element-size',
] as const;

/** Describes element's size in pixels */
export interface ElementSize {
  /** Element's width */
  width: number;

  /** Element's height */
  height: number;
}

/**
 * Gets an object with the element's size
 * @properties {@link GetElementSizeActionProperties}
 * @runnerType {@link GetElementSizeActionTypeAliases}
 * @returns {ElementSize} Element's size
 */
@Action(
  GetElementSizeActionProperties,
  'Get element size',
  ...GetElementSizeActionTypeAliases,
)
export class GetElementSizeAction extends IAction<
  GetElementSizeActionProperties,
  ElementSize
> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementSizeActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementSizeAction>(GetElementSizeAction);
  }

  public async run(state: IState): Promise<ElementSize> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await selector.getElement(state.currentDriver);
    const rect = await element.getRect();

    const size: ElementSize = {
      width: rect.width,
      height: rect.height
    };

    this.logger.info(
      `Successfully got size ${size.width}x${size.height} of the element ${selector}`,
    );

    return size;
  }
}
