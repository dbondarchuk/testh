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
 * Properties for {@link IsElementPresentAction}
 */
export class IsElementPresentActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @Type(() => SelectorOrElement)
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link IsElementPresentAction} */
export const IsElementPresentActionTypeAliases = ['is-present'] as const;

/**
 * Gets whether a web element is present
 * @properties {@link IsElementPresentActionProperties}
 * @runnerType {@link IsElementPresentActionTypeAliases}
 * @returns {boolean} Whether the element is present
 */
@Action(
  IsElementPresentActionProperties,
  'Get whether element is present',
  ...IsElementPresentActionTypeAliases,
)
export class IsElementPresentAction extends IAction<
  IsElementPresentActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: IsElementPresentActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<IsElementPresentAction>(
      IsElementPresentAction,
    );
  }

  public async run(state: IState): Promise<boolean> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(`Checking if element ${selector} is present`);
    try {
      await selector.getElement(state.currentDriver);
      this.logger.info(`Element ${selector} is present on the page`);

      return true;
    } catch {
      this.logger.info(`Element ${selector} is not present on the page`);
      return false;
    }
  }
}
