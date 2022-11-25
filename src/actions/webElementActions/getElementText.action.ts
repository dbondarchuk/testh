import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Type } from 'class-transformer';
import { SelectorOrElement } from '../../models/selector/selectorOrElement';

/**
 * Properties for {@link GetElementTextAction}
 */
export class GetElementTextActionProperties
  implements IActionProperties
{
  /**
   * Element selector
   */
  @Type(() => SelectorOrElement)
  selector: SelectorOrElement;
}

/** Runner type aliases for {@link GetElementTextAction} */
export const GetElementTextActionTypeAliases = [
  'get-text',
  'get-element-text',
] as const;

/**
 * Gets a web element text and returns it
 * @properties {@link GetElementTextActionProperties}
 * @runnerType {@link GetElementTextActionTypeAliases}
 * @returns {string} Element's text
 */
@Register(
  GetElementTextActionProperties,
  ...GetElementTextActionTypeAliases,
)
export class GetElementTextAction extends IAction<
  GetElementTextActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetElementTextActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetElementTextAction>(
      GetElementTextAction,
    );
  }

  public async run(state: State): Promise<string> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await selector.getElement(state.currentDriver);
    const elementText = await element.getText();

    this.logger.info(
      `Successfully got text '${elementText}' of the element ${selector}`,
    );

    return elementText;
  }
}
