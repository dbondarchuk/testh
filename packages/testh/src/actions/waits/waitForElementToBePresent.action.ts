import { until } from 'selenium-webdriver';
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
 * Properties for {@link WaitForElementToBePresentAction}
 */
export class WaitForElementToBePresentActionProperties
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
  timeout: number;
}

/** Action type aliases for {@link WaitForElementToBePresentAction} */
export const WaitForElementToBePresentActionTypeAliases = [
  'wait-to-be-present',
] as const;

/**
 * Waits for a web element to be present
 * @properties {@link WaitForElementToBePresentActionProperties}
 * @runnerType {@link WaitForElementToBePresentActionTypeAliases}
 */
@Action(
  WaitForElementToBePresentActionProperties,
  'Wait for the element to be present',
  ...WaitForElementToBePresentActionTypeAliases,
)
export class WaitForElementToBePresentAction extends IAction<WaitForElementToBePresentActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForElementToBePresentActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<WaitForElementToBePresentAction>(
      WaitForElementToBePresentAction,
    );
  }

  public async run(state: IState): Promise<void> {
    const selector = this.props.selector;
    const timeout = this.props.timeout ?? 5;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(
      `Waiting for element ${selector} to be present and visible for ${timeout} seconds.`,
    );

    await state.currentDriver.wait(
      until.elementLocated(selector.by),
      timeout * 1000,
      `Element ${selector} wasn't present for ${timeout} seconds`,
    );

    this.logger.info(`Element ${selector} was sucessfully located`);
  }
}
