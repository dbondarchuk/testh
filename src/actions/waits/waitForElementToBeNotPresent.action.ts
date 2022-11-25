import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Selector } from '../../models/selector/selector';
import { Type } from 'class-transformer';
import { Waits } from '../../helpers/selenium/waits';

/**
 * Properties for {@link WaitForElementToBeNotPresentAction}
 */
export class WaitForElementToBeNotPresentActionProperties
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

/** Runner type aliases for {@link WaitForElementToBeNotPresentAction}  */
export const WaitForElementToBeNotPresentActionPropertiesTypeAliases = [
  'wait-to-be-not-present',
] as const;

/**
 * Waits for a web element to be not present
 * @properties {@link WaitForElementToBeNotPresentActionProperties}
 * @runnerType {@link WaitForElementToBeNotPresentActionPropertiesTypeAliases}
 */
@Register(
  WaitForElementToBeNotPresentActionProperties,
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

  public async run(state: State): Promise<void> {
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
