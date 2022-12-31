import { until } from 'selenium-webdriver';
import { Type } from 'class-transformer';
import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  SelectorOrElement,
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
  @Type(() => SelectorOrElement)
  selector: SelectorOrElement;

  /**
   * Wait timeout in seconds
   */
  @Type(() => Number)
  timeout: number;
}

/** Runner type aliases for {@link WaitForElementToBePresentAction} */
export const WaitForElementToBePresentActionTypeAliases = [
  'wait',
  'wait-to-be-present',
] as const;

/**
 * Waits for a web element to be present
 * @properties {@link WaitForElementToBePresentActionProperties}
 * @runnerType {@link WaitForElementToBePresentActionTypeAliases}
 */
@Action(
  WaitForElementToBePresentActionProperties,
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
