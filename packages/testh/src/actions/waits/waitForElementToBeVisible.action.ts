import { until } from 'selenium-webdriver';
import { Type } from 'class-transformer';
import { Action, IAction, IActionProperties, ILogger, ILoggerFactory, IState, PropertyIsRequiredException, SelectorOrElement } from '@testh/sdk';

/**
 * Properties for {@link WaitForElementToBeVisibleAction}
 */
export class WaitForElementToBeVisibleActionProperties
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

export const WaitForElementToBeVisibleActionTypeAliases = [
  'wait-to-be-visible',
] as const;

/**
 * Waits for a web element to be visible
 * @properties {@link WaitForElementToBeVisibleActionProperties}
 * @runnerType {@link WaitForElementToBeVisibleAction}
 */
@Action(
  WaitForElementToBeVisibleActionProperties,
  ...WaitForElementToBeVisibleActionTypeAliases,
)
export class WaitForElementToBeVisibleAction extends IAction<WaitForElementToBeVisibleActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForElementToBeVisibleActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<WaitForElementToBeVisibleAction>(
      WaitForElementToBeVisibleAction,
    );
  }

  public async run(state: IState): Promise<void> {
    const selector = this.props.selector;
    const timeout = this.props.timeout ?? 5;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(
      `Waiting for element ${selector} to be visible for ${timeout} seconds.`,
    );

    const element = state.currentDriver.findElement(selector.by);

    await state.currentDriver.wait(
      until.elementIsVisible(element),
      timeout * 1000,
      `Element ${selector} wasn't visible for ${timeout} seconds`,
    );

    this.logger.info(`Element ${selector} was sucessfully located`);
  }
}
