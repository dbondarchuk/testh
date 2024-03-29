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
  ToNumber,
  ToSelectorOrElement,
} from '@testh/sdk';

/**
 * Properties for {@link WaitForElementToBeInteractableAction}
 */
export class WaitForElementToBeInteractableActionProperties
  implements IActionProperties
{
  /**
   * Element selector
   */
  @BindingProperty()
  @ToSelectorOrElement()
  selector: SelectorOrElement;

  /**
   * Wait timeout in seconds
   * @defaultValue `5`
   */
  @ToNumber()
  timeout?: number;
}

/** Action type aliases for {@link WaitForElementToBeInteractableActionTypeAliases} */
export const WaitForElementToBeInteractableActionTypeAliases = [
  'wait-to-be-interactable',
] as const;

/**
 * Waits for a web element to be interactable
 * @parameters {@link WaitForElementToBeInteractableActionProperties}
 * @runnerType {@link WaitForElementToBeInteractableActionTypeAliases}
 */
@Action(
  WaitForElementToBeInteractableActionProperties,
  'Wait for the element to be interactable',
  ...WaitForElementToBeInteractableActionTypeAliases,
)
export class WaitForElementToBeInteractableAction extends IAction<WaitForElementToBeInteractableActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForElementToBeInteractableActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<WaitForElementToBeInteractableAction>(
      WaitForElementToBeInteractableAction,
    );
  }

  public async run(state: IState): Promise<void> {
    const selector = this.props.selector;
    const timeout = this.props.timeout ?? 5;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(
      `Waiting for element ${selector} to be interactable for ${timeout} seconds.`,
    );

    const element = state.currentDriver.findElement(selector.by);

    await state.currentDriver.wait(
      async () => (await element.isDisplayed()) && (await element.isEnabled()),
      timeout * 1000,
      `Element ${selector} wasn't interactable for ${timeout} seconds`,
    );

    this.logger.info(`Element ${selector} was sucessfully located`);
  }
}
