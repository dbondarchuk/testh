import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  SelectorOrElement,
  ToNumber,
  Waits,
} from '@testh/sdk';
import { Type } from 'class-transformer';

/**
 * Properties for {@link WaitForElementToBeNotPresentAction}
 */
export class WaitForElementToBeNotPresentActionProperties
  implements IActionProperties
{
  /**
   * Element selector
   */
  @Type(() => SelectorOrElement)
  selector: SelectorOrElement;

  /**
   * Wait timeout in seconds
   * @defaultValue `5`
   */
  @ToNumber()
  timeout?: number;
}

/** Action type aliases for {@link WaitForElementToBeNotPresentAction}  */
export const WaitForElementToBeNotPresentActionPropertiesTypeAliases = [
  'wait-to-be-not-present',
] as const;

/**
 * Waits for a web element to be not present
 * @properties {@link WaitForElementToBeNotPresentActionProperties}
 * @runnerType {@link WaitForElementToBeNotPresentActionPropertiesTypeAliases}
 */
@Action(
  WaitForElementToBeNotPresentActionProperties,
  'Wait for the element to be not present',
  ...WaitForElementToBeNotPresentActionPropertiesTypeAliases,
)
export class WaitForElementToBeNotPresentAction extends IAction<WaitForElementToBeNotPresentActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForElementToBeNotPresentActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<WaitForElementToBeNotPresentAction>(
      WaitForElementToBeNotPresentAction,
    );
  }

  public async run(state: IState): Promise<void> {
    const selector = this.props.selector;
    const timeout = this.props.timeout ?? 5;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    this.logger.info(
      `Waiting for element ${selector} to be not present for ${timeout} seconds.`,
    );

    await state.currentDriver.wait(
      Waits.untilNotPresent(this.props.selector.by),
      timeout * 1000,
      `Element ${selector} was present for ${timeout} seconds`,
    );

    this.logger.info(`Element ${selector} was sucessfully not found`);
  }
}
