import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  SelectorOrElement,
  ToBoolean,
} from '@testh/sdk';
import { Type } from 'class-transformer';

/**
 * Properties for {@link InputTextAction}
 */
export class InputTextActionProperties implements IActionProperties {
  /**
   * Element selector
   */
  @Type(() => SelectorOrElement)
  selector: SelectorOrElement;

  /**
   * Text to input
   */
  text?: string;

  /**
   * Determines whether element text should be cleared before the input
   */
  @ToBoolean()
  clear?: boolean;
}

/** Runner type aliases for {@link InputTextAction} */
export const InputTextActionTypeAliases = ['input', 'type'] as const;

/**
 * Inputs text into the web element
 * @properties {@link InputTextActionProperties}
 * @runnerType {@link InputTextActionTypeAliases}
 */
@Action(InputTextActionProperties, ...InputTextActionTypeAliases)
export class InputTextAction extends IAction<InputTextActionProperties> {
  private readonly logger: ILogger;
  constructor(props: InputTextActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<InputTextAction>(InputTextAction);
  }

  public async run(state: IState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await selector.getElement(state.currentDriver);

    if (this.props.clear) {
      this.logger.info(`Clearing input ${selector}`);
      await element.clear();

      this.logger.info(`Successfully cleared element ${selector}`);
    }

    if (this.props.text) {
      this.logger.info(`Typing ${this.props.text} into ${selector}`);
      await element.sendKeys(this.props.text);
      this.logger.info(`Successfully typed into element ${selector}`);
    }
  }
}
