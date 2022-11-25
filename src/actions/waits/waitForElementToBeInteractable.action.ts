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
 * Properties for {@link WaitForElementToBeInteractableAction}
 */
export class WaitForElementToBeInteractableActionProperties
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

/** Runner type aliases for {@link WaitForElementToBeInteractableActionTypeAliases} */
export const WaitForElementToBeInteractableActionTypeAliases = [
  'wait-to-be-interactable',
] as const;

/**
 * Waits for a web element to be interactable
 * @parameters {@link WaitForElementToBeInteractableActionProperties}
 * @runnerType {@link WaitForElementToBeInteractableActionTypeAliases}
 */
@Register(
  WaitForElementToBeInteractableActionProperties,
  ...WaitForElementToBeInteractableActionTypeAliases,
)
export class WaitForElementToBeInteractableAction extends IAction<WaitForElementToBeInteractableActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForElementToBeInteractableActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger =
      loggerFactory.get<WaitForElementToBeInteractableAction>(
        WaitForElementToBeInteractableAction,
      );
  }

  public async run(state: State): Promise<void> {
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
