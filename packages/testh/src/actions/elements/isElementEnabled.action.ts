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
 * Properties for {@link IsElementEnabledAction}
 */
export class IsElementEnabledActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @Type(() => SelectorOrElement)
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link IsElementEnabledAction} */
export const IsElementEnabledActionTypeAliases = ['is-enabled'] as const;

/**
 * Gets whether a web element is enabled
 * @properties {@link IsElementEnabledActionProperties}
 * @runnerType {@link IsElementEnabledActionTypeAliases}
 * @returns {boolean} Whether the element is enabled
 */
@Action(
  IsElementEnabledActionProperties,
  'Get whether element is enabled',
  ...IsElementEnabledActionTypeAliases,
)
export class IsElementEnabledAction extends IAction<
  IsElementEnabledActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: IsElementEnabledActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<IsElementEnabledAction>(
      IsElementEnabledAction,
    );
  }

  public async run(state: IState): Promise<boolean> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(`Checking if element ${selector} is enabled`);

    const element = await selector.getElement(state.currentDriver);
    const isEnabled = await element.isDisplayed();

    this.logger.info(
      `Element ${selector} is${!isEnabled ? ' not' : ''} enabled`,
    );
    return isEnabled;
  }
}
