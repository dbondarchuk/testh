import { until } from 'selenium-webdriver';
import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Selector } from '../../models/selector/selector';
import { Type } from 'class-transformer';

/**
 * Properties for {@link WaitForElementToBePresentAction}
 */
export class WaitForElementToBePresentActionProperties
  implements IActionProperties
{
  /**
   * Element selector
   */
  @Type(() => Selector)
  selector: Selector;

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
@Register(
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

  public async run(state: State): Promise<void> {
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
