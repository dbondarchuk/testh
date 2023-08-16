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
 * Properties for {@link IsElementSelectedAction}
 */
export class IsElementSelectedActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @ToSelectorOrElement()
  @BindingProperty()
  selector: SelectorOrElement;
}

/** Action type aliases for {@link IsElementSelectedAction} */
export const IsElementSelectedActionTypeAliases = ['is-selected'] as const;

/**
 * Gets whether a web element is selected
 * @properties {@link IsElementSelectedActionProperties}
 * @runnerType {@link IsElementSelectedActionTypeAliases}
 * @result `boolean` Whether the element is selected
 */
@Action(
  IsElementSelectedActionProperties,
  'Get whether element is selected',
  ...IsElementSelectedActionTypeAliases,
)
export class IsElementSelectedAction extends IAction<
  IsElementSelectedActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: IsElementSelectedActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<IsElementSelectedAction>(
      IsElementSelectedAction,
    );
  }

  public async run(state: IState): Promise<boolean> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(`Checking if element ${selector} is selected`);

    const element = await selector.getElement(state.currentDriver);
    const isSelected = await element.isSelected();

    this.logger.info(
      `Element ${selector} is${!isSelected ? ' not' : ''} selected`,
    );
    return isSelected;
  }
}
