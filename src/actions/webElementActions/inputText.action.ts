import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Type } from 'class-transformer';
import { SelectorOrElement } from '../../models/selector/selectorOrElement';
import { ToBoolean } from '../../helpers/types/boolean';

/**
 * Properties for {@link InputTextAction}
 */
export class InputTextActionProperties
  implements IActionProperties
{
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
@Register(
  InputTextActionProperties,
  ...InputTextActionTypeAliases,
)
export class InputTextAction extends IAction<InputTextActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: InputTextActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<InputTextAction>(
      InputTextAction,
    );
  }

  public async run(state: State): Promise<void> {
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
